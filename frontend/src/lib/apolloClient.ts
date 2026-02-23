/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { from } from "@apollo/client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const errorLink = onError(({ error }) => {
    if (error) {
        if ("errors" in error && Array.isArray((error as any).errors)) {
            (error as any).errors.forEach((err: any) => {
                console.error("GraphQL Error:", err.message);
            });
        } else {
            console.error("Network/Error:", (error as any).message);
        }
    }
});

const httpLink = new HttpLink({
    uri: `${API_URL}/graphql`,
    credentials: "include",
});

const client = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client;