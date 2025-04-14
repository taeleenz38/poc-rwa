import { Client, cacheExchange, fetchExchange } from "urql";

export const vlr = new Client({
  url: process.env.NEXT_PUBLIC_VLR_GRAPH_API as string,
  exchanges: [cacheExchange, fetchExchange],
});

export const eqv = new Client({
  url: process.env.NEXT_PUBLIC_EQV_GRAPH_API as string,
  exchanges: [cacheExchange, fetchExchange],
});
