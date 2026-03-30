# Blackbook — AI Profile Builder Implementation Plan

_For Claude Code · One step at a time · Next.js + Supabase_

---

## Rules before starting

- Complete one step fully before moving to the next
- Test each step works before continuing
- Never modify the existing `profiles` table
- Every display component must follow the single `data` prop pattern — no internal fetching

---

## Phase 1 — Database & Config

---

### Step 1 — Add profile_components table to Supabase

Run this in the Supabase SQL editor.

**Create the table:**

```sql
create table profile_components (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid references profiles(id) on delete cascade,
  type          text not null,
  position      integer not null default 1000,
  data          jsonb not null default '{}',
  is_predefined boolean not null default false,
  ai_generated  boolean not null default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index on profile_components(profile_id, position);
```

**Add RLS policies:**

```sql
alter table profile_components enable row level security;

create policy "owner access"
  on profile_components for all
  using (profile_id in (
    select id from profiles where user_id = auth.uid()
  ));

create policy "public read for live profiles"
  on profile_components for select
  using (profile_id in (
    select id from profiles where is_published = true
  ));
```

**Add the atomic jsonb merge function:**

```sql
create or replace function merge_component_data(
  p_component_id uuid,
  p_patch        jsonb
)
returns profile_components language plpgsql security definer as $$
declare result profile_components;
begin
  update profile_components
  set data = data || p_patch, ai_generated = false, updated_at = now()
  where id = p_component_id
    and profile_id in (select id from profiles where user_id = auth.uid())
  returning * into result;
  if not found then raise exception 'Access denied'; end if;
  return result;
end; $$;
```

**Regenerate TypeScript types:**

```bash
supabase gen types typescript --project-id YOUR_ID > src/lib/database.types.ts
```

> **Important:** Do not modify the existing `profiles` table. The existing `role` field in `profiles` is the role_type — use it as-is.

---

### Step 2 — Create roleSchemas.ts

Create `src/config/roleSchemas.ts`

```ts
export type RoleType =
  | 'founder'
  | 'model'
  | 'creative'
  | 'professional'
  | 'investor'
  | 'consultant';

export type ComponentType =
  | 'hero'
  | 'bio'
  | 'ventures'
  | 'quote'
  | 'cta'
  | 'image_gallery'
  | 'press_strip'
  | 'client_list'
  | 'recognition'
  | 'social_stats'
  | 'secondary_image';

export const ROLE_SCHEMAS: Record<RoleType, ComponentType[]> = {
  founder: ['hero', 'bio', 'ventures', 'quote', 'press_strip', 'cta', 'recognition'],
  model: ['hero', 'quote', 'image_gallery', 'social_stats', 'cta'],
  creative: ['hero', 'bio', 'image_gallery', 'recognition', 'press_strip'],
  professional: ['hero', 'bio', 'cta', 'client_list', 'recognition'],
  investor: ['hero', 'bio', 'ventures', 'cta', 'recognition'],
  consultant: ['hero', 'bio', 'cta', 'client_list', 'quote'],
};

export const REQUIRED_COMPONENTS: Record<RoleType, ComponentType[]> = {
  founder: ['hero', 'bio'],
  model: ['hero'],
  creative: ['hero', 'bio'],
  professional: ['hero', 'bio'],
  investor: ['hero', 'bio'],
  consultant: ['hero', 'bio'],
};
```

---

### Step 3 — Create componentSchemas.ts

Create `src/config/componentSchemas.ts`

```ts
import { z } from 'zod';
import type { ComponentType } from './roleSchemas';

export const COMPONENT_SCHEMAS = {
  hero: z.object({
    name: z.string().min(1),
    image_url: z.string().url().nullable(),
    tagline: z.string().nullable(),
  }),
  bio: z.object({
    text: z.string().nullable(),
  }),
  image_gallery: z.object({
    images: z.array(
      z.object({
        url: z.string().url().nullable(),
        caption: z.string().nullable(),
      })
    ),
  }),
  press_strip: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        logo_url: z.string().url().nullable(),
      })
    ),
  }),
  cta: z.object({
    label: z.string().nullable(),
    url: z.string().url().nullable(),
  }),
  ventures: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        url: z.string().url().nullable(),
      })
    ),
  }),
  quote: z.object({
    text: z.string().nullable(),
    attributed: z.string().nullable(),
  }),
  recognition: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        year: z.string().nullable(),
      })
    ),
  }),
  client_list: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        logo_url: z.string().url().nullable(),
      })
    ),
  }),
  social_stats: z.object({
    items: z.array(
      z.object({
        platform: z.string(),
        count: z.string(),
      })
    ),
  }),
  secondary_image: z.object({
    url: z.string().url().nullable(),
    caption: z.string().nullable(),
  }),
};

export const COMPONENT_DEFAULTS: Record<ComponentType, unknown> = {
  hero: { name: null, image_url: null, tagline: null },
  bio: { text: null },
  image_gallery: { images: [] },
  press_strip: { items: [] },
  cta: { label: null, url: null },
  ventures: { items: [] },
  quote: { text: null, attributed: null },
  recognition: { items: [] },
  client_list: { items: [] },
  social_stats: { items: [] },
  secondary_image: { url: null, caption: null },
};
```

---

## Phase 2 — Supabase Data Layer

---

### Step 4 — Create src/lib/api/components.ts

All Supabase calls for `profile_components` live here. Nothing else queries this table directly.

```ts
import { supabase } from '../supabase';
import { COMPONENT_DEFAULTS } from '../../config/componentSchemas';
import type { ComponentType } from '../../config/roleSchemas';

// Bulk insert — called once after AI generates the component stack
export async function insertComponents(
  profileId: string,
  types: ComponentType[],
  isPredefined: boolean,
  dataOverrides?: unknown[]
) {
  const rows = types.map((type, i) => ({
    profile_id: profileId,
    type,
    position: (i + 1) * 1000,
    data: dataOverrides?.[i] ?? COMPONENT_DEFAULTS[type],
    is_predefined: isPredefined,
    ai_generated: !!dataOverrides,
  }));

  const { data, error } = await supabase.from('profile_components').insert(rows).select();

  if (error) throw error;
  return data;
}

// Atomic patch — only updates changed keys, never overwrites others
export async function patchComponentData(componentId: string, patch: Record<string, unknown>) {
  const { data, error } = await supabase.rpc('merge_component_data', {
    p_component_id: componentId,
    p_patch: patch,
  });

  if (error) throw error;
  return data;
}

// Add one component from the library — always goes to the bottom
export async function addComponentFromLibrary(profileId: string, type: ComponentType) {
  const { data: last } = await supabase
    .from('profile_components')
    .select('position')
    .eq('profile_id', profileId)
    .order('position', { ascending: false })
    .limit(1)
    .single();

  const { data, error } = await supabase
    .from('profile_components')
    .insert({
      profile_id: profileId,
      type,
      position: (last?.position ?? 0) + 1000,
      data: COMPONENT_DEFAULTS[type],
      is_predefined: false,
      ai_generated: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update position after reorder
export async function updateComponentPosition(componentId: string, newPosition: number) {
  const { data, error } = await supabase
    .from('profile_components')
    .update({ position: newPosition })
    .eq('id', componentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

## Phase 3 — Onboarding Flow

---

### Step 5 — Onboarding: Role selection screen

- Check if a role selection screen already exists in the codebase
- If it does — reuse it, just make sure it saves to `profiles.role` and navigates to step 2
- If not — create it with 6 options: Founder, Model, Creative, Professional, Investor, Consultant
- On selection: `update profiles set role = selectedRole where id = profileId`

> **Note:** The value saved must match exactly what `ROLE_SCHEMAS` expects — lowercase: `founder`, `model`, `creative`, `professional`, `investor`, `consultant`

---

### Step 6 — Onboarding: Name + hero photo screen

- Check if this screen exists — the existing "Essentials" step likely covers name and title
- Make sure hero photo upload is on this screen
- On submit: update `profiles.full_name`, `profiles.avatar_url`, `profiles.brand_statement`
- Upload hero photo to Supabase Storage bucket `profile-images` and save CDN URL to `avatar_url`

> **Why hero photo is here:** The photo must be collected before the AI runs so the first profile preview never looks empty. This is what makes the "wow moment" land.

---

### Step 7 — Onboarding: How to build screen

- Create a two-option screen — "Craft it for me" and "Build it myself"
- Show the role name in the AI option: `"We'll build your Founder profile for you"`
- AI option → navigate to Step 8 (import data)
- Manual option → navigate to existing step-by-step form, skipping already-answered steps

---

## Phase 4 — AI Path

---

### Step 8 — Import data screen

- Large textarea with ~10,000 character limit
- PDF file upload input (PDF only)
- Inline LinkedIn export instructions: Settings → Data Privacy → Get a copy → Download archive
- On submit: send `{ text, pdfBase64, profileId, roleType }` to `/api/generate-profile`
- Show loading screen with animated steps: "Reading your info" → "Choosing your layout" → "Almost done"
- On error: show retry screen — nothing is saved until generation succeeds
- On success: navigate to preview

---

### Step 9 — AI generation server route

Create `src/app/api/generate-profile/route.ts`

````ts
import Anthropic from '@anthropic-ai/sdk';
import { ROLE_SCHEMAS } from '@/config/roleSchemas';
import { COMPONENT_SCHEMAS, COMPONENT_DEFAULTS } from '@/config/componentSchemas';
import { insertComponents } from '@/lib/api/components';

const client = new Anthropic();

export async function POST(req: Request) {
  const { profileId, roleType, text, pdfBase64 } = await req.json();
  const types = ROLE_SCHEMAS[roleType];

  const prompt = `
    You are extracting profile data for a ${roleType} profile.
    Return a JSON object with one key per component type listed below.
    Rules:
    - If information is not found: return null for text fields, [] for arrays
    - Never invent or guess content
    - Never use placeholder text like "Add your bio here"
    - Only return what you actually found in the source

    Component types needed: ${types.join(', ')}

    Source material:
    ${text ?? ''}
  `;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return Response.json({ message: 'AI returned invalid JSON' }, { status: 400 });
  }

  // Validate each component — fall back to defaults rather than fail entirely
  const validated = types.map((type) => {
    const result = COMPONENT_SCHEMAS[type].safeParse(parsed[type]);
    return result.success ? result.data : COMPONENT_DEFAULTS[type];
  });

  const components = await insertComponents(profileId, types, true, validated);
  return Response.json({ components });
}
````

> **Allow extra time here.** After building this step, test with at least 3 different real LinkedIn PDFs. Test short bios, sparse profiles, and non-English text. Adjust the prompt until output is consistent across all 6 role types. This step commonly takes 8–12h total including testing.

---

## Phase 5 — Edit Flow & Components

---

### Step 10 — Create useComponentEditor hook

Create `src/hooks/useComponentEditor.ts`

```ts
import { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { patchComponentData } from '../lib/api/components';

function getDiff<T extends Record<string, unknown>>(original: T, updated: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(updated).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(original[k]))
  ) as Partial<T>;
}

export function useComponentEditor<T extends Record<string, unknown>>(component: {
  id: string;
  data: unknown;
}) {
  const [localData, setLocalData] = useState<T>(component.data as T);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useDebouncedCallback(async (patch: Partial<T>) => {
    setSaving(true);
    setError(null);
    try {
      await patchComponentData(component.id, patch as Record<string, unknown>);
    } catch {
      setError('Failed to save');
      setLocalData(component.data as T);
    } finally {
      setSaving(false);
    }
  }, 600);

  const onChange = useCallback(
    (newData: T) => {
      setLocalData(newData);
      save(getDiff(component.data as T, newData));
    },
    [save, component.data]
  );

  return { localData, onChange, saving, error };
}
```

---

### Step 11 — Adapt existing display components to config

Go through every existing display component and convert it to the single `data` prop pattern.

**The rule — every component must look like this:**

```tsx
function AnyComponent({ data }: { data: AnyComponentData }) {
  if (!data) return <EmptyState />
  return (
    // render data.* fields only — no fetching, no external calls
  )
}
```

**Checklist for each component:**

- [ ] Remove any internal `useEffect` + Supabase fetching
- [ ] Replace all props with a single `data` prop
- [ ] Match field names to the shape defined in `COMPONENT_DEFAULTS`
- [ ] Add null check on every text field — if null, show empty state
- [ ] Add empty array check on every array field — if `[]`, show empty state
- [ ] Test it renders correctly with the default empty data from `COMPONENT_DEFAULTS`

**Example conversion:**

```tsx
// Before — fetches own data, assumes values always exist
function BioComponent({ userId }: { userId: string }) {
  const [bio, setBio] = useState('');
  useEffect(() => {
    supabase
      .from('profiles')
      .select('bio')
      .eq('user_id', userId)
      .then(({ data }) => setBio(data.bio));
  }, [userId]);
  return <p>{bio}</p>;
}

// After — receives data as prop, handles null
function BioComponent({ data }: { data: { text: string | null } }) {
  if (!data.text) return <EmptyState message="Write a short description of what you do" />;
  return <p>{data.text}</p>;
}
```

---

### Step 12 — Build empty states for each component

Each component needs an empty state shown before content is added.

| Component       | Empty state message                        |
| --------------- | ------------------------------------------ |
| Hero            | "Add your name and photo"                  |
| Bio             | "Write a short description of what you do" |
| Ventures        | "Add your companies or projects"           |
| Quote           | "Add a quote that represents you"          |
| Press strip     | "Add press mentions"                       |
| Image gallery   | "Upload your portfolio images"             |
| Recognition     | "Add awards or credentials"                |
| Client list     | "Add clients you have worked with"         |
| Social stats    | "Add your social following"                |
| Secondary image | "Upload an image"                          |
| CTA             | "Add a call to action button"              |

---

### Step 13 — Build edit forms for each component

Create one edit form per component in `src/components/editors/`. Every form uses `useComponentEditor`. Changes autosave — no submit button.

**Pattern every editor must follow:**

```tsx
function BioEditor({ component }: { component: ProfileComponent }) {
  const { localData, onChange, saving, error } = useComponentEditor<BioData>(component);

  return (
    <div>
      {component.ai_generated && (
        <div className="ai-notice">AI generated — review before publishing</div>
      )}
      <textarea
        value={localData.text ?? ''}
        onChange={(e) => onChange({ ...localData, text: e.target.value })}
        placeholder="Write your bio"
      />
      {saving && <span>Saving…</span>}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

**Build each editor:**

- `HeroEditor` — name input, tagline input, photo upload
- `BioEditor` — textarea with character count
- `VenturesEditor` — list with add / edit / remove (name, description, URL)
- `QuoteEditor` — text input + optional attribution input
- `PressStripEditor` — list with add / remove (name + logo upload)
- `GalleryEditor` — image upload grid with remove
- `RecognitionEditor` — list with add / remove (title + year)
- `ClientListEditor` — list with add / remove (name + logo upload)
- `SocialStatsEditor` — list with add / remove (platform + count)
- `SecondaryImageEditor` — single image upload + caption input
- `CtaEditor` — label input + URL input

---

### Step 14 — Create editorMap.ts

Create `src/config/editorMap.ts`

```ts
import {
  HeroEditor,
  BioEditor,
  VenturesEditor,
  QuoteEditor,
  PressStripEditor,
  GalleryEditor,
  RecognitionEditor,
  ClientListEditor,
  SocialStatsEditor,
  SecondaryImageEditor,
  CtaEditor,
} from '../components/editors';

export const EDITOR_MAP = {
  hero: {
    label: 'Profile hero',
    description: 'Your name, photo and intro.',
    component: HeroEditor,
  },
  bio: { label: 'About you', description: 'What you do and who you are.', component: BioEditor },
  image_gallery: {
    label: 'Image gallery',
    description: 'A visual portfolio of your work.',
    component: GalleryEditor,
  },
  press_strip: {
    label: 'Press',
    description: 'Publications you have appeared in.',
    component: PressStripEditor,
  },
  cta: {
    label: 'Call to action',
    description: 'A button that sends visitors somewhere.',
    component: CtaEditor,
  },
  ventures: {
    label: 'Ventures',
    description: 'Companies or projects you have built.',
    component: VenturesEditor,
  },
  quote: {
    label: 'Quote',
    description: 'A line that captures how you think.',
    component: QuoteEditor,
  },
  recognition: {
    label: 'Recognition',
    description: 'Awards and credentials.',
    component: RecognitionEditor,
  },
  client_list: {
    label: 'Clients',
    description: 'Companies you have worked with.',
    component: ClientListEditor,
  },
  social_stats: {
    label: 'Social stats',
    description: 'Your platform reach.',
    component: SocialStatsEditor,
  },
  secondary_image: {
    label: 'Image',
    description: 'A single image with caption.',
    component: SecondaryImageEditor,
  },
};
```

---

### Step 15 — Build ProfileEditor shell

Create `src/components/ProfileEditor.tsx`

```tsx
import { useState } from 'react';
import { EDITOR_MAP } from '../config/editorMap';
import { REQUIRED_COMPONENTS } from '../config/roleSchemas';
import { patchComponentData } from '../lib/api/components';

export function ProfileEditor({ profile }: { profile: Profile }) {
  const [activeId, setActiveId] = useState(profile.profile_components[0]?.id);

  const components = [...profile.profile_components].sort((a, b) => a.position - b.position);

  const active = components.find((c) => c.id === activeId);

  return (
    <div className="editor-layout">
      <nav className="editor-nav">
        {components.map((c) => {
          const config = EDITOR_MAP[c.type];
          const required = REQUIRED_COMPONENTS[profile.role]?.includes(c.type);
          return (
            <button
              key={c.id}
              className={activeId === c.id ? 'active' : ''}
              onClick={() => setActiveId(c.id)}
            >
              {config.label}
              {required && <span className="required-mark">✱</span>}
              {c.ai_generated && <span className="ai-badge">AI</span>}
            </button>
          );
        })}
      </nav>

      {active && <EditorPanel key={active.id} component={active} roleType={profile.role} />}
    </div>
  );
}

function EditorPanel({ component, roleType }) {
  const config = EDITOR_MAP[component.type];
  const Editor = config.component;
  const required = REQUIRED_COMPONENTS[roleType]?.includes(component.type);

  return (
    <div className="editor-panel">
      <p className="step-label">Editing</p>
      <h2>{config.label.toUpperCase()}.</h2>
      <p className="step-sub">{config.description}</p>
      {component.ai_generated && (
        <div className="ai-notice">AI generated — review before publishing</div>
      )}
      <Editor component={component} />
      {!required && (
        <label className="visibility-toggle">
          <input
            type="checkbox"
            checked={component.is_visible ?? true}
            onChange={(e) => patchComponentData(component.id, { is_visible: e.target.checked })}
          />
          Show this section on my profile
        </label>
      )}
    </div>
  );
}
```

---

## Phase 6 — Preview, Library & Publish

---

### Step 16 — Build profile preview screen

- Fetch profile + all components ordered by position
- Render each component using its display version
- Show "AI generated — review this" banner on components where `ai_generated` is true
- Show image placeholder slots where image URLs are null
- Four action buttons: Edit content, Add images, Add sections, Publish
- "Edit content" → opens `ProfileEditor`
- "Add sections" → opens `ComponentLibrary`

---

### Step 17 — Build component library

Create `src/components/ComponentLibrary.tsx`

```tsx
import { addComponentFromLibrary } from '../lib/api/components';
import { EDITOR_MAP } from '../config/editorMap';
import type { ComponentType } from '../config/roleSchemas';

const ALL_LIBRARY_TYPES: ComponentType[] = [
  'image_gallery',
  'press_strip',
  'client_list',
  'recognition',
  'social_stats',
  'ventures',
  'quote',
  'cta',
  'secondary_image',
];

export function ComponentLibrary({ profile, onAdd }) {
  const existingTypes = new Set(profile.profile_components.map((c) => c.type));
  const available = ALL_LIBRARY_TYPES.filter((t) => !existingTypes.has(t));

  return (
    <div className="component-library">
      <p className="library-label">Add a section</p>
      {available.map((type) => {
        const config = EDITOR_MAP[type];
        return (
          <button
            key={type}
            className="library-item"
            onClick={() => addComponentFromLibrary(profile.id, type).then(onAdd)}
          >
            <span className="library-item-label">{config.label}</span>
            <span className="library-item-desc">{config.description}</span>
          </button>
        );
      })}
      {available.length === 0 && (
        <p className="library-empty">All available sections have been added.</p>
      )}
    </div>
  );
}
```

---

### Step 18 — Build publish gate

Create `src/lib/publishValidation.ts`

```ts
import { REQUIRED_COMPONENTS } from '../config/roleSchemas';
import { COMPONENT_SCHEMAS } from '../config/componentSchemas';
import { EDITOR_MAP } from '../config/editorMap';

export function getPublishErrors(profile): string[] {
  const errors: string[] = [];
  const required = REQUIRED_COMPONENTS[profile.role] ?? [];

  for (const type of required) {
    const component = profile.profile_components.find((c) => c.type === type);

    if (!component) {
      errors.push(`Missing section: ${EDITOR_MAP[type].label}`);
      continue;
    }

    const result = COMPONENT_SCHEMAS[type].safeParse(component.data);
    if (!result.success) {
      errors.push(`Incomplete: ${EDITOR_MAP[type].label}`);
      continue;
    }

    const hasNulls = Object.values(result.data as Record<string, unknown>).some((v) => v === null);

    if (hasNulls) {
      errors.push(`Please fill in your ${EDITOR_MAP[type].label} section`);
    }
  }

  return errors;
}
```

**In the publish button:**

- Run `getPublishErrors(profile)` on every render
- Disable publish button if `errors.length > 0`
- Show each error inline
- On publish: `update profiles set is_published = true where id = profileId`

---

### Step 19 — AI prompt iteration & QA

**AI prompt testing — do this before marking step 9 done:**

- [ ] Test generation for all 6 role types
- [ ] Test with a short bio (~100 words)
- [ ] Test with a full LinkedIn PDF export
- [ ] Test with a sparse LinkedIn PDF (few details filled in)
- [ ] Confirm `null` is returned for missing text fields — not invented content
- [ ] Confirm `[]` is returned for missing arrays — not `null`
- [ ] Adjust the prompt until results are consistent

**Full flow QA:**

- [ ] AI path: role → name/photo → import → preview → edit → publish
- [ ] Manual path: role → name/photo → manual form → preview → publish
- [ ] Component library: add a section → fill it in → publish
- [ ] Publish blocked when required fields are empty
- [ ] Upload a non-PDF file — show a clear error
- [ ] Edit after publishing — changes go live without re-publishing
- [ ] Mobile: all screens usable on a small viewport

---

## Estimate Summary

| Step                              | Low     | High    |
| --------------------------------- | ------- | ------- |
| 1. Add profile_components table   | 3h      | 5h      |
| 2. Create roleSchemas.ts          | 1h      | 2h      |
| 3. Create componentSchemas.ts     | 2h      | 2h      |
| 4. Supabase data layer            | 4h      | 6h      |
| 5. Onboarding — role selection    | 1h      | 1h      |
| 6. Onboarding — name + hero photo | 1h      | 2h      |
| 7. Onboarding — how to build      | 1h      | 2h      |
| 8. Import data screen             | 4h      | 6h      |
| 9. AI generation server route     | 8h      | 12h     |
| 10. useComponentEditor hook       | 1h      | 2h      |
| 11. Adapt display components      | 4h      | 8h      |
| 12. Empty states                  | 3h      | 5h      |
| 13. Edit forms per component      | 8h      | 10h     |
| 14. editorMap.ts                  | 1h      | 1h      |
| 15. ProfileEditor shell           | 3h      | 5h      |
| 16. Profile preview screen        | 4h      | 6h      |
| 17. Component library             | 3h      | 4h      |
| 18. Publish gate                  | 2h      | 3h      |
| 19. AI prompt iteration & QA      | 4h      | 6h      |
| **Total**                         | **62h** | **95h** |

|             | Low (62h) | High (95h) |
| ----------- | --------- | ---------- |
| At 6h / day | ~10 days  | ~16 days   |
| At 8h / day | ~8 days   | ~12 days   |

---

_Display components are already built and not included in this estimate. These figures cover new development only and assume the existing design system, Supabase project, and codebase are already in place._
