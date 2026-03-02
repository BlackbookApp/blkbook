'use client';

import Logo from '@/components/Logo';
import BottomNavAlt from '@/components/BottomNavAlt';
import VaultEmptyState from '@/components/VaultEmptyState';
import VaultAltSearchBar from '@/components/VaultAltSearchBar';
const VaultEmpty = () => {
  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page !py-6">
        <Logo />

        <VaultAltSearchBar />

        {/* Empty State */}
        <VaultEmptyState />
      </div>

      <BottomNavAlt />
    </div>
  );
};

export default VaultEmpty;
