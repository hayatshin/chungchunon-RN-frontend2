import { gql, useQuery } from "@apollo/client";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Dimensions, FlatList, Image, Text, View } from "react-native";
import Layout from "../components/Layout";

const SEE_FEED_LIKES_QUERY = gql`
  query seeFeedLikes($id: Int!) {
    seeFeedLikes(id: $id) {
      id
      name
      avatar
    }
  }
`;

export default function LikeInfo({ route }) {
  const screenFocus = useIsFocused();
  const { width: windowWidth } = Dimensions.get("window");
  const { data, refetch } = useQuery(SEE_FEED_LIKES_QUERY, {
    variables: {
      id: parseInt(route?.params?.feedId),
    },
  });

  useEffect(() => {
    refetch();
  }, [screenFocus]);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={data?.seeFeedLikes}
        keyExtractor={(person) => person.id}
        renderItem={({ item: likeperson }) => {
          return (
            <View
              style={{
                width: windowWidth,
                height: 60,
                paddingHorizontal: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 20,
                }}
                source={{ uri: likeperson?.avatar }}
              />
              <Text
                style={{ fontFamily: "Spoqa", fontWeight: "700", fontSize: 20 }}
              >
                {likeperson?.name}
              </Text>
            </View>
          );
        }}
      />
      <Text>Like</Text>
    </View>
  );
}
