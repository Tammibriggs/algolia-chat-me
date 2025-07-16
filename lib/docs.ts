import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

export interface DocFrontmatter {
  title: string;
  description: string;
  tags: string[];
  category: string;
}

export interface DocPage {
  slug: string;
  category: string;
  frontmatter: DocFrontmatter;
  content: string;
}

const DOCS_DIRECTORY = path.join(process.cwd(), 'docs');

export function getDocPaths() {
  const paths: { params: { category: string; slug: string } }[] = [];
  const categories = fs.readdirSync(DOCS_DIRECTORY);

  categories.forEach((category) => {
    const categoryPath = path.join(DOCS_DIRECTORY, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      files.forEach((file) => {
        if (file.endsWith('.mdx') || file.endsWith('.md')) {
          const slug = file.replace(/\.mdx?$/, '');
          paths.push({
            params: { category, slug },
          });
        }
      });
    }
  });
  return paths;
}

export async function getDocBySlug(category: string, slug: string) {
  const fullPath = path.join(DOCS_DIRECTORY, category, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const mdxSource = await serialize(content, { scope: data });

  return {
    slug,
    category,
    frontmatter: data as DocFrontmatter,
    mdxSource,
    content, // Include raw content for Algolia indexing
  };
}

export function getAllDocsMeta(): DocPage[] {
  const docs: DocPage[] = [];
  const categories = fs.readdirSync(DOCS_DIRECTORY);

  categories.forEach((category) => {
    const categoryPath = path.join(DOCS_DIRECTORY, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      files.forEach((file) => {
        if (file.endsWith('.mdx') || file.endsWith('.md')) {
          const slug = file.replace(/\.mdx?$/, '');
          const fullPath = path.join(categoryPath, file);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);

          docs.push({
            slug,
            category,
            frontmatter: data as DocFrontmatter,
            content,
          });
        }
      });
    }
  });
  return docs;
}

// Logic for parsing markdown files
export function parseMarkdownFile(filePath: string) {
  // TODO: Implement markdown parsing logic
}

