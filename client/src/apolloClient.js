import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql', // URL вашего GraphQL API
    cache: new InMemoryCache(),
});

export default client;