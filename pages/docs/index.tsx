import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllDocsMeta, DocPage } from '../../lib/docs';
import { NavItem } from '../../components/Sidebar';

interface DocsIndexProps {
  categories: {
    name: string;
    docs: DocPage[];
  }[];
}

export default function DocsIndex({ categories }: DocsIndexProps) {
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
    <Layout title="Documentation" navItems={navItems}>
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <h1 className="text-4xl sm:text-4xl font-extrabold mb-8 text-center">Documentation</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <div key={category.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-2xl font-semibold mb-4 capitalize">
                <Link href={`/docs/${category.name}`} className="hover:underline">
                  {category.name.replace(/-/g, ' ')}
                </Link>
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {category.docs.map((doc) => (
                  <li key={doc.slug}>
                    <Link href={`/docs/${doc.category}/${doc.slug}`} className="text-blue-600 hover:underline dark:text-blue-400">
                      {doc.frontmatter.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allDocs = getAllDocsMeta();

  const categoriesMap = new Map<string, DocPage[]>();
  allDocs.forEach((doc) => {
    if (!categoriesMap.has(doc.category)) {
      categoriesMap.set(doc.category, []);
    }
    categoriesMap.get(doc.category)?.push(doc);
  });

  const categories = Array.from(categoriesMap.entries()).map(([name, docs]) => ({
    name,
    docs,
  }));

  return {
    props: {
      categories,
    },
  };
};