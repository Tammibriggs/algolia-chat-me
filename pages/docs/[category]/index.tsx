import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '@/components/Layout';
import DocCard from '@/components/DocCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllDocsMeta, DocPage } from '../../../lib/docs';
import { NavItem } from '../../../components/Sidebar';

interface CategoryIndexProps {
  category: string;
  docs: DocPage[];
  navItems: NavItem[];
}

export default function CategoryIndex({ category, docs, navItems }: CategoryIndexProps) {
  const breadcrumbItems = [
    { label: 'Docs', href: '/docs' },
    { label: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '), href: `/docs/${category}` },
  ];

  return (
    <Layout title={`${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')} Docs`} navItems={navItems}>
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mb-6 mt-4">
          {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {docs.map((doc) => (
            <DocCard
              key={doc.slug}
              title={doc.frontmatter.title}
              description={doc.frontmatter.description}
              href={`/docs/${doc.category}/${doc.slug}`}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allDocs = getAllDocsMeta();
  const categories = [...new Set(allDocs.map((doc) => doc.category))];
  const paths = categories.map((category) => ({
    params: { category },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { category } = params as { category: string };
  const allDocs = getAllDocsMeta();

  const docsInCategory = allDocs.filter((doc) => doc.category === category);

  // Generate navItems (same as in [slug].tsx)
  const categoriesMap = new Map<string, DocPage[]>();
  allDocs.forEach((doc) => {
    if (!categoriesMap.has(doc.category)) {
      categoriesMap.set(doc.category, []);
    }
    categoriesMap.get(doc.category)?.push(doc);
  });
  const navItems: NavItem[] = Array.from(categoriesMap.entries()).map(([categorySlug, docs]) => ({
    label: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' '),
    href: `/docs/${categorySlug}`,
    active: false, // Active state handled in Sidebar
    subItems: docs.map(doc => ({
      label: doc.frontmatter.title,
      href: `/docs/${doc.category}/${doc.slug}`,
      active: false,
    })),
  }));

  return {
    props: {
      category,
      docs: docsInCategory,
      navItems,
    },
  };
};