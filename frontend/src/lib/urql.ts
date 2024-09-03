import { Client, cacheExchange, fetchExchange } from "urql";

export const client = new Client({
  url: process.env.NEXT_PUBLIC_GRAPH_API as string,
  exchanges: [cacheExchange, fetchExchange],
});
