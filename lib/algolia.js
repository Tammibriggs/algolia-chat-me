import * as fs from "fs";
import * as path from "path";
import { getAllDocsMeta } from "./docs.js"; // Re-use the function to get all doc metadata
import { remark } from "remark";
import { visit } from "unist-util-visit";

function splitCodeTokens(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // camelCase -> camel Case
    .replace(/\./g, " ") // sdk.setBotPersona -> sdk setBotPersona
    .split(/\s+/) // split on spaces
    .filter(Boolean);
}

export function generateAlgoliaIndex() {
  const allDocs = getAllDocsMeta(); // Assumes this already uses gray-matter

  const records = allDocs.map((doc) => {
    const codeBlocks = [];
    const inlineCode = [];
    const headings = [];

    // Only use remark for parsing structure (not frontmatter)
    const tree = remark().parse(doc.content);

    visit(tree, (node) => {
      if (node.type === "code") {
        codeBlocks.push({
          type: "code",
          language: node.lang || "text",
          code: node.value,
        });
      }
      if (node.type === "inlineCode") {
        inlineCode.push({
          type: "inline",
          code: node.value,
        });
      }
      if (node.type === "heading") {
        headings.push({
          level: node.depth,
          text: node.children
            .filter((child) => child.type === "text")
            .map((child) => child.value)
            .join(""),
        });
      }
    });

    const allCode = [
      ...codeBlocks.map((block) => block.code),
      ...inlineCode.map((inline) => inline.code),
    ].filter(Boolean);

    const uniqueCode = [...new Set(allCode)];

    const codeTerms = allCode.flatMap(splitCodeTokens).filter(Boolean);

    const uniqueCodeTerms = [...new Set(codeTerms)].join(" ");

    return {
      objectID: `${doc.category}-${doc.slug}`,
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      content: doc.content,
      category: doc.category,
      // tags: doc.frontmatter.tags || [],
      code: uniqueCode,
      codeTerms: uniqueCodeTerms,
      // headings: headings.map((h) => h.text),
      filepath: `docs/${doc.category}/${doc.slug}.mdx`,
      url: `/docs/${doc.category}/${doc.slug}`,
    };
  });

  const outputPath = path.join(process.cwd(), "public", "algolia-index.json");
  fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
  console.log(`✅ Algolia index generated at: ${outputPath}`);
}

// If run directly, execute the index generation
if (import.meta.url === `file://${process.cwd()}/lib/algolia.js`) {
  generateAlgoliaIndex();
}
