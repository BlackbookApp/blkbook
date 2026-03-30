# Plan: CTA Buttons Selection Step

> Source PRD: prds/cta-buttons-step.md

## Architectural decisions

- **Schema**: New `cta_buttons text[]` column on `profiles` table, nullable, no default. Values are social link field keys (e.g. `"instagram"`, `"whatsapp"`), not URLs.
- **Null semantics**: `null` and `[]` are equivalent — both mean "no social buttons shown." No distinction between unconfigured and explicitly empty.
- **ProfileCTA contract**: `cta_buttons` controls only social link buttons. "Save Contact" and "Exchange Details" are always rendered, unaffected by this field.
- **Wizard flow**: 3 steps — Profile (1) → Buttons (2) → Content (3). Buttons step saves on Continue, not auto-save.
- **Available options**: Derived at render time from `social_links` keys that have non-empty values. Stored keys remain valid even if URL values change later.

---

## Phase 1: Schema + ProfileCTA Behavior

**User stories**: 4, 8, 9, 10

### What to build

Add the `cta_buttons` column to the database and wire it through the data layer so ProfileCTA can read and act on it. Update ProfileCTA's rendering logic: when `cta_buttons` is null or empty, render no social link buttons; when set, render only the listed buttons using their URLs from `social_links`. Save Contact and Exchange Details remain untouched.

At the end of this phase, existing profiles (which will have `cta_buttons = null`) will show only Save Contact and Exchange Details on their public page — a visible, verifiable behavior change.

### Acceptance criteria

- [ ] Migration applies cleanly and `cta_buttons` column exists on `profiles`
- [ ] `Profile` type includes `cta_buttons: string[] | null`
- [ ] `updateProfile` and `updateProfileAction` accept and persist `cta_buttons`
- [ ] Public profile with `cta_buttons = null` shows no social link buttons
- [ ] Public profile with `cta_buttons = []` shows no social link buttons
- [ ] Public profile with `cta_buttons = ["instagram", "email"]` shows exactly those two buttons
- [ ] Save Contact and Exchange Details always present regardless of `cta_buttons` value

---

## Phase 2: Buttons Selection Step in Wizard

**User stories**: 1, 2, 3, 5, 6, 7, 11, 12, 13

### What to build

Build the `StepButtons` component and integrate it into the edit-profile wizard as step 2 of 3.

The component shows two locked/informational rows ("Save Contact", "Exchange Details") followed by a selectable list of the user's filled-in social links. Up to 2 can be selected; selecting a third deselects the first. When 0 social links are filled, an empty state is shown directing the user to add links. The step is optional — skipping saves an empty selection.

The wizard page holds `selectedButtons` state initialized from `profile.cta_buttons`. On Continue from the Buttons step, `updateProfileAction` is called with the current selection before advancing to step 3. The progress bar and step counter reflect 3 total steps.

At the end of this phase, the full flow is complete: user picks buttons in the wizard, taps Continue, and their public profile immediately reflects the chosen buttons.

### Acceptance criteria

- [ ] Edit-profile wizard shows 3 steps with correct progress bar
- [ ] Buttons step renders "Save Contact" and "Exchange Details" as always-included (not selectable)
- [ ] Only social link keys with non-empty values appear as selectable options
- [ ] Selecting a 3rd option deselects the first selected
- [ ] Empty state shown when user has 0 social links filled in
- [ ] Tapping Continue saves selection via `updateProfileAction` then advances to step 3
- [ ] Tapping Back returns to step 1 without saving
- [ ] Re-entering the wizard initializes selection from the saved `cta_buttons` value
- [ ] Public profile reflects the saved selection after completing the wizard
