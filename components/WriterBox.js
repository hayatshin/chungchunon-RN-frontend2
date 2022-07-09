import React from "react";
import { View, Text, Image } from "react-native";
import { colors } from "../colors";
import { koreaDate } from "../koreaDate";

export default function WriterBox({
  writerAvatar,
  writerName,
  writeTime,
  editTime,
}) {
  const completeCreatedTime = koreaDate(writeTime);
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
          {completeCreatedTime} 글 작성
        </Text>
      </View>
    </View>
  );
}
