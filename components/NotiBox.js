import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "../colors";

export default function NotiBox() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: "100%",
        height: 90,
        marginBottom: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 분홍 박스 */}
      <TouchableOpacity
        onPress={() => navigation.navigate("WriteFeed")}
        style={{
          width: "90%",
          height: 75,
          backgroundColor: colors.mainColor,
          borderRadius: 20,
          borderWidth: 3,
          borderColor: colors.gray,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 청춘온 이모티콘 */}
        <View
          style={{
            width: 65,
            height: 65,
            borderRadius: 35,
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.gray,
            marginRight: 15,
          }}
        >
          <Image
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
            source={require("../assets/images/ch-logo.gif")}
          />
        </View>
        {/* 글쓰기창 */}
        <View
          style={{
            width: "70%",
            height: 40,
            backgroundColor: "white",
            borderRadius: 15,
            borderWidth: 2,
            borderColor: colors.gray,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Spoqa",
              fontSize: 20,
              fontWeight: "700",
              color: colors.gray,
            }}
          >
            어떤 하루를 보내고 계신가요?
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
