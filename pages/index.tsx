import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { NavItem } from '@/components/Sidebar';
import { getAllDocsMeta, DocPage } from '@/lib/docs';

interface HomepageProps {
  categories: {
    name: string;
    description: string; // Add a description for each category
    docs: DocPage[];
  }[];
}

export default function HomePage({ categories }: HomepageProps) {
  // Generate navItems for Layout
  const navItems: NavItem[] = categories.map((category) => ({
    label: category.name.charAt(0).toUpperCase() + category.name.slice(1).replace(/-/g, ' '),
    href: `/docs/${category.name}`,
    active: false, // Sidebar will handle active state
    subItems: category.docs.map(doc => ({
      label: doc.frontmatter.title,
      href: `/docs/${doc.category}/${doc.slug}`,
      active: false,
    })),
  }));

  return (
    <Layout title="Welcome to Searchlight Docs" navItems={navItems}>
      <div className="container mx-auto px-2 sm:px-4 py-12 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          Welcome to SearchLight Documentation
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
          Explore comprehensive guides, feature explanations, troubleshooting tips, and more to help you get the most out of our product.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 transform hover:scale-105 transition-transform duration-300"
            >
              <Link href={`/docs/${category.name}`} className="block">
                <h2 className="text-3xl font-bold mb-3 text-blue-600 dark:text-blue-400">
                  {category.name.charAt(0).toUpperCase() + category.name.slice(1).replace(/-/g, ' ')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 h-20 overflow-hidden text-ellipsis">
                  {category.description}
                </p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  View all {category.docs.length} guides →
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allDocs = getAllDocsMeta();

  // Define descriptions for each category. You might want to get this from a _category.json file later.
  const categoryDescriptions: { [key: string]: string } = {
    'getting-started': 'Everything you need to set up and quickly start using our product.',
    'feature-guides': 'Detailed instructions on how to use all the powerful features of the product.',
    'troubleshooting': 'Solutions to common issues and problems you might encounter.',
    'faqs': 'Frequently asked questions covering general information and billing.',
    'changelog': 'Stay up-to-date with the latest changes, features, and improvements.',
    'concepts': 'Understand the core principles and architecture behind our product.',
  };

  const categoriesMap = new Map<string, DocPage[]>();
  allDocs.forEach((doc) => {
    if (!categoriesMap.has(doc.category)) {
      categoriesMap.set(doc.category, []);
    }
    categoriesMap.get(doc.category)?.push(doc);
  });

  const categories = Array.from(categoriesMap.entries()).map(([name, docs]) => ({
    name,
    description: categoryDescriptions[name] || `Explore guides related to ${name.replace(/-/g, ' ')}.`,
    docs: docs && Array.isArray(docs)
      ? docs.sort((a, b) => {
          if (a.frontmatter?.title && b.frontmatter?.title) {
            return a.frontmatter.title.localeCompare(b.frontmatter.title);
          }
          return 0;
        })
      : [],
  }));

  // Optionally sort categories by a specific order or alphabetically
  const categoryOrder = [
    'getting-started',
    'feature-guides',
    'troubleshooting',
    'faqs',
    'changelog',
    'concepts',
  ];

  categories.sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.name);
    const bIndex = categoryOrder.indexOf(b.name);
    if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return {
    props: {
      categories,
    },
  };
};