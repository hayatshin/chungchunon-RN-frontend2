import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { colors } from "../colors";
import { koreaDate } from "../koreaDate";
import SmallBtn from "./SmallBtn";

const ME_QUERY = gql`
  query me {
    me {
      id
      name
    }
  }
`;

const DELETE_FEED_MUTATION = gql`
  mutation deleteFeed($id: Int!) {
    deleteFeed(id: $id) {
      ok
      error
    }
  }
`;

export default function WriterBox({
  path,
  feedId,
  writerAvatar,
  writerName,
  writeTime,
  writerId,
}) {
  const navigation = useNavigation();
  const { width: windowWidth } = Dimensions.get("window");
  const { data: meData } = useQuery(ME_QUERY);
  const onUpdateDelete = (cache, result) => {
    const {
      data: {
        deleteFeed: { ok },
      },
    } = result;
    if (ok) {
      const cacheFeedId = `Feed:${feedId}`;
      cache.evict({
        id: cacheFeedId,
      });
    }
    navigation.navigate("Tabs", { screen: "일상" });
  };
  const [deleteFeedMutation] = useMutation(DELETE_FEED_MUTATION, {
    variables: { id: parseInt(feedId) },
    update: onUpdateDelete,
  });
  const completeCreatedTime = koreaDate(writeTime);
  const onEditBtn = () => {
    navigation.navigate("EditFeed", { feedId });
  };
  return (
    <View
      style={{
        width: windowWidth,
        height: 90,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("FriendFeed", { userId: writerId })}
      >
        <Image
          style={{ width: 60, height: 60, borderRadius: 30, marginRight: 15 }}
          source={{ uri: writerAvatar }}
        />
      </TouchableOpacity>
      <View
        stye={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: windowWidth - 105,
            marginBottom: 15,
          }}
        >
          {/* 이름 */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("FriendFeed", { userId: writerId })
            }
          >
            <Text
              style={{
                fontFamily: "Spoqa",
                fontSize: 28,
                fontWeight: "800",
              }}
            >
              {writerName}
            </Text>
          </TouchableOpacity>
          {/* 수정 및 삭제 */}
          {meData?.me?.name === writerName ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "45%",
                justifyContent: "space-between",
              }}
            >
              <SmallBtn
                text={"수정"}
                color={"gray"}
                pressFunction={onEditBtn}
              />
              <SmallBtn
                text={"삭제"}
                color={"main"}
                pressFunction={deleteFeedMutation}
              />
            </View>
          ) : null}
        </View>
        {/* 작성 날짜 */}
        <Text
          style={{
            fontFamily: "Spoqa",
            fontSize: 15,
            color: colors.gray,
            fontWeight: "600",
          }}
        >
          {completeCreatedTime} 글 작성
        </Text>
      </View>
    </View>
  );
}
