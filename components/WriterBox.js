import React from "react";
import { View, Text, Image } from "react-native";
import { colors } from "../colors";

export default function WriterBox({
  writerAvatar,
  writerName,
  writeTime,
  editTime,
}) {
  let createdTime = null;
  if (writeTime === editTime) {
    createdTime = new Date(+writeTime);
  } else {
    createdTime = new Date(+editTime);
  }
  const dmonth = createdTime.getMonth() + 1;
  const ampm = createdTime.getHours() >= 12 ? "오후 " : "오전 ";
  const hours = createdTime.getHours() == 12 ? 12 : createdTime.getHours() % 12;
  const completeCreatedTime =
    createdTime.getFullYear() +
    "년 " +
    dmonth +
    "월 " +
    createdTime.getDate() +
    "일 " +
    ampm +
    hours +
    "시 " +
    createdTime.getMinutes() +
    "분";

  return (
    <View
      style={{
        width: "100%",
        height: 90,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
      }}
    >
      <Image
        style={{ width: 60, height: 60, borderRadius: 30, marginRight: 15 }}
        source={{ uri: writerAvatar }}
      />
      <View>
        <Text
          style={{
            fontFamily: "Spoqa",
            fontSize: 28,
            fontWeight: "800",
            marginBottom: 8,
          }}
        >
          {writerName}
        </Text>
        <Text
          style={{
            fontFamily: "Spoqa",
            fontSize: 15,
            color: colors.gray,
            fontWeight: "600",
          }}
        >
          {writeTime === editTime
            ? `${completeCreatedTime} 글 작성`
            : `${completeCreatedTime} 글 수정`}
        </Text>
      </View>
    </View>
  );
}
