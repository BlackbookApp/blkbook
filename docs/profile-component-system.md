# Profile Component System

## Overview

Public profiles are built from an ordered list of **profile components** stored in the `profile_components` table. Each component has a `type`, a `data` JSON blob, a `position` (integer, multiples of 1000), `is_visible`, and `is_predefined`.

The public profile page (`app/p/[username]/page.tsx`) fetches the components for a profile and passes them to `ProfileComponentsView`, which resolves each component type to a display React component via `DISPLAY_MAP` and renders them in order.

---

## Data flow

```
profiles (DB)
    └── getProfileComponents(profileId)       lib/data/components.ts
            └── ProfileComponentsView          components/ProfileComponentsView.tsx
                    └── DISPLAY_MAP[type]      config/displayMap.ts
                            └── <DisplayComponent data={...} />
```

The editor works the same way but uses `EDITOR_MAP` and renders editor components instead.

---

## Config files

| File                         | Purpose                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `config/roleSchemas.ts`      | `ComponentType` union + `ROLE_SCHEMAS` — which components each role gets on onboarding |
| `config/componentSchemas.ts` | Zod schemas per type, role sample data, flat samples for test page, empty defaults     |
| `config/displayMap.ts`       | Maps each `ComponentType` → display React component                                    |
| `config/editorMap.ts`        | Maps each `ComponentType` → editor React component                                     |

---

## Adding a new component — checklist

### 1. `config/roleSchemas.ts`

- Add the type string to the `ComponentType` union.
- Add it to relevant role arrays in `ROLE_SCHEMAS` (controls which roles get this component during onboarding).

### 2. `config/componentSchemas.ts`

Four places to update:

- **`COMPONENT_SCHEMAS`** — Zod schema for the data shape.
- **`ROLE_COMPONENT_SAMPLES`** — sample data per role (used by AI onboarding).
- **`ALL_COMPONENT_SAMPLES`** — single flat sample (used by the test page at `/test-components`).
- **`COMPONENT_DEFAULTS`** — the empty/default state inserted when a user adds this component manually.

### 3. Display component — `components/profile-components/display/<Name>.tsx`

- Props: `{ data: YourData }`
- Use `font-granjon` for content, `font-helvetica` for UI chrome.
- Use brand color tokens (`text-bb-dark`, `text-bb-muted`, `border-bb-rule`, `bg-bb-cream`).
- Include an `EmptyState` fallback — shown in the editor when data is incomplete. On the public profile, `ProfileComponentsView` filters out components with no meaningful data automatically (see **Empty state filtering** below).
- If the component needs "Save Contact / Exchange Details" CTAs, consume `useProfileView()` and render `<ProfileCTA>`. Do not hardcode CTA logic inside the display component.
- Export from `components/profile-components/display/index.ts`.

### 4. Editor component — `components/profile-components/editors/<Name>Editor.tsx`

- Props: `{ component: ProfileComponent }`
- Use `useComponentEditor<YourData>(component)` — gives you `localData`, `onChange` (auto-saves on change), `saving`, `error`.
- Show `saving` / `error` status inline.
- Export from `components/profile-components/editors/index.ts`.

### 5. `config/displayMap.ts`

- Import the display component.
- Add an entry: `{ label, description, component }`.

### 6. `config/editorMap.ts`

- Import the editor component.
- Add an entry.

---

## Updating an existing component

- **Data shape change** — update the Zod schema in `COMPONENT_SCHEMAS` and the samples/defaults. Existing DB rows will keep old data; handle missing fields defensively in the display/editor components with `?? null` or `?? []`.
- **Display-only change** — edit the display component only. No config changes needed.
- **Editor-only change** — edit the editor component only.

---

## Auto-wired — no changes needed

- `app/test-components/page.tsx` — renders all `ALL_COMPONENT_SAMPLES` automatically.
- `app/test-profile-components/[username]/page.tsx` — reads from DB via `ProfileComponentsView`.
- `components/ProfileComponentsView.tsx` — resolves type → component via `DISPLAY_MAP`.
- `lib/data/components.ts`, `app/actions/components.ts` — generic CRUD, no component-specific logic.

---

## How `ProfileComponentsView` works

`ProfileComponentsView` (`components/ProfileComponentsView.tsx`) is the public-profile renderer.

**Filtering:** components are only rendered if `is_visible = true` AND they have meaningful data. "Meaningful data" means at least one non-null, non-empty field in `data`. Two component types bypass this check and always render:

- `profile_hero_centered` — always shown (renders even if all fields are null).
- `action_buttons_secondary` — always shown (its CTA buttons come from context, not `data`).

**Scroll animations:** every component except `profile_hero_centered` is wrapped in a `ScrollReveal` that animates the component in/out as it enters and leaves the viewport. The animation direction adapts: scrolling down → element enters from below; scrolling back up → element enters from above. The footer uses a looser viewport margin (`0px`) so it triggers before the user hits the very bottom of the page.

**Hero animation:** `ProfileHeroCentered` has its own staggered entrance animation (name → portrait → CTAs) using Framer Motion `initial`/`animate`, since it is above the fold on load and does not need scroll-based triggering.

**`ProfileViewProvider`:** wraps the entire render tree. Display components that need profile metadata (name, username, social links, etc.) consume this via `useProfileView()`. Returns `null` outside a public profile context, so the same display components are safe to render in the editor.

---

## Context: `ProfileViewContextValue`

Provided by `ProfileViewProvider` in `ProfileComponentsView`. Contains:

| Field              | Type             | Notes                                                         |
| ------------------ | ---------------- | ------------------------------------------------------------- |
| `profileId`        | `string`         | DB id of the profile                                          |
| `profileOwnerId`   | `string`         | `user_id` of the profile owner                                |
| `profileFirstName` | `string`         | First name, used in modal copy                                |
| `profileUsername`  | `string`         | Used for share URLs                                           |
| `profileName`      | `string`         | Full name                                                     |
| `profileRole`      | `string \| null` | Job title/tagline                                             |
| `profilePhotoUrl`  | `string \| null` | Avatar URL                                                    |
| `socialLinks`      | `SocialLinks`    | Extracted from components via `extractContactsFromComponents` |

Only add new fields here if a display component genuinely needs profile-level metadata that is not already in its own `data` blob.
