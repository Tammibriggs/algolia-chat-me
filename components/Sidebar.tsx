// src/components/Sidebar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export interface NavItem { // Export this interface if not already
  label: string;
  href: string;
  active: boolean;
  subItems?: NavItem[];
}

interface SidebarProps {
  navItems: NavItem[]; // Accept navItems as prop
}

export default function Sidebar({ navItems }: SidebarProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [router.asPath]);

  const handleToggle = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // No useEffect needed here to fetch data, just update active state based on router
  const categoryOrder = [
    'Getting started',
  ];
  const processedNavItems = navItems
    .map(item => ({
      ...item,
      active: router.asPath.startsWith(item.href), // Determine active state
      subItems: item.subItems?.map(subItem => ({
        ...subItem,
        active: router.asPath === subItem.href,
      })).sort((a, b) => {
        if (a.label && b.label) {
          return a.label.localeCompare(b.label);
        }
        return 0;
      }), // Sort sub-items with null check
    }))
    .sort((a, b) => {
      const aIdx = categoryOrder.indexOf(a.label);
      const bIdx = categoryOrder.indexOf(b.label);
      if (aIdx === -1 && bIdx === -1) {
        return a.label.localeCompare(b.label);
      }
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    }); // Sort main categories with null check

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-blue-600 text-white rounded-full p-2 shadow-lg focus:outline-none"
        aria-label="Open navigation menu"
        onClick={() => setMobileOpen(true)}
      >
        {/* Hamburger icon */}
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Overlay for mobile sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md p-6 overflow-y-auto transform transition-transform duration-300 md:sticky md:h-screen md:translate-x-0 md:block ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64`}
        style={{ maxWidth: '100vw' }}
        aria-label="Sidebar navigation"
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between mb-8 md:hidden">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            ChatMe Docs
          </Link>
          <button
            className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        {/* Desktop logo */}
        <div className="mb-8 hidden md:block">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            ChatMe Docs
          </Link>
        </div>
        <nav>  
          <ul>
            {processedNavItems.map((item) => (
              <li key={item.label} className="mb-2">
                <div className="flex items-center">
                  {item.subItems && item.subItems.length > 0 && (
                    <button
                      type="button"
                      aria-label={expanded[item.label] ? 'Collapse category' : 'Expand category'}
                      onClick={() => handleToggle(item.label)}
                      className="mr-2 cursor-pointer focus:outline-none"
                    >
                      <span
                        className={`transition-transform duration-200 inline-block ${expanded[item.label] ? 'rotate-90' : ''}`}
                        style={{ width: 16, display: 'inline-block' }}
                      >
                        {/* Caret SVG */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>
                  )}
                  <Link
                    href={item.href}
                    className={`block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 ${
                      item.active ? 'bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
                {item.subItems && item.subItems.length > 0 && expanded[item.label] && (
                  <ul className="ml-4 mt-2 border-l border-gray-300 dark:border-gray-600">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.label}>
                        <Link
                          href={subItem.href}
                          className={`block py-1 px-3 text-sm rounded-md transition-colors  ${
                            subItem.active
                              ? 'text-blue-500'
                              : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-200 '
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}