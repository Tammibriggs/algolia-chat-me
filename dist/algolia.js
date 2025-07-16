"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAlgoliaIndex = generateAlgoliaIndex;
var fs = require("fs");
var path = require("path");
var docs_1 = require("./docs"); // Re-use the function to get all doc metadata
// interface AlgoliaRecord {
//   objectID: string;
//   title: string;
//   description: string;
//   content: string;
//   category: string;
//   tags: string[];
//   url: string;
// }
function generateAlgoliaIndex() {
    var allDocs = (0, docs_1.getAllDocsMeta)();
    var records = allDocs.map(function (doc) { return ({
        objectID: "".concat(doc.category, "-").concat(doc.slug), // Unique ID for Algolia
        title: doc.frontmatter.title,
        description: doc.frontmatter.description,
        content: doc.content, // Raw Markdown content for search
        category: doc.category,
        tags: doc.frontmatter.tags || [],
        url: "/docs/".concat(doc.category, "/").concat(doc.slug),
    }); });
    var outputPath = path.join(process.cwd(), 'public', 'algolia-index.json');
    fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
    console.log("Algolia index generated at: ".concat(outputPath));
}
// To run this:
// 1. Add a script in package.json: "generate-algolia-index": "ts-node src/lib/algolia.ts"
// 2. Run `npm run generate-algolia-index` or `yarn generate-algolia-index`
//    You'll need `ts-node` installed (`npm install -D ts-node`)
