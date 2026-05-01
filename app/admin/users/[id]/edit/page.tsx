'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { OnboardingProgress } from '@/components/onboarding-v2/OnboardingProgress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { routes } from '@/lib/routes';
import { useImageUpload } from '@/hooks/use-image-upload';
import { AdminPatchEditorProvider } from '@/contexts/component-editor';
import { Button } from '@/components/ui/button';
import { EDITOR_MAP } from '@/config/editorMap';
import { DISPLAY_MAP } from '@/config/displayMap';
import { cn } from '@/lib/utils';
import { authTokens } from '@/components/edit-profile/step1';
import {
  getUserForEditAction,
  updateAuthUserAction,
  updateUserProfileFieldsAction,
  patchUserComponentAction,
  patchComponentVisibilityAction,
  type UserForEdit,
} from '@/app/actions/admin-users';
import type { ComponentType } from '@/config/roleSchemas';
import type { ProfileComponent } from '@/lib/data/components';

const { helvetica, granjon, card, inkSoft, muted, hairline, hairlineSoft } = authTokens;

const EXAMPLE_ATTRIBUTION: Partial<Record<ComponentType, string>> = {
  quote_block: "— Harper's Bazaar",
};

const EXAMPLE_COPY: Partial<Record<ComponentType, string>> = {
  top_bio:
    "Specialising in timeless, fine-art weddings across Europe and beyond. My work has been featured in Vogue, Elle, and Harper's Bazaar.",
  quote_block: 'Named one of the top wedding photographers in the world.',
  venture_card: 'Founder of Atelier Studio and co-creator of the Lumen Design System.',
  experience_timeline: 'Creative Director at LVMH, previously Head of Brand at Spotify.',
  portfolio_card: 'Selected projects from five years of independent creative practice.',
  image_portfolio: 'A curated selection of editorial and commercial photography.',
  image_gallery: 'Behind the scenes and finished work, side by side.',
  client_list: 'Apple, Chanel, The Guardian, Nike, and Tiffany & Co.',
  recognition_list: 'D&AD Yellow Pencil · Cannes Lions Grand Prix · Forbes 30 Under 30.',
  press_strip: 'As seen in The New York Times, Monocle, and Wallpaper*.',
  about_section: 'A longer introduction — your background, values, and what drives your work.',
  now_block: 'Writing a book on design systems. Based in Lisbon until June.',
  logo: 'Your studio or personal brand mark, displayed prominently.',
};

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[10px] uppercase tracking-widest text-bb-muted mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

const CONTACT_BUTTONS = [
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/you' },
  { id: 'whatsapp', label: 'WhatsApp', placeholder: '+44 7700 000000' },
  { id: 'email', label: 'Email', placeholder: 'hello@you.com' },
  { id: 'phone', label: 'Phone', placeholder: '+44 7700 000000' },
  { id: 'website', label: 'Website', placeholder: 'yoursite.com' },
];

const SOCIAL_BUTTONS = [
  { id: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
  { id: 'tiktok', label: 'TikTok', placeholder: '@yourhandle' },
  { id: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@you' },
];

const CONTACT_IDS = new Set<string>(CONTACT_BUTTONS.map((b) => b.id));

function ContactButtonRow({
  id,
  label,
  placeholder,
  isSelected,
  isDisabled,
  value,
  onToggle,
  onValueChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  isSelected: boolean;
  isDisabled: boolean;
  value: string;
  onToggle: () => void;
  onValueChange: (v: string) => void;
}) {
  return (
    <div className="border border-border mb-2">
      <button
        type="button"
        onClick={onToggle}
        disabled={isDisabled}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-opacity hover:opacity-80 disabled:opacity-30"
      >
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
            isSelected ? 'bg-foreground border-foreground' : 'border-border'
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-background" strokeWidth={3} />}
        </span>
        <span className="flex-1 text-[11px] tracking-widest">{label}</span>
      </button>
      <div className="border-t border-border">
        <input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3 text-[12px] font-helvetica text-foreground focus:outline-none placeholder:text-bb-muted/50"
        />
      </div>
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

interface EditState {
  email: string;
  password: string;
  fullName: string;
  roleTitle: string;
  company: string;
  location: string;
  avatarUrl: string | null;
  avatarPreview: string | null;
  selectedButtons: string[];
  buttonValues: Record<string, string>;
  membershipType: 'guest' | 'member';
  isPublished: boolean;
  isAdmin: boolean;
  username: string;
}

function StepCredentialsEdit({
  state,
  update,
}: {
  state: EditState;
  update: (p: Partial<EditState>) => void;
}) {
  return (
    <div>
      <FieldRow label="Email">
        <Input
          type="email"
          value={state.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="user@example.com"
          autoFocus
        />
      </FieldRow>
      <FieldRow label="New Password">
        <Input
          type="password"
          value={state.password}
          onChange={(e) => update({ password: e.target.value })}
          placeholder="Leave blank to keep current password"
        />
      </FieldRow>
    </div>
  );
}

function StepEssentialsEdit({
  state,
  update,
}: {
  state: EditState;
  update: (p: Partial<EditState>) => void;
}) {
  return (
    <div>
      <FieldRow label="Full Name">
        <Input
          value={state.fullName}
          onChange={(e) => update({ fullName: e.target.value })}
          placeholder="As they want to be known"
          autoFocus
        />
      </FieldRow>
      <FieldRow label="Role / Title">
        <Input
          value={state.roleTitle}
          onChange={(e) => update({ roleTitle: e.target.value })}
          placeholder="What they do"
        />
      </FieldRow>
      <FieldRow label="Company">
        <Input
          value={state.company}
          onChange={(e) => update({ company: e.target.value })}
          placeholder="Where they work"
        />
      </FieldRow>
      <FieldRow label="Location">
        <Input
          value={state.location}
          onChange={(e) => update({ location: e.target.value })}
          placeholder="City, Country"
        />
      </FieldRow>
    </div>
  );
}

function StepPhotoEdit({
  preview,
  uploading,
  uploadError,
  onChange,
}: {
  preview: string | null;
  uploading: boolean;
  uploadError: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputId = 'admin-user-edit-avatar-upload';
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <input id={inputId} type="file" accept="image/*" className="sr-only" onChange={onChange} />
      <label
        htmlFor={inputId}
        className="relative w-36 h-36 rounded-full overflow-hidden flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer"
        style={{ border: '2px dashed var(--bb-rule, #e4e0da)', background: '#f2f1ed' }}
        aria-label="Upload profile photo"
      >
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] uppercase tracking-widest text-bb-muted">Upload</span>
        )}
      </label>
      {uploading ? (
        <p className="text-[10px] uppercase tracking-widest text-bb-muted animate-pulse">
          Uploading…
        </p>
      ) : (
        <p className="text-[11px] text-bb-muted font-light text-center">
          {preview ? 'Click to change photo' : 'Portraits work best. Square or vertical.'}
        </p>
      )}
      {uploadError && (
        <p className="text-[11px] text-red-500 font-helvetica text-center">{uploadError}</p>
      )}
    </div>
  );
}

function StepContactsEdit({
  state,
  update,
}: {
  state: EditState;
  update: (p: Partial<EditState>) => void;
}) {
  const selectedContacts = state.selectedButtons.filter((id) => CONTACT_IDS.has(id));

  const toggle = (id: string) => {
    const next = state.selectedButtons.includes(id)
      ? state.selectedButtons.filter((b) => b !== id)
      : [...state.selectedButtons, id];
    update({ selectedButtons: next });
  };

  const setValue = (id: string, val: string) => {
    update({ buttonValues: { ...state.buttonValues, [id]: val } });
  };

  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-bb-muted mb-3">
        Contact buttons (max 2)
      </p>
      {CONTACT_BUTTONS.map((btn) => {
        const isSelected = state.selectedButtons.includes(btn.id);
        const atLimit = !isSelected && selectedContacts.length >= 2;
        return (
          <ContactButtonRow
            key={btn.id}
            id={btn.id}
            label={btn.label}
            placeholder={btn.placeholder}
            isSelected={isSelected}
            isDisabled={atLimit}
            value={state.buttonValues[btn.id] ?? ''}
            onToggle={() => toggle(btn.id)}
            onValueChange={(v) => setValue(btn.id, v)}
          />
        );
      })}
      <p className="text-[9px] uppercase tracking-widest text-bb-muted mb-3 mt-6">Socials</p>
      {SOCIAL_BUTTONS.map((btn) => {
        const isSelected = state.selectedButtons.includes(btn.id);
        return (
          <ContactButtonRow
            key={btn.id}
            id={btn.id}
            label={btn.label}
            placeholder={btn.placeholder}
            isSelected={isSelected}
            isDisabled={false}
            value={state.buttonValues[btn.id] ?? ''}
            onToggle={() => toggle(btn.id)}
            onValueChange={(v) => setValue(btn.id, v)}
          />
        );
      })}
    </div>
  );
}

function StepComponentsLive({
  components,
  patchOverride,
}: {
  components: ProfileComponent[];
  patchOverride: (componentId: string, patch: Record<string, unknown>) => Promise<void>;
}) {
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(components.map((c) => [c.id, c.is_visible]))
  );

  const handleHide = async (id: string) => {
    setVisibilityMap((prev) => ({ ...prev, [id]: false }));
    await patchComponentVisibilityAction(id, false);
  };

  const handleShow = async (id: string) => {
    setVisibilityMap((prev) => ({ ...prev, [id]: true }));
    await patchComponentVisibilityAction(id, true);
  };

  const visibleComponents = components
    .filter((c) => visibilityMap[c.id])
    .sort((a, b) => a.position - b.position);

  const hiddenComponents = components
    .filter((c) => !visibilityMap[c.id])
    .sort((a, b) => a.position - b.position);

  return (
    <AdminPatchEditorProvider patchOverride={patchOverride}>
      <div className="space-y-4 mb-4">
        <AnimatePresence initial={false}>
          {visibleComponents.map((component) => {
            const type = component.type as ComponentType;
            const entry = EDITOR_MAP[type];
            if (!entry) return null;
            const example = EXAMPLE_COPY[type];
            const attribution = EXAMPLE_ATTRIBUTION[type];
            const EditorComponent = entry.component;

            return (
              <motion.div
                key={component.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-[6px] overflow-hidden"
                style={{ background: card, border: `1px solid ${hairline}` }}
              >
                <div
                  className="flex items-center justify-between px-4 pt-3.5 pb-3"
                  style={{ borderBottom: `1px solid ${hairlineSoft}` }}
                >
                  <span
                    style={{
                      fontFamily: helvetica,
                      fontSize: '11px',
                      color: inkSoft,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {entry.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleHide(component.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
                    aria-label={`Hide ${entry.label}`}
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: muted }} />
                  </button>
                </div>

                {(example || type === 'logo') && (
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: `1px solid ${hairlineSoft}`, background: '#f7f5ee' }}
                  >
                    <p
                      className="uppercase mb-1.5"
                      style={{
                        fontFamily: helvetica,
                        fontSize: '9.5px',
                        letterSpacing: '0.22em',
                        color: muted,
                      }}
                    >
                      Example
                    </p>
                    <p
                      className="text-[12.5px] italic leading-[1.65]"
                      style={{ fontFamily: granjon, color: inkSoft }}
                    >
                      &ldquo;{example}&rdquo;
                    </p>
                    {attribution && (
                      <p
                        className="mt-1.5"
                        style={{
                          fontFamily: helvetica,
                          fontSize: '10px',
                          letterSpacing: '0.04em',
                          color: muted,
                        }}
                      >
                        {attribution}
                      </p>
                    )}
                  </div>
                )}

                <div className="px-4 py-4 [&_input]:font-granjon [&_textarea]:font-granjon">
                  <EditorComponent component={component} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {hiddenComponents.length > 0 && (
        <div className="mb-4">
          <p
            className="mb-3"
            style={{
              fontFamily: helvetica,
              fontSize: '9.5px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: muted,
            }}
          >
            Add a section
          </p>
          <div className="flex flex-wrap gap-2">
            {hiddenComponents.map((component) => {
              const type = component.type as ComponentType;
              const entry = EDITOR_MAP[type];
              if (!entry) return null;
              return (
                <button
                  key={component.id}
                  type="button"
                  onClick={() => handleShow(component.id)}
                  className="transition-opacity hover:opacity-70"
                  style={{
                    fontFamily: helvetica,
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    border: `1px solid ${hairline}`,
                    borderRadius: '4px',
                    padding: '6px 12px',
                    color: inkSoft,
                  }}
                >
                  + {entry.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </AdminPatchEditorProvider>
  );
}

function StepSettingsEdit({
  state,
  update,
}: {
  state: EditState;
  update: (p: Partial<EditState>) => void;
}) {
  return (
    <div>
      <FieldRow label="Username">
        <Input
          value={state.username}
          onChange={(e) => update({ username: e.target.value })}
          placeholder="username"
        />
      </FieldRow>
      <FieldRow label="Membership Type">
        <div className="flex gap-1 pt-1">
          {(['guest', 'member'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => update({ membershipType: type })}
              className={`text-[10px] uppercase tracking-widest px-4 py-2 transition-colors ${
                state.membershipType === type
                  ? 'bg-foreground text-background'
                  : 'border border-border text-bb-muted hover:text-foreground hover:border-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </FieldRow>
      <div className="flex items-center justify-between py-4 border-b border-border">
        <div>
          <p className="text-[11px] uppercase tracking-widest">Published</p>
          <p className="text-[10px] text-bb-muted font-light mt-0.5">
            Profile is visible at their public URL
          </p>
        </div>
        <Switch checked={state.isPublished} onCheckedChange={(v) => update({ isPublished: v })} />
      </div>
      <div className="flex items-center justify-between py-4 border-b border-border">
        <div>
          <p className="text-[11px] uppercase tracking-widest">Admin access</p>
          <p className="text-[10px] text-bb-muted font-light mt-0.5">Can access the admin panel</p>
        </div>
        <Switch checked={state.isAdmin} onCheckedChange={(v) => update({ isAdmin: v })} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STEP_LABELS = [
  'Step 1 — Credentials',
  'Step 2 — Essentials',
  'Step 3 — Photo',
  'Step 4 — Contacts',
  'Step 5 — Components',
  'Step 6 — Settings',
];

export default function EditUserPage() {
  const { id: profileId } = useParams<{ id: string }>();
  const router = useRouter();

  const [original, setOriginal] = useState<UserForEdit | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(0);
  const [state, setState] = useState<EditState>({
    email: '',
    password: '',
    fullName: '',
    roleTitle: '',
    company: '',
    location: '',
    avatarUrl: null,
    avatarPreview: null,
    selectedButtons: [],
    buttonValues: {},
    membershipType: 'guest',
    isPublished: true,
    isAdmin: false,
    username: '',
  });
  const [stepError, setStepError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { upload, uploading, uploadError } = useImageUpload({
    bucket: 'avatars',
    buildPath: (userId, file) => {
      const ext = file.name.split('.').pop() ?? 'jpg';
      return `${userId}/new-user-${Date.now()}.${ext}`;
    },
  });
  useEffect(() => {
    getUserForEditAction(profileId).then((data) => {
      if (!data) return;
      setOriginal(data);
      setState({
        email: data.email,
        password: '',
        fullName: data.fullName,
        roleTitle: data.roleTitle,
        company: data.company,
        location: data.location,
        avatarUrl: data.avatarUrl,
        avatarPreview: data.avatarUrl,
        selectedButtons: data.selectedButtons,
        buttonValues: data.buttonValues,
        membershipType: data.membershipType,
        isPublished: data.isPublished,
        isAdmin: data.isAdmin,
        username: data.username,
      });
      setLoading(false);
    });
  }, [profileId]);

  const update = (patch: Partial<EditState>) => setState((s) => ({ ...s, ...patch }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStepError(null);
    update({ avatarPreview: URL.createObjectURL(file) });
    const url = await upload(file);
    if (url) update({ avatarUrl: url });
    else setStepError('Photo upload failed. Please check the error below and try again.');
    e.target.value = '';
  };

  // Stable patch override used by component editors in step 5
  const patchOverride = useCallback(async (componentId: string, patch: Record<string, unknown>) => {
    const result = await patchUserComponentAction(componentId, patch);
    if (result.error) console.error('Component patch failed:', result.error);
  }, []);

  const saveCurrentStep = async (): Promise<{ error: string | null }> => {
    if (!original) return { error: 'No data loaded' };

    switch (step) {
      case 0: {
        // Credentials: save if email changed or password provided
        const emailChanged = state.email.trim() !== original.email;
        const hasPassword = state.password.trim().length > 0;
        if (!emailChanged && !hasPassword) return { error: null };
        return updateAuthUserAction(original.userId, {
          email: emailChanged ? state.email : undefined,
          password: hasPassword ? state.password : undefined,
        });
      }

      case 1: {
        // Essentials: update profile row + hero component
        const profilePatch: Record<string, unknown> = {
          full_name: state.fullName || null,
          role: state.roleTitle || null,
          location: state.location || null,
        };
        const { error: profileErr } = await updateUserProfileFieldsAction(
          original.profileId,
          profilePatch
        );
        if (profileErr) return { error: profileErr };
        if (original.heroComponentId) {
          return patchUserComponentAction(original.heroComponentId, {
            name: state.fullName || null,
            tagline: state.roleTitle || null,
            company: state.company || null,
            location: state.location || null,
          });
        }
        return { error: null };
      }

      case 2: {
        // Photo: only save if avatar changed
        if (state.avatarUrl === original.avatarUrl) return { error: null };
        const { error: profileErr } = await updateUserProfileFieldsAction(original.profileId, {
          avatar_url: state.avatarUrl,
        });
        if (profileErr) return { error: profileErr };
        if (original.heroComponentId) {
          return patchUserComponentAction(original.heroComponentId, {
            image_url: state.avatarUrl,
          });
        }
        return { error: null };
      }

      case 3: {
        // Contacts: save profile row + patch social_stat component
        const socialLinks = Object.fromEntries(
          Object.entries(state.buttonValues).filter(([, v]) => v.trim().length > 0)
        );
        const { error: profileErr } = await updateUserProfileFieldsAction(original.profileId, {
          social_links: socialLinks,
          cta_buttons: state.selectedButtons,
        });
        if (profileErr) return { error: profileErr };

        // Update social_stat component to mirror the social handles
        const socialStatComponent = original.components.find((c) => c.type === 'social_stat');
        if (socialStatComponent) {
          const existingItems =
            (
              socialStatComponent.data as {
                items?: Array<{ platform: string; count: string | null }>;
              }
            )?.items ?? [];
          const existingCountByPlatform = Object.fromEntries(
            existingItems.map((i) => [i.platform.toLowerCase(), i.count])
          );
          const SOCIAL_MAP: Record<string, { platform: string; buildUrl: (v: string) => string }> =
            {
              instagram: {
                platform: 'Instagram',
                buildUrl: (v) => `https://instagram.com/${v.replace(/^@/, '')}`,
              },
              tiktok: {
                platform: 'TikTok',
                buildUrl: (v) => `https://tiktok.com/@${v.replace(/^@/, '')}`,
              },
              youtube: {
                platform: 'YouTube',
                buildUrl: (v) => (v.startsWith('http') ? v : `https://${v}`),
              },
              linkedin: {
                platform: 'LinkedIn',
                buildUrl: (v) => (v.startsWith('http') ? v : `https://${v}`),
              },
            };
          const items = Object.entries(SOCIAL_MAP)
            .filter(([key]) => state.buttonValues[key]?.trim())
            .map(([key, { platform, buildUrl }]) => {
              const value = state.buttonValues[key].trim();
              return {
                platform,
                handle: value,
                count: existingCountByPlatform[platform.toLowerCase()] ?? null,
                url: buildUrl(value),
              };
            });
          const { error: socialStatErr } = await patchUserComponentAction(socialStatComponent.id, {
            items,
          });
          if (socialStatErr) return { error: socialStatErr };
        }
        return { error: null };
      }

      case 4:
        return { error: null }; // component editors auto-save via patchOverride

      case 5: {
        // Settings
        const usernameChanged = state.username.trim() !== original.username;
        if (usernameChanged && state.username.trim()) {
          const { data: taken } = await (await import('@/lib/supabase/admin')).adminClient
            .from('profiles')
            .select('id')
            .eq('username', state.username.trim())
            .neq('id', original.profileId)
            .maybeSingle();
          if (taken) return { error: 'Username is already taken' };
        }
        return updateUserProfileFieldsAction(original.profileId, {
          membership_type: state.membershipType,
          is_published: state.isPublished,
          is_admin: state.isAdmin,
          username: state.username || null,
        });
      }

      default:
        return { error: null };
    }
  };

  const handleNext = () => {
    setStepError(null);
    startTransition(async () => {
      const result = await saveCurrentStep();
      if (result.error) {
        setStepError(result.error);
        return;
      }
      if (step === 5) {
        router.push(routes.adminUsers);
      } else {
        setStep((s) => s + 1);
      }
    });
  };

  const handleBack = () => {
    setStepError(null);
    if (step === 0) router.push(routes.adminUsers);
    else setStep((s) => s - 1);
  };

  const canProceed = (): boolean => {
    if (isPending || uploading) return false;
    if (step === 0) return state.email.trim().length > 0;
    if (step === 1) return state.fullName.trim().length > 0;
    return true;
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-[11px] text-bb-muted uppercase tracking-widest animate-pulse">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-end justify-between mb-1">
          <h1 className="text-2xl tracking-tight uppercase">Edit User</h1>
          <Button variant="ghost" size="sm" type="button" onClick={handleBack} disabled={isPending}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
        </div>

        <OnboardingProgress step={step + 1} total={6} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[10px] text-bb-muted uppercase tracking-widest mb-1">
              {STEP_LABELS[step]}
            </p>
            <div className="h-px bg-border mb-6" />

            {step === 0 && <StepCredentialsEdit state={state} update={update} />}

            {step === 1 && <StepEssentialsEdit state={state} update={update} />}

            {step === 2 && (
              <StepPhotoEdit
                preview={state.avatarPreview}
                uploading={uploading}
                uploadError={uploadError}
                onChange={handleFileChange}
              />
            )}

            {step === 3 && <StepContactsEdit state={state} update={update} />}

            {step === 4 && original && (
              <StepComponentsLive components={original.components} patchOverride={patchOverride} />
            )}

            {step === 5 && <StepSettingsEdit state={state} update={update} />}
          </motion.div>
        </AnimatePresence>

        {stepError && <p className="text-[11px] text-red-500 mt-4 font-helvetica">{stepError}</p>}

        <div className="mt-8 space-y-3">
          <Button
            variant="blackbook"
            size="full"
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {isPending ? 'Saving…' : step === 5 ? 'Save Changes' : 'Continue'}
          </Button>
          {step > 0 && (
            <Button
              variant="blackbook-ghost"
              type="button"
              onClick={handleBack}
              disabled={isPending}
              className="w-full"
            >
              Back
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
