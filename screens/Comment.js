import { gql, useQuery } from "@apollo/client";
import React from "react";
import { View, Text, Dimensions, Image, FlatList } from "react-native";
import { colors } from "../colors";
import Layout from "../components/Layout";
import { COMMENT_FRAGMENT } from "../fragments";
import { koreaDate } from "../koreaDate";

const SEE_COMMENTS_QUERY = gql`
  query seeFeedComments($id: Int!) {
    seeFeedComments(id: $id) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

export default function Comment({ route }) {
  const { data } = useQuery(SEE_COMMENTS_QUERY, {
    variables: {
      id: parseInt(route?.params?.feedId),
    },
  });
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <View
        style={{
          width: windowWidth,
          height: windowHeight * 0.8,
          backgroundColor: "white",
          position: "absolute",
          bottom: 0,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <FlatList
          contentContainerStyle={{
            marginTop: 20,
            padding: 20,
          }}
          data={data?.seeFeedComments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const commentCreateTime = koreaDate(item.createdAt);
            return (
              <View
                style={{
                  width: windowWidth,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                }}
              >
                {/* 작성자 사진 */}
                <Image
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 24,
                  }}
                  source={{ uri: item.user.avatar }}
                />
                <View
                  style={{
                    width: parseInt(windowWidth) - 60,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-end",
                    }}
                  >
                    {/* 이름 */}
                    <Text
                      style={{
                        fontFamily: "Spoqa",
                        fontWeight: "700",
                        fontSize: 20,
                        marginRight: 10,
                      }}
                    >
                      {item.user.name}
                    </Text>
                    {/* 작성 시간 */}
                    <Text
                      style={{
                        fontFamily: "Spoqa",
                        color: colors.gray,
                        fontSize: 13,
                      }}
                    >
                      {commentCreateTime}
                    </Text>
                    {/* 댓글 */}
                  </View>
                  <Text
                    style={{
                      fontFamily: "Spoqa",
                      fontSize: 18,
                      padding: 8,
                    }}
                  >
                    {item.payload}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
