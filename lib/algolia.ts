import * as fs from 'fs';
import * as path from 'path';
import { getAllDocsMeta } from './docs'; // Re-use the function to get all doc metadata

// interface AlgoliaRecord {
//   objectID: string;
//   title: string;
//   description: string;
//   content: string;
//   category: string;
//   tags: string[];
//   url: string;
// }

export function generateAlgoliaIndex() {
  const allDocs = getAllDocsMeta();
  const records = allDocs.map((doc) => ({
    objectID: `${doc.category}-${doc.slug}`, // Unique ID for Algolia
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    content: doc.content, // Raw Markdown content for search
    category: doc.category,
    tags: doc.frontmatter.tags || [],
    url: `/docs/${doc.category}/${doc.slug}`,
  }));

  const outputPath = path.join(process.cwd(), 'public', 'algolia-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));

  console.log(`Algolia index generated at: ${outputPath}`);
}

// To run this:
// 1. Add a script in package.json: "generate-algolia-index": "ts-node src/lib/algolia.ts"
// 2. Run `npm run generate-algolia-index` or `yarn generate-algolia-index`
//    You'll need `ts-node` installed (`npm install -D ts-node`)