import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useIsFocused, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import { colors } from "../colors";

const SEE_FEED_LIKES_QUERY = gql`
  query seeFeedLikes($id: Int!) {
    seeFeedLikes(id: $id) {
      id
      name
      avatar
    }
  }
`;

const SEE_POEM_LIKES_QUERY = gql`
  query seePoemLikes($id: Int!) {
    seePoemLikes(id: $id) {
      id
      name
      avatar
    }
  }
`;

export default function LikeInfo({ route }) {
  const screenFocus = useIsFocused();
  const { width: windowWidth } = Dimensions.get("window");

  const [feedLikesQuery, { data: feedData, refetch: feedRefetch }] =
    useLazyQuery(SEE_FEED_LIKES_QUERY, {
      variables: {
        id: parseInt(route?.params?.feedId),
      },
    });
  const [poemLikesQuery, { data: poemData, refetch: poemRefetch }] =
    useLazyQuery(SEE_POEM_LIKES_QUERY, {
      variables: {
        id: parseInt(route?.params?.poemId),
      },
    });

  const [dataready, setDataready] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (route.params.feedId) {
      feedRefetch();
    } else {
      poemRefetch();
    }
    if (route.params.feedId) {
      feedLikesQuery();
    } else {
      poemLikesQuery();
    }
  }, [screenFocus]);

  useEffect(() => {
    if (route.params.feedId) {
      setData(feedData?.seeFeedLikes);
    } else {
      setData(poemData?.seePoemLikes);
    }
  }, [feedData, poemData]);

  useEffect(() => {
    setDataready(true);
  }, [data]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {dataready ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
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
                  style={{
                    fontFamily: "Spoqa",
                    fontWeight: "700",
                    fontSize: 20,
                  }}
                >
                  {likeperson?.name}
                </Text>
              </View>
            );
          }}
        />
      ) : (
        <ActivityIndicator size={30} color={colors.mainColor} />
      )}
    </View>
  );
}
