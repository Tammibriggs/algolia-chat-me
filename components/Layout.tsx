// src/components/Layout.tsx
import Head from 'next/head';
import Sidebar, { NavItem } from './Sidebar';
import { DocFrontmatter } from '../lib/docs';
import Header from './Header'; // Import Header

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  frontmatter?: DocFrontmatter;
  navItems: NavItem[];
}

export default function Layout({ children, title, frontmatter, navItems }: LayoutProps) {
  const pageTitle = frontmatter ? `${frontmatter.title} - Docs` : title ? `${title} - Docs` : 'Documentation Site';
  const pageDescription = frontmatter?.description || 'Comprehensive documentation for our product.';
  const docTitle = frontmatter?.title || title || 'Documentation';

  return (
    <div className="flex relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar is now mobile responsive */}
      <Sidebar navItems={navItems} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header docTitle={docTitle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}