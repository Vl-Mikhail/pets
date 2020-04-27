import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import fetch from "isomorphic-unfetch";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql", // Server URL (must be absolute)
  credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
  fetch,
});

// Create a WebSocket link:
const wsLink = process.browser
  ? new WebSocketLink({
      uri: `ws://localhost:4000/graphql`,
      options: {
        reconnect: true,
      },
    })
  : null;

const link = process.browser
  ? split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

export default function createApolloClient(initialState, ctx) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link,
    cache: new InMemoryCache().restore(initialState),
  });
}
