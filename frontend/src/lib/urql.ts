import { Client, cacheExchange, fetchExchange } from "urql";

export const audy = new Client({
  url: process.env.NEXT_PUBLIC_AUDY_GRAPH_API as string,
  exchanges: [cacheExchange, fetchExchange],
});

export const aemf = new Client({
  url: process.env.NEXT_PUBLIC_AEMF_GRAPH_API as string,
  exchanges: [cacheExchange, fetchExchange],
});
