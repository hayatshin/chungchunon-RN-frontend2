import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

export default function LikeAndComment({
  isLiked,
  likeNumber,
  commentNumber,
  feedId,
}) {
  const navigation = useNavigation();
  const [screenLiked, setScreenLiked] = useState(isLiked);
  const [screenLikeNumber, setScreenLikeNumber] = useState(likeNumber);

  // toggleLike

  const updateToggleLike = async (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const cacheFeedId = `Feed:${feedId}`;
      await cache.modify({
        id: cacheFeedId,
        fields: {
          isLiked(prev) {
            setScreenLiked(!screenLiked);
            return !prev;
          },
          likeNumber(prev) {
            if (screenLiked) {
              setScreenLikeNumber(parseInt(screenLikeNumber) - 1);
              return prev - 1;
            }
            setScreenLikeNumber(parseInt(screenLikeNumber) + 1);
            return prev + 1;
          },
        },
      });
    }
  };

  const [toggleLikeMutation, { data }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id: parseInt(feedId),
    },
    update: updateToggleLike,
  });

  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
      }}
    >
      {/* 좋아요 */}
      <TouchableOpacity onPress={toggleLikeMutation}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            style={{
              color: screenLiked ? colors.mainColor : "black",
              fontWeight: "700",
              fontSize: 35,
              marginRight: 5,
            }}
            name={screenLiked ? "heart" : "heart-outline"}
          />
          <Text
            style={{
              fontSize: 20,
              color: "black",
              fontWeight: "700",
            }}
          >
            좋아요 {screenLikeNumber}개
          </Text>
        </View>
      </TouchableOpacity>
      {/* 댓글 */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Comment", { feedId })}
        style={{
          paddingHorizontal: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "black",
            fontWeight: "700",
          }}
        >
          댓글 {commentNumber}개 모두 보기
        </Text>
      </TouchableOpacity>
    </View>
  );
}
