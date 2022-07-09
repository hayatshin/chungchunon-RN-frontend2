import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "../colors";

const ME_QUERY = gql`
  query me {
    me {
      avatar
    }
  }
`;

export default function NotiBox() {
  const { data } = useQuery(ME_QUERY);
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: "100%",
        height: 80,
        marginBottom: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 최대 박스 */}
      <TouchableOpacity
        onPress={() => navigation.navigate("WriteFeed")}
        style={{
          width: "100%",
          height: 80,
          backgroundColor: "white",
          // borderRadius: 20,
          // borderWidth: 1,
          borderColor: colors.gray,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {/* 로그인 유저 사진 */}
        <View
          style={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingHorizontal: 15,
          }}
        >
          <Image
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
            source={{ uri: data?.me?.avatar }}
          />
        </View>
        {/* 글쓰기창 */}
        <View
          style={{
            width: "80%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              height: 40,
              backgroundColor: "white",
              borderRadius: 15,
              borderWidth: 1,
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
                color: "black",
              }}
            >
              어떤 하루를 보내고 계신가요?
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* 경계 */}
      <View
        style={{
          width: "100%",
          height: 10,
          backgroundColor: colors.lightGray,
        }}
      ></View>
    </View>
  );
}
