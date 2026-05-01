'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import { updatePasswordAction, logoutAction } from '@/app/actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';
import { useProfile } from '@/hooks/use-profile';

export default function SettingsPage() {
  const router = useRouter();
  const { data: profile } = useProfile();

  const [isIOS] = useState(() => /iPhone|iPad|iPod/i.test(navigator.userAgent));
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleUpdatePassword() {
    setPasswordError(null);
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setIsPending(true);
    const result = await updatePasswordAction(newPassword);
    setIsPending(false);
    if ('error' in result) {
      setPasswordError(result.error);
    } else {
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess(false);
      }, 1800);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
        <Logo />
        <Button variant="blackbook-ghost" onClick={() => router.push(routes.myBlackbook)}>
          BACK
        </Button>
      </div>

      <div className="px-6 pt-6 pb-2 max-w-md mx-auto w-full">
        <p className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted/50 mb-1">
          Settings
        </p>
        <h1 className="font-granjon text-[28px] leading-tight text-bb-dark">Account</h1>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full px-6 pt-6 space-y-0">
        {/* Update Password row */}
        <div className="border-b border-bb-rule">
          <button
            onClick={() => {
              setShowPasswordForm((v) => !v);
              setPasswordError(null);
              setPasswordSuccess(false);
            }}
            className="w-full flex items-center justify-between py-5 group"
          >
            <div className="text-left">
              <p className="font-granjon text-[15px] leading-tight mb-0.5 text-bb-dark">
                Update password
              </p>
              <p className="font-helvetica text-[11px] font-light text-bb-muted">
                Change your account password
              </p>
            </div>
            <motion.div
              animate={{ rotate: showPasswordForm ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-4 h-4 text-bb-muted/40 rotate-180" strokeWidth={1.2} />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {showPasswordForm && (
              <motion.div
                key="password-form"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="pb-6 space-y-3">
                  <div className="relative">
                    <Input
                      type={showNew ? 'text' : 'password'}
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" strokeWidth={1.4} />
                      ) : (
                        <Eye className="w-4 h-4" strokeWidth={1.4} />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" strokeWidth={1.4} />
                      ) : (
                        <Eye className="w-4 h-4" strokeWidth={1.4} />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="font-helvetica text-[10px] text-destructive">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="font-helvetica text-[10px] text-bb-dark">Password updated.</p>
                  )}
                  <Button
                    variant="blackbook"
                    size="full"
                    onClick={handleUpdatePassword}
                    disabled={isPending || !newPassword || !confirmPassword}
                  >
                    {isPending ? 'Updating…' : 'Update password'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Apple Wallet row */}
        {isIOS && profile?.username && (
          <div className="border-b border-bb-rule">
            <button
              onClick={() => {
                setIsWalletLoading(true);
                window.location.href = routes.walletPass(profile.username!);
                setTimeout(() => setIsWalletLoading(false), 5000);
              }}
              disabled={isWalletLoading}
              className="w-full flex items-center justify-between py-5 group disabled:opacity-50"
            >
              <div className="text-left">
                <p className="font-granjon text-[15px] leading-tight mb-0.5 text-bb-dark">
                  Add to Apple Wallet
                </p>
                <p className="font-helvetica text-[11px] font-light text-bb-muted">
                  {isWalletLoading ? 'Preparing your card…' : 'Download your Haizel card'}
                </p>
              </div>
              {isWalletLoading ? (
                <svg
                  className="w-4 h-4 text-bb-muted/40 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <ChevronLeft className="w-4 h-4 text-bb-muted/40 rotate-180" strokeWidth={1.2} />
              )}
            </button>
          </div>
        )}

        {/* Admin row */}
        {profile?.is_admin && (
          <div className="border-b border-bb-rule">
            <button
              onClick={() => router.push(routes.adminUsers)}
              className="w-full flex items-center justify-between py-5 group"
            >
              <div className="text-left">
                <p className="font-granjon text-[15px] leading-tight mb-0.5 text-bb-dark">
                  Admin panel
                </p>
                <p className="font-helvetica text-[11px] font-light text-bb-muted">
                  Manage requests and users
                </p>
              </div>
              <ChevronLeft className="w-4 h-4 text-bb-muted/40 rotate-180" strokeWidth={1.2} />
            </button>
          </div>
        )}

        {/* Sign out row */}
        <div className="border-b border-bb-rule">
          <form action={logoutAction}>
            <button type="submit" className="w-full flex items-center justify-between py-5 group">
              <div className="text-left">
                <p className="font-granjon text-[15px] leading-tight mb-0.5 text-bb-dark">
                  Sign out
                </p>
                <p className="font-helvetica text-[11px] font-light text-bb-muted">
                  Sign out of your account
                </p>
              </div>
              <ChevronLeft className="w-4 h-4 text-bb-muted/40 rotate-180" strokeWidth={1.2} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
