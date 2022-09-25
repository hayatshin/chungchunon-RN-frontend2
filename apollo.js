import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { offsetLimitPagination } from "@apollo/client/utilities";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

const uploadHttpLink = createUploadLink({
  // uri: "http://192.168.0.74:4000/graphql",
  uri: "https://chungchunon-rn-backend.herokuapp.com/graphql",
});

export const logUserIn = async (token) => {
  try {
    await AsyncStorage.setItem("token", JSON.stringify(token));
    tokenVar(token);
  } catch (e) {
    console.error(e);
  }
};

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
  const token = await AsyncStorage.getItem("token");
  return {
    headers: {
      ...headers,
      token: JSON.parse(token),
    },
  };
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeAllFeeds: offsetLimitPagination(),
        seeAllPoems: offsetLimitPagination(),
        seeCertainUserFeed: offsetLimitPagination(),
        seeCertainUserPoem: offsetLimitPagination(),
        seeCertainUserFeedPoem: offsetLimitPagination(),
        seeMeFeedPoem: offsetLimitPagination(),
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(uploadHttpLink),
  cache,
});

export default client;
