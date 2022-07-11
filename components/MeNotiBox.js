import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "../colors";

const ME_QUERY = gql`
  query me {
    me {
      id
      name
      avatar
      region
      bio
      community
    }
  }
`;

export default function MeNotiBox() {
  const { data } = useQuery(ME_QUERY);
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: "100%",
        height: 150,
        marginBottom: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "yellow",
      }}
    >
      {/* 자기 정보 */}
      <View
        style={{
          width: "100%",
          height: 150,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
        }}
      >
        {/* 로그인 유저 사진 */}
        <View
          style={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
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
            height: "80%",
            borderWidth: 1,
            display: "flex",
            alignItems: "center",
            borderRadius: 10,
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
            {data?.me?.name}
          </Text>
        </View>
      </View>
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
