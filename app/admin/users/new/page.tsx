'use client';

import { useCallback, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { OnboardingProgress } from '@/components/onboarding-v2/OnboardingProgress';
import { StepRole } from '@/components/onboarding-v2/StepRole';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { routes } from '@/lib/routes';
import { useImageUpload } from '@/hooks/use-image-upload';
import {
  createUserAction,
  generateUsernameAction,
  type CreateUserParams,
} from '@/app/actions/admin-users';
import { EDITOR_MAP } from '@/config/editorMap';
import { DISPLAY_MAP } from '@/config/displayMap';
import { ROLE_SCHEMAS } from '@/config/roleSchemas';
import { ROLE_COMPONENT_SAMPLES, COMPONENT_DEFAULTS } from '@/config/componentSchemas';
import { InMemoryEditorProvider } from '@/contexts/component-editor';
import { Button } from '@/components/ui/button';
import type { RoleType, ComponentType } from '@/config/roleSchemas';
import type { ProfileComponent } from '@/lib/data/components';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WizardData {
  email: string;
  password: string;
  roleType: RoleType | null;
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

const INITIAL: WizardData = {
  email: '',
  password: '',
  roleType: null,
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
};

const STEP_LABELS = [
  'Step 1 — Credentials',
  'Step 2 — Template',
  'Step 3 — Essentials',
  'Step 4 — Photo',
  'Step 5 — Contacts',
  'Step 6 — Components',
  'Step 7 — Settings',
];

// ─── Contact / social buttons config ─────────────────────────────────────────

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

// ─── Field helpers ────────────────────────────────────────────────────────────

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

// ─── Step components ──────────────────────────────────────────────────────────

function StepCredentials({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-0">
      <FieldRow label="Email">
        <Input
          type="email"
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="user@example.com"
          autoFocus
        />
      </FieldRow>
      <FieldRow label="Password">
        <Input
          type="password"
          value={data.password}
          onChange={(e) => update({ password: e.target.value })}
          placeholder="Min. 6 characters"
        />
      </FieldRow>
    </div>
  );
}

function StepEssentialsAdmin({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  return (
    <div>
      <FieldRow label="Full Name">
        <Input
          value={data.fullName}
          onChange={(e) => update({ fullName: e.target.value })}
          placeholder="As they want to be known"
          autoFocus
        />
      </FieldRow>
      <FieldRow label="Role / Title">
        <Input
          value={data.roleTitle}
          onChange={(e) => update({ roleTitle: e.target.value })}
          placeholder="What they do"
        />
      </FieldRow>
      <FieldRow label="Company">
        <Input
          value={data.company}
          onChange={(e) => update({ company: e.target.value })}
          placeholder="Where they work"
        />
      </FieldRow>
      <FieldRow label="Location">
        <Input
          value={data.location}
          onChange={(e) => update({ location: e.target.value })}
          placeholder="City, Country"
        />
      </FieldRow>
    </div>
  );
}

function StepPhotoAdmin({
  preview,
  uploading,
  fileRef,
  onChange,
}: {
  preview: string | null;
  uploading: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="relative w-36 h-36 rounded-full overflow-hidden flex items-center justify-center transition-opacity hover:opacity-80 group"
        style={{ border: '2px dashed var(--bb-rule, #e4e0da)', background: '#f2f1ed' }}
        aria-label="Upload profile photo"
      >
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] uppercase tracking-widest text-bb-muted">Upload</span>
        )}
      </button>
      {uploading && (
        <p className="text-[10px] uppercase tracking-widest text-bb-muted animate-pulse">
          Uploading…
        </p>
      )}
      {!uploading && (
        <p className="text-[11px] text-bb-muted font-light text-center">
          {preview ? 'Click to change photo' : 'Portraits work best. Square or vertical.'}
        </p>
      )}
    </div>
  );
}

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
        <span className="flex-1 text-[11px] uppercase tracking-widest">{label}</span>
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

function StepContactsAdmin({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const selectedContacts = data.selectedButtons.filter((id) => CONTACT_IDS.has(id));

  const toggle = (id: string) => {
    const next = data.selectedButtons.includes(id)
      ? data.selectedButtons.filter((b) => b !== id)
      : [...data.selectedButtons, id];
    update({ selectedButtons: next });
  };

  const setValue = (id: string, val: string) => {
    update({ buttonValues: { ...data.buttonValues, [id]: val } });
  };

  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-bb-muted mb-3">
        Contact buttons (max 2)
      </p>
      {CONTACT_BUTTONS.map((btn) => {
        const isSelected = data.selectedButtons.includes(btn.id);
        const atLimit = !isSelected && selectedContacts.length >= 2;
        return (
          <ContactButtonRow
            key={btn.id}
            id={btn.id}
            label={btn.label}
            placeholder={btn.placeholder}
            isSelected={isSelected}
            isDisabled={atLimit}
            value={data.buttonValues[btn.id] ?? ''}
            onToggle={() => toggle(btn.id)}
            onValueChange={(v) => setValue(btn.id, v)}
          />
        );
      })}

      <p className="text-[9px] uppercase tracking-widest text-bb-muted mb-3 mt-6">Socials</p>
      {SOCIAL_BUTTONS.map((btn) => {
        const isSelected = data.selectedButtons.includes(btn.id);
        return (
          <ContactButtonRow
            key={btn.id}
            id={btn.id}
            label={btn.label}
            placeholder={btn.placeholder}
            isSelected={isSelected}
            isDisabled={false}
            value={data.buttonValues[btn.id] ?? ''}
            onToggle={() => toggle(btn.id)}
            onValueChange={(v) => setValue(btn.id, v)}
          />
        );
      })}
    </div>
  );
}

function AdminEditableSection({
  component,
  isEditing,
  onEdit,
  onDone,
}: {
  component: ProfileComponent;
  isEditing: boolean;
  onEdit: () => void;
  onDone: () => void;
}) {
  const displayEntry = DISPLAY_MAP[component.type as ComponentType];
  const editorEntry = EDITOR_MAP[component.type as ComponentType];
  if (!displayEntry || !editorEntry) return null;

  const Display = displayEntry.component;
  const Editor = editorEntry.component;

  return (
    <div className="mb-2">
      <div className="flex items-center justify-end px-4 py-3">
        <button
          type="button"
          onClick={isEditing ? onDone : onEdit}
          className={`text-[10px] uppercase tracking-widest transition-colors ${
            isEditing ? 'text-foreground' : 'text-bb-muted hover:text-foreground'
          }`}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="px-4 pb-4 border-t border-border"
          >
            <Editor component={component} />
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="px-4 pb-4"
          >
            <Display data={component.data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepComponentsEditor({
  wizardData,
  componentDrafts,
  onDataChange,
}: {
  wizardData: WizardData;
  componentDrafts: Record<string, unknown>;
  onDataChange: (id: string, data: unknown) => void;
}) {
  const [activeEditId, setActiveEditId] = useState<string | null>(null);

  const components = useMemo<ProfileComponent[]>(() => {
    if (!wizardData.roleType) return [];
    const types = ROLE_SCHEMAS[wizardData.roleType];
    const samples = ROLE_COMPONENT_SAMPLES[wizardData.roleType];

    return types.map((type, i) => {
      const id = `draft-${wizardData.roleType}-${i}`;
      let defaultData: unknown;
      if (type === 'profile_hero_centered') {
        defaultData = {
          name: wizardData.fullName || null,
          image_url: wizardData.avatarUrl,
          tagline: wizardData.roleTitle || null,
          company: wizardData.company || null,
          location: wizardData.location || null,
        };
      } else if (type === 'social_stat') {
        const socialItems = SOCIAL_BUTTONS.filter(
          (btn) => (wizardData.buttonValues[btn.id] ?? '').trim().length > 0
        ).map((btn) => ({
          platform: btn.id,
          handle: wizardData.buttonValues[btn.id] ?? null,
          count: null,
          url: null,
        }));
        defaultData =
          socialItems.length > 0
            ? { items: socialItems }
            : ((samples as Partial<Record<ComponentType, unknown>>)[type] ??
              COMPONENT_DEFAULTS[type]);
      } else {
        defaultData =
          (samples as Partial<Record<ComponentType, unknown>>)[type] ?? COMPONENT_DEFAULTS[type];
      }
      return {
        id,
        profile_id: 'draft',
        type: type as ComponentType,
        data: componentDrafts[id] ?? defaultData,
        position: (i + 1) * 1000,
        ai_generated: true,
        is_predefined: true,
        is_visible: true,
      };
    });
  }, [wizardData, componentDrafts]);

  return (
    <InMemoryEditorProvider onDataChange={onDataChange}>
      <div>
        {components.map((component) => (
          <AdminEditableSection
            key={component.id}
            component={component}
            isEditing={activeEditId === component.id}
            onEdit={() => setActiveEditId(component.id)}
            onDone={() => setActiveEditId(null)}
          />
        ))}
      </div>
    </InMemoryEditorProvider>
  );
}

function StepSettingsAdmin({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  return (
    <div>
      <FieldRow label="Username">
        <Input
          value={data.username}
          onChange={(e) => update({ username: e.target.value })}
          placeholder="auto-generated from name"
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
                data.membershipType === type
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
        <Switch checked={data.isPublished} onCheckedChange={(v) => update({ isPublished: v })} />
      </div>

      <div className="flex items-center justify-between py-4 border-b border-border">
        <div>
          <p className="text-[11px] uppercase tracking-widest">Admin access</p>
          <p className="text-[10px] text-bb-muted font-light mt-0.5">Can access the admin panel</p>
        </div>
        <Switch checked={data.isAdmin} onCheckedChange={(v) => update({ isAdmin: v })} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateUserPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL);
  const [componentDrafts, setComponentDrafts] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { upload, uploading } = useImageUpload({
    bucket: 'avatars',
    buildPath: (userId, file) => {
      const ext = file.name.split('.').pop() ?? 'jpg';
      return `${userId}/new-user-${Date.now()}.${ext}`;
    },
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<WizardData>) => {
    if ('roleType' in patch) setComponentDrafts({});
    setData((d) => ({ ...d, ...patch }));
  };

  const handleDataChange = useCallback((id: string, draft: unknown) => {
    setComponentDrafts((prev) => ({ ...prev, [id]: draft }));
  }, []);

  const canProceed = (): boolean => {
    if (isPending || uploading) return false;
    switch (step) {
      case 0:
        return data.email.trim().length > 0 && data.password.length >= 6;
      case 1:
        return data.roleType !== null;
      case 2:
        return data.fullName.trim().length > 0;
      default:
        return true;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    update({ avatarPreview: URL.createObjectURL(file) });
    const url = await upload(file);
    if (url) update({ avatarUrl: url });
    e.target.value = '';
  };

  const handleNext = () => {
    setError(null);

    if (step === 6) {
      if (!data.roleType) return;
      startTransition(async () => {
        const params: CreateUserParams = {
          email: data.email,
          password: data.password,
          roleType: data.roleType as RoleType,
          fullName: data.fullName,
          roleTitle: data.roleTitle,
          company: data.company,
          location: data.location,
          avatarUrl: data.avatarUrl,
          selectedButtons: data.selectedButtons,
          buttonValues: data.buttonValues,
          membershipType: data.membershipType,
          isPublished: data.isPublished,
          isAdmin: data.isAdmin,
          username: data.username,
          componentDrafts,
        };
        const result = await createUserAction(params);
        if (result.error) {
          setError(result.error);
        } else {
          router.push(routes.adminUsers);
        }
      });
      return;
    }

    // Auto-generate username when entering the settings step
    if (step === 5 && !data.username && data.fullName) {
      startTransition(async () => {
        const generated = await generateUsernameAction(data.fullName);
        update({ username: generated });
        setStep((s) => s + 1);
      });
      return;
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    if (step === 0) {
      router.push(routes.adminUsers);
    } else {
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-end justify-between mb-1">
          <h1 className="text-2xl tracking-tight uppercase">Create User</h1>
          <Button variant="ghost" size="sm" type="button" onClick={handleBack} disabled={isPending}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
        </div>

        <OnboardingProgress step={step + 1} total={7} />

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

            {step === 0 && <StepCredentials data={data} update={update} />}
            {step === 1 && (
              <StepRole value={data.roleType} onChange={(r) => update({ roleType: r })} />
            )}
            {step === 2 && <StepEssentialsAdmin data={data} update={update} />}
            {step === 3 && (
              <StepPhotoAdmin
                preview={data.avatarPreview}
                uploading={uploading}
                fileRef={fileRef}
                onChange={handleFileChange}
              />
            )}
            {step === 4 && <StepContactsAdmin data={data} update={update} />}
            {step === 5 && (
              <StepComponentsEditor
                wizardData={data}
                componentDrafts={componentDrafts}
                onDataChange={handleDataChange}
              />
            )}
            {step === 6 && <StepSettingsAdmin data={data} update={update} />}
          </motion.div>
        </AnimatePresence>

        {error && <p className="text-[11px] text-red-500 mt-4 font-helvetica">{error}</p>}

        <div className="mt-8 space-y-3">
          <Button
            variant="blackbook"
            size="full"
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {isPending
              ? step === 6
                ? 'Creating…'
                : 'Loading…'
              : step === 6
                ? 'Create User'
                : 'Continue'}
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
