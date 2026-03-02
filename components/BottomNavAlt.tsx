'use client';

import { usePathname, useRouter } from 'next/navigation';
import AddDrawer from '@/components/AddDrawer';
import { routes } from '@/lib/routes';

const navItems = [
  { key: 'vault', label: 'Vault', path: routes.vault },
  { key: 'add', label: '+Add', path: null },
  { key: 'share', label: 'Share', path: routes.share },
  { key: 'profile', label: 'Profile', path: routes.myBlackbook },
];

const BottomNavAlt = () => {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveKey = () => {
    const path = pathname;
    if (path === routes.vault || path.startsWith('/contact/')) return 'vault';
    if (path === '/quick-add' || path === '/scan-qr' || path === '/scan-card') return 'add';
    if (path === routes.share) return 'share';
    if (path === routes.myBlackbook || path === '/profile') return 'profile';
    return '';
  };

  const activeKey = getActiveKey();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto">
        <div
          className="flex items-stretch relative overflow-hidden grain-overlay bg-bb-nav"
        >
          {navItems.map((item) => {
            const isActive = activeKey === item.key;

            if (item.key === 'add') {
              return (
                <AddDrawer key={item.key}>
                  <button className="flex-1 py-4 transition-colors">
                    <span className="font-display font-light text-[14px] tracking-[0.02em] uppercase text-white/40">
                      {item.label}
                    </span>
                  </button>
                </AddDrawer>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => item.path && router.push(item.path)}
                className="flex-1 py-4 transition-all"
              >
                <span
                  className={`font-display font-light text-[14px] tracking-[0.02em] uppercase ${isActive ? 'text-bb-cream' : 'text-white/40'}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavAlt;
