'use client';

import { usePathname, useRouter } from 'next/navigation';
import AddDrawer from '@/components/AddDrawer';

const navItems = [
  { key: 'vault', label: 'Vault', path: '/vault' },
  { key: 'add', label: '+Add', path: null },
  { key: 'share', label: 'Share', path: '/share' },
  { key: 'profile', label: 'Profile', path: '/my-blackbook' },
];

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveKey = () => {
    const path = pathname;
    if (path === '/vault' || path === '/vault-empty' || path.startsWith('/contact/'))
      return 'vault';
    if (path === '/share') return 'share';
    if (path === '/my-blackbook' || path === '/profile') return 'profile';
    return '';
  };

  const activeKey = getActiveKey();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto">
        <div
          className="flex items-stretch border-t border-border"
          style={{ backgroundColor: '#F5F4F0' }}
        >
          {navItems.map((item) => {
            const isActive = activeKey === item.key;

            if (item.key === 'add') {
              return (
                <AddDrawer key={item.key}>
                  <button className="flex-1 py-4 transition-colors border-r border-border last:border-r-0">
                    <span
                      className="text-[13px] tracking-[0.01em] uppercase"
                      style={{ color: '#9A9691', fontWeight: 500 }}
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
                className={`flex-1 py-4 transition-all border-r border-border last:border-r-0 ${
                  item.key !== navItems[navItems.length - 1].key ? '' : ''
                }`}
              >
                <span
                  className="text-[13px] tracking-[0.01em] uppercase"
                  style={{
                    color: isActive ? '#0E0E0E' : '#9A9691',
                    fontWeight: 500,
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

export default BottomNav;
