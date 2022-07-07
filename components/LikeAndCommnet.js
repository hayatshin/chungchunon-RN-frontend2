import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../colors";
import { Ionicons } from "@expo/vector-icons";

export default function LikeAndCommnet({ likeNumber, commentNumber }) {
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
      }}
    >
      {/* 좋아요 */}
      <TouchableOpacity>
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
              color: colors.mainColor,
              fontWeight: "700",
              fontSize: 25,
              marginRight: 5,
            }}
            name="heart-outline"
          />
          <Text
            style={{
              fontSize: 20,
              color: colors.mainColor,
              fontWeight: "700",
            }}
          >
            좋아요 {likeNumber}개
          </Text>
        </View>
      </TouchableOpacity>
      {/* 댓글 */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.lightMain,
          paddingHorizontal: 5,
          paddingVertical: 2,
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: colors.mainColor,
            fontWeight: "700",
          }}
        >
          댓글 {commentNumber}개 모두 보기
        </Text>
      </TouchableOpacity>
    </View>
  );
}
