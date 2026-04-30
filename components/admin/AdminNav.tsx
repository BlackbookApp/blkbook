'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routes } from '@/lib/routes';

const NAV_LINKS = [
  { label: 'Requests', href: routes.adminRequests },
  { label: 'Users', href: routes.adminUsers },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] text-bb-muted uppercase tracking-widest">Admin</span>
        <div className="flex gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-[10px] uppercase tracking-widest px-3 py-1.5 transition-colors ${
                  isActive ? 'bg-foreground text-background' : 'text-bb-muted hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
