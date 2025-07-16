import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

const DOCS_DIRECTORY = path.join(process.cwd(), "docs");

export function getDocPaths() {
  const paths = [];
  const categories = fs.readdirSync(DOCS_DIRECTORY);

  categories.forEach((category) => {
    const categoryPath = path.join(DOCS_DIRECTORY, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      files.forEach((file) => {
        if (file.endsWith(".mdx") || file.endsWith(".md")) {
          const slug = file.replace(/\.mdx?$/, "");
          paths.push({
            params: { category, slug },
          });
        }
      });
    }
  });
  return paths;
}

export async function getDocBySlug(category, slug) {
  const fullPath = path.join(DOCS_DIRECTORY, category, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const mdxSource = await serialize(content, { scope: data });

  return {
    slug,
    category,
    frontmatter: data,
    mdxSource,
    content, // Include raw content for Algolia indexing
  };
}

export function getAllDocsMeta() {
  const docs = [];
  const categories = fs.readdirSync(DOCS_DIRECTORY);

  categories.forEach((category) => {
    const categoryPath = path.join(DOCS_DIRECTORY, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      files.forEach((file) => {
        if (file.endsWith(".mdx") || file.endsWith(".md")) {
          const slug = file.replace(/\.mdx?$/, "");
          const fullPath = path.join(categoryPath, file);
          const fileContents = fs.readFileSync(fullPath, "utf8");
          const { data, content } = matter(fileContents);

          docs.push({
            slug,
            category,
            frontmatter: data,
            content,
          });
        }
      });
    }
  });
  return docs;
}

// Logic for parsing markdown files
export function parseMarkdownFile(filePath) {
  // TODO: Implement markdown parsing logic
}
