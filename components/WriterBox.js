import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { colors } from "../colors";
import { koreaDate } from "../koreaDate";
import SmallBtn from "./SmallBtn";
import { useRoute } from "@react-navigation/native";
import { deleteFeedConfirmVar, deleteFeedVar } from "../apollo";

const ME_QUERY = gql`
  query me {
    me {
      id
      name
    }
  }
`;

export default function WriterBox({
  feedId,
  writerAvatar,
  writerName,
  writeTime,
  writerId,
}) {
  const navigation = useNavigation();
  const { width: windowWidth } = Dimensions.get("window");
  const { data: meData } = useQuery(ME_QUERY);

  const completeCreatedTime = koreaDate(writeTime);

  const onFeedEditBtn = () => {
    navigation.navigate("EditFeed", { feedId });
  };

  const deleteClick = () => {
    navigation.navigate("DeleteFeed", { feedId });
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
        onPress={() => navigation.navigate("FriendFeed", { writerId })}
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
            marginBottom: 5,
          }}
        >
          {/* 이름 */}
          <TouchableOpacity
            onPress={() => navigation.navigate("FriendFeed", { writerId })}
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
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
            >
              <SmallBtn
                text={"수정"}
                color={"gray"}
                pressFunction={onFeedEditBtn}
              />
              <View style={{ width: 15 }}></View>
              <SmallBtn
                text={"삭제"}
                color={"main"}
                pressFunction={deleteClick}
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
          {completeCreatedTime}
        </Text>
      </View>
    </View>
  );
}
