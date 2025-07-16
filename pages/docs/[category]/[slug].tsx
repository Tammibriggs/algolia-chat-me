import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { getDocBySlug, getDocPaths, getAllDocsMeta, DocFrontmatter, DocPage as DosPageProps2 } from '@/lib/docs';
import Layout from '@/components/Layout';
import Breadcrumbs from '@/components/Breadcrumbs';
import { NavItem } from '@/components/Sidebar'; // Import NavItem

interface DocPageProps {
  mdxSource: any;
  frontmatter: DocFrontmatter;
  category: string;
  slug: string;
  navItems: NavItem[]; // ADDED
  content: string;
}


const components = {
  // Add any custom components you want to use in MDX, e.g.,
  // CodeBlock: (props) => <pre><code {...props} /></pre>,
};

export default function DocPage({ mdxSource, frontmatter, category, slug, navItems }: DocPageProps) { // Add navItems prop
  const breadcrumbItems = [
    { label: 'Docs', href: '/docs' },
    { label: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '), href: `/docs/${category}` },
    { label: frontmatter.title, href: `/docs/${category}/${slug}` },
  ];

  return (
    <Layout frontmatter={frontmatter} navItems={navItems}> {/* Pass navItems to Layout */}
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <article className="prose lg:prose-lg mx-auto mt-4">
          <h1>{frontmatter.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{frontmatter.description}</p>
          <MDXRemote {...mdxSource} components={components} />
        </article>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getDocPaths();
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { category, slug } = params as { category: string; slug: string };
  const { mdxSource, frontmatter, content } = await getDocBySlug(category, slug);

  // Generate navItems here
  const allDocs = getAllDocsMeta();
  const categoriesMap = new Map<string, DosPageProps2[]>();
  allDocs.forEach((doc) => {
    if (!categoriesMap.has(doc.category)) {
      categoriesMap.set(doc.category, []);
    }
    categoriesMap.get(doc.category)?.push(doc);
  });

  const navItems: NavItem[] = Array.from(categoriesMap.entries()).map(([categorySlug, docs]) => ({
    label: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' '),
    href: `/docs/${categorySlug}`,
    active: false, // Active state handled in Sidebar component
    subItems: docs
      .filter(doc => doc.frontmatter && typeof doc.frontmatter.title === 'string')
      .map(doc => ({
        label: doc.frontmatter.title,
        href: `/docs/${doc.category}/${doc.slug}`,
        active: false, // Active state handled in Sidebar component
      })),
  }));

  return {
    props: {
      mdxSource,
      frontmatter,
      category,
      slug,
      content,
      navItems, // Pass navItems
    },
  };
};