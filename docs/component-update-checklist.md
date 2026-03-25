# Component Library — Update Checklist

## Adding/Modifying a Component — All Touch Points

### Must-change files (always)

| File                                                     | What to change                                                                                                                                                                         |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config/componentSchemas.ts`                             | Add/update: `COMPONENT_SCHEMAS` (Zod schema), `ROLE_COMPONENT_SAMPLES` (per-role sample data), `ALL_COMPONENT_SAMPLES` (flat sample for test page), `COMPONENT_DEFAULTS` (empty state) |
| `config/roleSchemas.ts`                                  | Add type to `ComponentType` union; add component to relevant role arrays in `ROLE_SCHEMAS`                                                                                             |
| `config/displayMap.ts`                                   | Import display component + add entry to `DISPLAY_MAP` (label, description, component ref)                                                                                              |
| `config/editorMap.ts`                                    | Import editor component + add entry to `EDITOR_MAP`                                                                                                                                    |
| `components/profile-components/display/<Name>.tsx`       | Create or edit the display component                                                                                                                                                   |
| `components/profile-components/editors/<Name>Editor.tsx` | Create or edit the editor component                                                                                                                                                    |
| `components/profile-components/display/index.ts`         | Export the display component                                                                                                                                                           |
| `components/profile-components/editors/index.ts`         | Export the editor component                                                                                                                                                            |

### No changes needed (auto-wired)

- `app/test-components/page.tsx` — renders all `ALL_COMPONENT_SAMPLES` automatically
- `app/test-profile-components/[username]/page.tsx` — reads from DB via `ProfileComponentsView`
- `components/ProfileComponentsView.tsx` — resolves display component via `DISPLAY_MAP`
- `lib/data/components.ts`, `lib/api/components.ts`, `app/actions/components.ts` — generic CRUD, no component-specific logic

### Only if needed

- `contexts/profile-view-context.tsx` — only if the component needs new profile metadata (currently provides: profileId, firstName, username, role, photoUrl, socialLinks)

---

## Component Conventions

### Display component (`components/profile-components/display/`)

- Props: `{ data: YourComponentData }`
- Consume `useProfileView()` for interactive features (CTA buttons, etc.)
- Include empty state when data is incomplete
- Fonts: `font-granjon` for content, `font-helvetica` for UI chrome
- Colors: `text-bb-dark`, `bg-bb-cream`, `border-bb-rule`, `text-bb-muted`

### Editor component (`components/profile-components/editors/`)

- Props: `{ component: ProfileComponent }`
- Use `useComponentEditor<YourComponentData>()` for state, auto-save, and error handling
- Show "AI generated — review before publishing" banner if `component.ai_generated` is true
- Show saving/error status from hook
