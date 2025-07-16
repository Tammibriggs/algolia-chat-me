import "@/styles/globals.css";
import { algoliasearch } from "algoliasearch";
import type { AppProps } from "next/app";
import { InstantSearch, SearchBox } from "react-instantsearch";

const ALGOLIA_APPLICATION_ID = String(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID
);
const ALGOLIA_API_KEY = String(process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);
const ALGOLIA_INDEX_NAME = String(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME);

export default function App({ Component, pageProps }: AppProps) {
  const searchClient = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);
  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX_NAME}>
      <Component {...pageProps} />
    </InstantSearch>
  );
}
