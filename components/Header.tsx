// src/components/Header.tsx
import React from 'react';

interface HeaderProps {
  docTitle?: string;
}

export default function Header({ docTitle }: HeaderProps) {
  return (
    <header className="w-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm gap-2 sm:gap-0">
      {/* Hide title on mobile/tablet, show only on large screens */}
      <h1 className="hidden lg:block text-2xl font-bold text-gray-900 dark:text-white truncate w-full sm:w-auto text-center sm:text-left" title={docTitle}>
        {docTitle || 'Documentation'}
      </h1>
      <form className="w-full max-w-xs mx-auto lg:ml-8 lg:mx-0">
        <input
          type="text"
          placeholder="Search documentation..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          aria-label="Search documentation"
        />
      </form>
    </header>
  );
}
