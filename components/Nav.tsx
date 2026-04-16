'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/log', label: 'Time Log' },
  { href: '/money', label: 'Money' },
  { href: '/school', label: 'School' },
  { href: '/health', label: 'Health' },
  { href: '/settings', label: 'Settings' }
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== '/' && pathname.startsWith(link.href));

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-flex rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
