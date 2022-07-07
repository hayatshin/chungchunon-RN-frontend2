import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { offsetLimitPagination } from "@apollo/client/utilities";

const uploadHttpLink = createUploadLink({
  uri: "http://172.30.1.8:4000/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext(async (_, { headers }) => {
  const keys = await AsyncStorage.getAllKeys();
  const result = await AsyncStorage.multiGet(keys);
  const modifiedResult = result.flat().splice(1);
  const parseResult = JSON.parse(
    JSON.parse(JSON.parse(JSON.stringify(modifiedResult)).toString())
      .usersReducer
  );
  const { token } = parseResult;

  return {
    headers: {
      ...headers,
      token,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(uploadHttpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          seeAllFeeds: offsetLimitPagination(),
        },
      },
    },
  }),
});

export default client;
