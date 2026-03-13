'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { routes } from '@/lib/routes';
import { useProfile } from '@/hooks/use-profile';
import { createClient } from '@/lib/supabase/client';
import {
  updateProfileAction,
  addPortfolioImageAction,
  removePortfolioImageAction,
} from '@/app/actions/profiles';
import { useQueryClient } from '@tanstack/react-query';
import type {
  ProfileStyle,
  ProfilePalette,
  SocialFields,
  WorkData,
} from '@/components/edit-profile/types';
import { StepStyle } from '@/components/edit-profile/step-style';
import { StepProfile } from '@/components/edit-profile/step-profile';
import { StepWork } from '@/components/edit-profile/step-work';
import { MiniPreview } from '@/components/edit-profile/mini-preview';
import PublicProfileVisual from '@/components/public-profile/public-profile-visual';
import PublicProfileEditorial from '@/components/public-profile/public-profile-editorial';
import type { ProfileTheme } from '@/components/public-profile/public-profile-visual';

const EditProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfile();

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [style, setStyle] = useState<ProfileStyle>(null);
  const [palette, setPalette] = useState<ProfilePalette>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [socials, setSocials] = useState<SocialFields>({
    website: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
    twitter: '',
    email: '',
    phone: '',
    whatsapp: '',
  });

  const [work, setWork] = useState<WorkData>({
    portfolioImages: [],
    logo: null,
    testimonials: [{ quote: '', author: '', title: '' }],
    brandStatement: '',
  });

  const [removedPortfolioIds, setRemovedPortfolioIds] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Pre-fill from DB on mount
  useEffect(() => {
    if (!profile) return;
    setStyle(profile.style ?? null);
    setPalette(profile.palette ?? null);
    setName(profile.full_name ?? '');
    setRole(profile.role ?? '');
    setLocation(profile.location ?? '');
    setBio(profile.bio ?? '');
    setAvatarPreview(profile.avatar_url ?? null);
    setSocials({
      website: profile.social_links.website ?? '',
      instagram: profile.social_links.instagram ?? '',
      tiktok: profile.social_links.tiktok ?? '',
      linkedin: profile.social_links.linkedin ?? '',
      twitter: profile.social_links.twitter ?? '',
      email: profile.social_links.email ?? '',
      phone: profile.social_links.phone ?? '',
      whatsapp: profile.social_links.whatsapp ?? '',
    });
    setWork({
      portfolioImages: profile.portfolio_images.map((img) => ({ id: img.id, url: img.url })),
      logo: profile.logo_url ?? null,
      testimonials:
        profile.testimonials.length > 0
          ? profile.testimonials.map((t) => ({
              quote: t.quote,
              author: t.author ?? '',
              title: t.title ?? '',
            }))
          : [{ quote: '', author: '', title: '' }],
      brandStatement: profile.brand_statement ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !profile) {
      setIsSaving(false);
      return;
    }

    try {
      // 1. Upload avatar if changed
      let avatarUrl: string | undefined;
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop() ?? 'jpg';
        const path = `${user.id}/avatar.${ext}`;
        const { error } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true });
        if (error) throw new Error('Failed to upload avatar');
        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(path);
        avatarUrl = publicUrl;
        setAvatarPreview(publicUrl);
      }

      // 2. Upload logo if changed
      let logoUrl: string | undefined;
      if (logoFile) {
        const ext = logoFile.name.split('.').pop() ?? 'png';
        const path = `${user.id}/logo.${ext}`;
        const { error } = await supabase.storage
          .from('portfolio')
          .upload(path, logoFile, { upsert: true });
        if (error) throw new Error('Failed to upload logo');
        const {
          data: { publicUrl },
        } = supabase.storage.from('portfolio').getPublicUrl(path);
        logoUrl = publicUrl;
        setWork((w) => ({ ...w, logo: publicUrl }));
      }

      // 3. Upload new portfolio images
      const newImages = work.portfolioImages.filter((e) => e.file);
      const existingCount = work.portfolioImages.filter((e) => !e.file).length;
      const uploadedUrls: string[] = [];
      for (let i = 0; i < newImages.length; i++) {
        const entry = newImages[i];
        if (!entry.file) continue;
        const ext = entry.file.name.split('.').pop() ?? 'jpg';
        const path = `${user.id}/portfolio-${Date.now()}-${i}.${ext}`;
        const { error } = await supabase.storage
          .from('portfolio')
          .upload(path, entry.file, { upsert: false });
        if (error) throw new Error('Failed to upload portfolio image');
        const {
          data: { publicUrl },
        } = supabase.storage.from('portfolio').getPublicUrl(path);
        await addPortfolioImageAction(profile.id, publicUrl, existingCount + i);
        uploadedUrls.push(publicUrl);
      }
      if (uploadedUrls.length > 0) {
        let newIdx = 0;
        setWork((w) => ({
          ...w,
          portfolioImages: w.portfolioImages.map((e) =>
            e.file ? { ...e, url: uploadedUrls[newIdx++], file: undefined } : e
          ),
        }));
      }

      // 4. Delete removed portfolio images
      for (const id of removedPortfolioIds) {
        await removePortfolioImageAction(profile.id, id);
      }

      // 5. Update profile fields
      const socialLinks = Object.fromEntries(
        Object.entries({
          website: socials.website,
          instagram: socials.instagram,
          tiktok: socials.tiktok,
          linkedin: socials.linkedin,
          twitter: socials.twitter,
          email: socials.email,
          phone: socials.phone,
          whatsapp: socials.whatsapp,
        }).filter(([, v]) => v !== '')
      );

      await updateProfileAction({
        full_name: name || null,
        role: role || null,
        location: location || null,
        bio: bio || null,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        social_links: socialLinks,
        style: style ?? undefined,
        palette: palette ?? undefined,
        brand_statement: work.brandStatement || null,
        logo_url: logoUrl ?? (work.logo && !work.logo.startsWith('blob:') ? work.logo : null),
        testimonials: work.testimonials
          .filter((t) => t.quote.trim())
          .map((t) => ({ quote: t.quote, author: t.author || null, title: t.title || null })),
      });

      queryClient.invalidateQueries({ queryKey: ['profile'] });

      router.push(routes.myBlackbook);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <p className="blackbook-label text-bb-muted">Loading…</p>
      </div>
    );
  }

  if (showPreview) {
    const profileTheme: ProfileTheme = palette === 'noir' ? 'noir' : 'blanc';
    const previewProfile = {
      name,
      bio,
      role,
      location,
      portraitSrc: avatarPreview,
      logoSrc: work.logo,
      socialLinks: socials,
      brandStatement: work.brandStatement,
    };
    const previewPortfolio = work.portfolioImages.map((img) => ({ imageSrc: img.url }));
    const previewTestimonials = work.testimonials
      .filter((t) => t.quote.trim())
      .map((t) => ({
        quote: t.quote,
        author: t.author ? `${t.author}${t.title ? `, ${t.title}` : ''}` : undefined,
      }));

    return (
      <div className="relative">
        {style === 'editorial' ? (
          <PublicProfileEditorial
            theme={profileTheme}
            profile={previewProfile}
            portfolio={previewPortfolio}
            testimonials={previewTestimonials}
            profileStyle="editorial"
            isPreview={true}
          />
        ) : (
          <PublicProfileVisual
            theme={profileTheme}
            profile={previewProfile}
            portfolio={previewPortfolio}
            testimonials={previewTestimonials}
            profileStyle="visual"
            isPreview={true}
          />
        )}

        {/* Floating header */}
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="max-w-md mx-auto px-6 pt-8 flex items-center justify-between pointer-events-auto">
            <Logo />
            <button
              onClick={() => setShowPreview(false)}
              className="text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fixed bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50" data-pg-theme={profileTheme}>
          <div className="max-w-md mx-auto px-6 pt-12 pb-8 flex flex-col items-center gap-3 bg-gradient-to-t from-[var(--pg-bg)] via-[var(--pg-bg)/80] to-transparent">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="pg-btn-primary disabled:opacity-50 w-full"
            >
              {isSaving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 pt-8">
        <Logo />
        <button
          onClick={() => router.push(routes.myBlackbook)}
          className="flex items-center text-muted-foreground/50 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center mt-2">
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground/40 font-light">
          Step {step} of 3
        </span>
      </div>
      <div className="px-6 mt-3">
        <div className="w-full h-[2px] bg-border/30 overflow-hidden">
          <motion.div
            className="h-full bg-foreground"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepStyle
            key="step1"
            style={style}
            setStyle={setStyle}
            palette={palette}
            setPalette={setPalette}
            onContinue={() => setStep(2)}
            onPreview={(type) =>
              router.push(
                type === 'visual' ? routes.previewTemplateVisual : routes.previewTemplateEditorial
              )
            }
          />
        )}
        {step === 2 && (
          <StepProfile
            key="step2"
            name={name}
            setName={setName}
            role={role}
            setRole={setRole}
            location={location}
            setLocation={setLocation}
            bio={bio}
            setBio={setBio}
            avatarFile={avatarFile}
            setAvatarFile={setAvatarFile}
            avatarPreview={avatarPreview}
            setAvatarPreview={setAvatarPreview}
            socials={socials}
            setSocials={setSocials}
            onContinue={() => setStep(3)}
            onSkip={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepWork
            key="step3"
            work={work}
            setWork={setWork}
            removedPortfolioIds={removedPortfolioIds}
            setRemovedPortfolioIds={setRemovedPortfolioIds}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            onFinish={() => setShowPreview(true)}
          />
        )}
      </AnimatePresence>

      {isSaving && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <p className="blackbook-label text-bb-muted">Saving…</p>
        </div>
      )}

      {saveError && (
        <div className="fixed bottom-6 left-0 right-0 z-50 px-6">
          <div className="max-w-md mx-auto bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
            <p className="text-[11px] text-destructive text-center">{saveError}</p>
          </div>
        </div>
      )}

      {step === 1 && (style || palette) && <MiniPreview style={style} palette={palette} />}
    </div>
  );
};

export default EditProfile;
