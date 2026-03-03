'use client';

import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import VaultEmptyState from '@/components/VaultEmptyState';
import VaultSearchBar from '@/components/VaultSearchBar';
const VaultEmpty = () => {
  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page !py-6">
        <Logo />

        <VaultSearchBar />

        {/* Empty State */}
        <VaultEmptyState />
      </div>

      <BottomNav />
    </div>
  );
};

export default VaultEmpty;
