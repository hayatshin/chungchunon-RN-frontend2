import { gql } from "@apollo/client";
import React from "react";
import { View, Text } from "react-native";
import Layout from "../components/Layout";

const Me_QUERY = gql`
  query me {
    me {
      id
      name
      avatar
      region
    }
  }
`;

export default function Me() {
  return (
    <Layout>
      <Text></Text>
    </Layout>
  );
}
