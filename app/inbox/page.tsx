'use client';

import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import { Inbox } from '@/components/my-blackbook/inbox';

export default function InboxPage() {
  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page !py-6 pb-28">
        <Logo />

        <div className="mt-10 mb-6">
          <h1 className="font-display font-light text-[19px] tracking-[0.01em] uppercase text-bb-dark mb-1">
            Inbox
          </h1>
          <p className="blackbook-label text-bb-muted">Exchange requests from your profile</p>
        </div>

        <Inbox />
      </div>

      <BottomNav />
    </div>
  );
}
