import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../colors";
import { ME_FRAGMENT } from "../fragments";

const SEE_PROFILE_QUERY = gql`
  query seeProfile($id: Int!) {
    seeProfile(id: $id) {
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
  font-size: 17px;
  color: black;
  font-weight: 700;
  margin-right: 10px;
`;

const InfoText = styled.Text`
  font-family: "Spoqa";
  font-size: 17px;
  color: black;
`;

export default function InfoNotiBox({ userId }) {
  const { data } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      id: parseInt(userId),
    },
  });
  const navigation = useNavigation();
  const [click, setClick] = useState(false);
  return click ? (
    <TouchableOpacity
      onPress={() => setClick(false)}
      style={{
        width: "90%",
        height: 40,
        borderWidth: 1,
        borderColor: colors.gray,
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
        borderRadius: 5,
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
        {data?.seeProfile?.name} 님의 정보 보기
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => setClick(true)}
      style={{
        width: "100%",
        height: 150,
        marginBottom: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
        backgroundColor: "white",
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
            source={{ uri: data?.seeProfile?.avatar }}
          />
        </View>
        {/* 정보창 */}
        <View
          style={{
            width: "75%",
            display: "flex",
            borderRadius: 10,
            paddingVertical: 10,
            marginTop: 10,
          }}
        >
          <InfoBox>
            <InfoHeader>이름</InfoHeader>
            <InfoText>{data?.seeProfile?.name}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoHeader>지역</InfoHeader>
            <InfoText>{data?.seeProfile?.region}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoHeader>소속 기관</InfoHeader>
            <InfoText>{data?.seeProfile?.community?.communityName}</InfoText>
          </InfoBox>
          <View
            style={{
              width: "80%",
              // backgroundColor: colors.lightGray,
              display: "flex",
              alignItems: "center",
              borderRadius: 5,
              padding: 2,
              marginTop: 7,
            }}
          >
            <Text
              style={{ fontFamily: "Spoqa", fontWeight: "700", fontSize: 20 }}
            >
              " {data?.seeProfile?.bio} "
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
    </TouchableOpacity>
  );
}
