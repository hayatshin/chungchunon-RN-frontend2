import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../colors";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
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
  const screenFocus = useIsFocused();
  const navigation = useNavigation();
  const [screenLiked, setScreenLiked] = useState(isLiked);
  const [screenLikeNumber, setScreenLikeNumber] = useState(likeNumber);
  const [screencommentNumber, setScreenCommentNubmer] = useState(commentNumber);

  // toggleLike

  useEffect(() => {
    setScreenLiked(isLiked);
    setScreenLikeNumber(likeNumber);
    setScreenCommentNubmer(commentNumber);
  }, [screenFocus]);

  const updateToggleLike = async (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      setScreenLiked(!screenLiked);
      if (screenLiked) {
        setScreenLikeNumber(parseInt(screenLikeNumber) - 1);
      } else {
        setScreenLikeNumber(parseInt(screenLikeNumber) + 1);
      }
      const cacheFeedId = `Feed:${feedId}`;
      const cacheFpId = `Feedpoem:${feedId}`;
      cache.modify({
        id: cacheFeedId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likeNumber(prev) {
            if (screenLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
      cache.modify({
        id: cacheFpId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likeNumber(prev) {
            if (screenLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };

  const [toggleLikeMutation, { data, refetch }] = useMutation(
    TOGGLE_LIKE_MUTATION,
    {
      variables: {
        id: parseInt(feedId),
      },
      update: updateToggleLike,
    }
  );

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
      {/* ????????? */}
      <TouchableOpacity
        onPress={() => navigation.navigate("LikeInfo", { feedId })}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={toggleLikeMutation}>
            <Ionicons
              style={{
                color: screenLiked ? colors.mainColor : "black",
                fontWeight: "700",
                fontSize: 35,
                marginRight: 5,
              }}
              name={screenLiked ? "heart" : "heart-outline"}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              color: "black",
              fontWeight: "700",
            }}
          >
            ????????? {screenLikeNumber}???
          </Text>
        </View>
      </TouchableOpacity>

      {/* ?????? */}
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
          ?????? {screencommentNumber}??? ??????
        </Text>
      </TouchableOpacity>
    </View>
  );
}
