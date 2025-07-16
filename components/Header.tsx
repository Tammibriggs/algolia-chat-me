// src/components/Header.tsx
import React from "react";
import { SearchBox, Hits, useInstantSearch } from "react-instantsearch";

interface HeaderProps {
  docTitle?: string;
}

export default function Header({ docTitle }: HeaderProps) {
  const { indexUiState } = useInstantSearch();

  function Hit({ hit }: { hit: any }) {
    // This component now includes highlighted content.
    return (
      <li
        key={hit.objectID || hit.id}
        className="px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
      >
        <div className="text-gray-900 dark:text-white font-medium text-base md:text-lg">
          {/* Render title using dangerouslySetInnerHTML if _highlightResult is available,
              otherwise use the plain title. */}
          {hit._highlightResult &&
          hit._highlightResult.title && // Corrected from hit._highlighthit?.title
          hit._highlightResult.title.value ? ( // Corrected from hit._highlighthit?.title?.value
            <span
              dangerouslySetInnerHTML={{
                __html: hit._highlightResult.title.value,
              }}
            />
          ) : (
            hit.title
          )}
        </div>
        <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base line-clamp-2">
          {/* Render description using dangerouslySetInnerHTML if _highlightResult is available,
              otherwise use the plain description. */}
          {hit._highlightResult &&
          hit._highlightResult.description && // Corrected from hit._highlighthit?.description
          hit._highlightResult.description.value ? ( // Corrected from hit._highlighthit.description.value
            <span
              dangerouslySetInnerHTML={{
                __html: hit._highlightResult.description.value,
              }}
            />
          ) : (
            hit.description
          )}
        </div>
        {/* New: Display and highlight content snippet */}
        {hit._highlightResult &&
          hit._highlightResult.content &&
          hit._highlightResult.content.value && (
            <div className="text-gray-700 dark:text-gray-400 text-xs mt-1 line-clamp-3">
              <span
                dangerouslySetInnerHTML={{
                  __html: hit._highlightResult.content.value,
                }}
              />
            </div>
          )}
        <div className="text-blue-500 dark:text-blue-400 text-xs mt-1">
          {hit.url || hit.path}
        </div>
      </li>
    );
  }
  return (
    // MODIFIED: Removed `justify-between` and adjusted gap for better centering behavior.
    <header className="w-full flex flex-col sm:flex-row items-center px-4 sm:px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm gap-4">
      {/* Hide title on mobile/tablet, show only on large screens */}
      <h1
        className="hidden lg:block text-2xl font-bold text-gray-900 dark:text-white truncate"
        title={docTitle}
      >
        {docTitle || "Documentation"}
      </h1>

      {/* MODIFIED: Added flex-grow wrapper to center the search bar in the available space. */}
      <div className="flex-grow flex justify-center w-full sm:w-auto">
        {/* MODIFIED: This new wrapper sets the search bar's max-width and provides relative positioning for the dropdown. */}
        <div className="relative w-full max-w-lg">
          <SearchBox
            placeholder="Search documentation..."
            classNames={{
              // MODIFIED: Simplified form classes; width is now controlled by the parent.
              form: "relative w-full",
              input:
                "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
              submitIcon: "hidden",
              resetIcon: "hidden",
            }}
          />
          {/* MODIFIED: Positioned dropdown below the input (`top-full`) for better alignment. */}
          <div className="absolute top-full mt-2 w-full z-20">
            {indexUiState.query ? (
              // MODIFIED: Removed `mt-2` from ul as margin is now on the parent div.
              <ul className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-80 overflow-y-auto">
                <Hits hitComponent={Hit} />
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
