'use client';

import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import { Inbox } from '@/components/my-blackbook/inbox';

export default function InboxPage() {
  return (
    <div className="max-w-md mx-auto bg-background flex flex-col h-[100svh] overflow-hidden px-6 pt-6">
      <Logo />

      <div className="mt-10 mb-6">
        <h1 className="font-granjon font-light text-[19px] tracking-[0.01em] uppercase text-bb-dark mb-1">
          Inbox
        </h1>
        <p className="blackbook-label">Exchange requests from your profile</p>
      </div>

      <Inbox />

      <BottomNav />
    </div>
  );
}
