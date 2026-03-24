# QA Plan: SocialStat + Action Buttons

## Setup

- One test profile created via the new builder (AI builder flow)
- One test profile created via the old edit-profile flow (has `profiles.social_links` populated)
- One browser session logged in as the profile owner
- One browser session logged in as a different auth user
- One browser session not logged in (incognito)

---

## 1. SocialStat — Editor

| #    | Action                                                   | Expected                                                                                                                                          |
| ---- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1  | Open builder editor, open SocialStat component           | Two sections visible: "Platforms" and "Custom links"                                                                                              |
| 1.2  | Click "+ Add platform"                                   | New row appears with Instagram pre-selected, handle input, followers input                                                                        |
| 1.3  | Change dropdown to each of the 9 platforms               | Dropdown updates; handle placeholder changes per platform (e.g. `@yourhandle` for Instagram, `yourname` for LinkedIn, `yoursite.com` for Website) |
| 1.4  | Enter a handle with leading `@` (e.g. `@johndoe`)        | Saves correctly                                                                                                                                   |
| 1.5  | Enter a handle without `@` (e.g. `johndoe`)              | Saves correctly                                                                                                                                   |
| 1.6  | Enter a follower count (e.g. `12.4K`)                    | Saves and displays                                                                                                                                |
| 1.7  | Leave follower count empty                               | Saves; no count shown in display                                                                                                                  |
| 1.8  | Click `×` on a known platform row                        | Row removed, auto-saves                                                                                                                           |
| 1.9  | Click "+ Add custom link"                                | New row appears with label input and URL input; no dropdown, no count                                                                             |
| 1.10 | Enter label `My Blog` and URL `https://blog.example.com` | Saves correctly                                                                                                                                   |
| 1.11 | Click `×` on a custom link row                           | Row removed                                                                                                                                       |
| 1.12 | Add 3 known platforms + 2 custom links, reload page      | All 5 items persist in correct sections                                                                                                           |

---

## 2. SocialStat — Public Profile Display

**Setup:** profile has Instagram `@johndoe` (48K), YouTube `@johndoe` (5K), Email `hello@test.com`, Website `mysite.com`, custom link `My Blog` → `https://blog.example.com`

| #   | Check                                                            | Expected                                                                                                                  |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | Load public profile                                              | Instagram icon + "48K", YouTube icon + "5K", Globe icon (My Blog), Mail icon (no count), Globe icon (website) all visible |
| 2.2 | Click Instagram icon                                             | Opens `https://instagram.com/johndoe` in new tab                                                                          |
| 2.3 | Click YouTube icon                                               | Opens `https://youtube.com/@johndoe` in new tab                                                                           |
| 2.4 | Click My Blog icon                                               | Opens `https://blog.example.com` in new tab                                                                               |
| 2.5 | Click email icon                                                 | Opens `mailto:hello@test.com`                                                                                             |
| 2.6 | Click website icon                                               | Opens `https://mysite.com` in new tab                                                                                     |
| 2.7 | Add `@` to stored handle in DB (e.g. `@johndoe`) — check display | Same URLs generated; `@` stripped correctly                                                                               |
| 2.8 | Profile with no SocialStat component                             | Empty state "Add your social following" shown                                                                             |
| 2.9 | Profile with SocialStat component but all items removed          | Empty state shown                                                                                                         |

**Per-platform URL generation:**

| Platform  | Handle input         | Expected URL                               |
| --------- | -------------------- | ------------------------------------------ |
| Instagram | `johndoe`            | `https://instagram.com/johndoe`            |
| TikTok    | `johndoe`            | `https://tiktok.com/@johndoe`              |
| YouTube   | `johndoe`            | `https://youtube.com/@johndoe`             |
| LinkedIn  | `johndoe`            | `https://linkedin.com/in/johndoe`          |
| Twitter/X | `johndoe`            | `https://x.com/johndoe`                    |
| Website   | `mysite.com`         | `https://mysite.com`                       |
| Website   | `https://mysite.com` | `https://mysite.com` (no double prefix)    |
| Email     | `hello@test.com`     | `mailto:hello@test.com`                    |
| Phone     | `+447700000000`      | `tel:+447700000000`                        |
| WhatsApp  | `+447700000000`      | `https://wa.me/447700000000` (digits only) |

---

## 3. Action Buttons — Editor Preview

| #   | Check                                    | Expected                                                                 |
| --- | ---------------------------------------- | ------------------------------------------------------------------------ |
| 3.1 | Open ActionButtons editor                | "Dynamic buttons" preview section visible at top                         |
| 3.2 | Default active tab                       | "Your view" active                                                       |
| 3.3 | "Your view" preview                      | Shows "Share Profile" (primary style) + "Edit Profile" (secondary style) |
| 3.4 | Click "Member view" tab                  | Shows "Add to Vault" (primary) + "Exchange Details" (secondary)          |
| 3.5 | Click "Guest view" tab                   | Shows "Save Contact" (primary) + "Exchange Details" (secondary)          |
| 3.6 | Click any preview button                 | Nothing happens (pointer-events-none)                                    |
| 3.7 | Buttons visually distinct from active UI | Preview buttons are `opacity-50`                                         |
| 3.8 | "Custom buttons" section below preview   | Visible; "+ Add button" works as before                                  |

---

## 4. Action Buttons — Public Profile (3 viewer types)

**Setup:** profile has Email `hello@test.com`, WhatsApp `+447700123456`, Website `https://mysite.com` in SocialStat. Profile also has one custom CTA button "Book a call" → `https://cal.com/test`.

### Owner session

| #    | Check                   | Expected                                  |
| ---- | ----------------------- | ----------------------------------------- |
| 4.1  | Load own public profile | "Share Profile" primary button visible    |
| 4.2  |                         | EMAIL shortcut button visible             |
| 4.3  |                         | WEBSITE shortcut button visible           |
| 4.4  |                         | WHATSAPP shortcut button visible          |
| 4.5  |                         | "Edit Profile" secondary button visible   |
| 4.6  |                         | "Book a call" custom button visible below |
| 4.7  | Click Share Profile     | Share modal opens                         |
| 4.8  | Click Edit Profile      | Navigates to edit profile page            |
| 4.9  | Click EMAIL             | Opens `mailto:hello@test.com`             |
| 4.10 | Click WEBSITE           | Opens `https://mysite.com` in new tab     |
| 4.11 | Click WHATSAPP          | Opens WhatsApp link in new tab            |

### Auth user (not owner) session

| #    | Check                             | Expected                                             |
| ---- | --------------------------------- | ---------------------------------------------------- |
| 4.12 | Load profile                      | "Add to Vault" primary button visible                |
| 4.13 |                                   | Contact shortcuts (EMAIL, WEBSITE, WHATSAPP) visible |
| 4.14 |                                   | "Exchange Details" secondary button visible          |
| 4.15 |                                   | "Book a call" custom button visible                  |
| 4.16 | Click "Add to Vault"              | Button changes to "In Vault"; contact saved          |
| 4.17 | Reload page                       | Button shows "In Vault" (persisted)                  |
| 4.18 | Vault contact data                | Includes email and phone from SocialStat             |
| 4.19 | Click "Exchange Details"          | Exchange modal opens                                 |
| 4.20 | After completing exchange, reload | Button shows "Exchanged" and is disabled             |

### Guest (not logged in) session

| #    | Check                    | Expected                                    |
| ---- | ------------------------ | ------------------------------------------- |
| 4.21 | Load profile             | "Save Contact" primary button visible       |
| 4.22 |                          | Contact shortcuts visible                   |
| 4.23 |                          | "Exchange Details" secondary button visible |
| 4.24 |                          | "Book a call" custom button visible         |
| 4.25 | Click "Save Contact"     | vCard download initiated                    |
| 4.26 | Click "Exchange Details" | Guest exchange modal opens                  |

---

## 5. Edge Cases

| #   | Scenario                                                       | Expected                                                                           |
| --- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 5.1 | Profile has no SocialStat component                            | No contact shortcuts in action buttons; dynamic CTA still renders correctly        |
| 5.2 | SocialStat has email but no website/whatsapp                   | Only EMAIL shortcut appears                                                        |
| 5.3 | SocialStat has website stored as `mysite.com` (no https)       | `https://mysite.com` used in WEBSITE shortcut                                      |
| 5.4 | Old profile (contacts in `profiles.social_links`, no builder)  | Old profile CTA unaffected — `buildSocials()` and `profileFromDB()` path unchanged |
| 5.5 | Profile has custom CTA buttons but no dynamic social shortcuts | Dynamic buttons + custom CTAs render; no empty space from missing shortcuts        |
| 5.6 | Profile has no custom CTA buttons                              | Only dynamic section renders; no empty block below                                 |
| 5.7 | SocialStat has WhatsApp `+44 7700 000000` (with spaces)        | `wa.me/447700000000` — spaces stripped correctly                                   |
| 5.8 | Custom social link with empty label or empty URL               | Does not render on public profile (no broken links)                                |
