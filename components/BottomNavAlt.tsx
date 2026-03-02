'use client';

import { usePathname, useRouter } from 'next/navigation';
import AddDrawer from '@/components/AddDrawer';

const navItems = [
  { key: 'vault', label: 'Vault', path: '/vault' },
  { key: 'add', label: '+Add', path: null },
  { key: 'share', label: 'Share', path: '/share' },
  { key: 'profile', label: 'Profile', path: '/my-blackbook' },
];

const BottomNavAlt = () => {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveKey = () => {
    const path = pathname;
    if (path === '/vault' || path.startsWith('/contact/')) return 'vault';
    if (path === '/quick-add' || path === '/scan-qr' || path === '/scan-card') return 'add';
    if (path === '/share') return 'share';
    if (path === '/my-blackbook' || path === '/profile') return 'profile';
    return '';
  };

  const activeKey = getActiveKey();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto">
        <div
          className="flex items-stretch relative overflow-hidden grain-overlay"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          {navItems.map((item) => {
            const isActive = activeKey === item.key;

            if (item.key === 'add') {
              return (
                <AddDrawer key={item.key}>
                  <button className="flex-1 py-4 transition-colors">
                    <span
                      className="text-[14px] tracking-[0.02em] uppercase"
                      style={{
                        fontFamily: "'GT Super Display', 'Canela Deck', serif",
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
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
                  className="text-[14px] tracking-[0.02em] uppercase"
                  style={{
                    fontFamily: "'GT Super Display', 'Canela Deck', serif",
                    fontWeight: 300,
                    color: isActive ? '#F5F4F0' : 'rgba(255,255,255,0.4)',
                  }}
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
