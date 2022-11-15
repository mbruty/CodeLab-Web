import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { API_URL } from "./config";
const link = createHttpLink({
  uri: API_URL,
  credentials: "include",
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
