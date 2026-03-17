'use client';

import { usePathname, useRouter } from 'next/navigation';
import AddDrawer from '@/components/AddDrawer';
import { routes } from '@/lib/routes';
import { useExchanges } from '@/hooks/use-exchanges';
import { Text } from '@/components/ui/text';

const navItems = [
  { key: 'vault', label: 'Vault', path: routes.vault },
  { key: 'add', label: '+Add', path: null },
  { key: 'inbox', label: 'Inbox', path: routes.inbox },
  { key: 'profile', label: 'Profile', path: routes.myBlackbook },
];

interface BottomNavProps {
  /** 'dark' (default): dark bg-bb-nav with grain, display font
   *  'cream': light bg-bb-cream with borders, helvetica font */
  theme?: 'dark' | 'cream';
}

const BottomNav = ({ theme = 'dark' }: BottomNavProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: exchanges = [] } = useExchanges();
  const pendingCount = exchanges.filter((e) => e.status === 'pending').length;

  const getActiveKey = () => {
    if (
      pathname === routes.vault ||
      pathname === '/vault-empty' ||
      pathname.startsWith('/contact/')
    )
      return 'vault';
    if (pathname === '/quick-add' || pathname === '/scan-qr' || pathname === '/scan-card')
      return 'add';
    if (pathname === routes.inbox) return 'inbox';
    if (pathname === routes.myBlackbook || pathname === '/profile') return 'profile';
    return '';
  };

  const activeKey = getActiveKey();
  const isDark = theme === 'dark';

  const containerClass = isDark
    ? 'flex items-stretch relative overflow-hidden grain-overlay bg-bb-nav pb-[env(safe-area-inset-bottom)]'
    : 'flex items-stretch border-t border-border bg-bb-cream pb-[env(safe-area-inset-bottom)]';

  const itemClass = isDark
    ? 'flex-1 py-7 transition-all'
    : 'flex-1 py-7 transition-all border-r border-border last:border-r-0';

  const getNavColor = (isActive: boolean): 'cream' | 'dark' | 'muted' => {
    if (isDark) return isActive ? 'cream' : 'muted';
    return isActive ? 'dark' : 'muted';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 will-change-transform">
      <div className="max-w-md mx-auto">
        <div className={containerClass}>
          {navItems.map((item) => {
            const isActive = activeKey === item.key;

            if (item.key === 'add') {
              return (
                <AddDrawer key={item.key}>
                  <button className={itemClass}>
                    <Text variant={'nav'} color="muted" as="span">
                      {item.label}
                    </Text>
                  </button>
                </AddDrawer>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => item.path && router.push(item.path)}
                className={`${itemClass} relative`}
              >
                <Text variant="nav" color={getNavColor(isActive)} as="span">
                  {item.label}
                </Text>
                {item.key === 'inbox' && pendingCount > 0 && (
                  <span className="absolute top-2.5 right-[calc(50%-18px)] w-1.5 h-1.5 rounded-full bg-bb-cream/70" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
