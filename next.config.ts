import type { NextConfig } from "next";
import { generateAlgoliaIndex } from "./lib/algolia";

if (process.env.NODE_ENV === 'development') {
  generateAlgoliaIndex();
}

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
