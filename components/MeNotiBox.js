import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../colors";
import { ME_FRAGMENT } from "../fragments";

const ME_QUERY = gql`
  query me {
    me {
      ...MeFragment
    }
  }
  ${ME_FRAGMENT}
`;

const InfoBox = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-bottom: 5px;
`;

const InfoHeader = styled.Text`
  font-family: "Spoqa";
  font-size: 20px;
  color: black;
  font-weight: 700;
  margin-right: 10px;
`;

const InfoText = styled.Text`
  font-family: "Spoqa";
  font-size: 20px;
  color: black;
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
        paddingTop: 5,
      }}
    >
      {/* 자기 정보 */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
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
            width: "75%",
            display: "flex",
            borderRadius: 10,
            paddingVertical: 10,
          }}
        >
          <InfoBox>
            <InfoHeader>이름</InfoHeader>
            <InfoText>{data?.me?.name}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoHeader>지역</InfoHeader>
            <InfoText>{data?.me?.region}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoHeader>소속 기관</InfoHeader>
            <InfoText>{data?.me?.community?.communityName}</InfoText>
          </InfoBox>
          <View
            style={{
              width: "80%",
              backgroundColor: colors.lightGray,
              display: "flex",
              alignItems: "center",
              borderRadius: 5,
              padding: 2,
            }}
          >
            <Text
              style={{ fontFamily: "Spoqa", fontWeight: "700", fontSize: 20 }}
            >
              " {data?.me?.bio} "
            </Text>
          </View>
        </View>
      </View>
      {/* 경계 */}
      <View
        style={{
          width: "100%",
          height: 10,
          backgroundColor: colors.lightGray,
          marginTop: 5,
        }}
      ></View>
    </View>
  );
}
