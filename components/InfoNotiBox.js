import { gql, useQuery } from "@apollo/client";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../colors";
import { ME_FRAGMENT } from "../fragments";
import SmallBtn from "./SmallBtn";

const SEE_PROFILE_QUERY = gql`
  query seeProfile($id: Int!) {
    seeProfile(id: $id) {
      ...MeFragment
    }
  }
  ${ME_FRAGMENT}
`;

const Me_QUERY = gql`
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
  const navigation = useNavigation();
  const screenFocus = useIsFocused();
  const { data, refetch } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      id: parseInt(userId),
    },
  });
  const { data: meData } = useQuery(Me_QUERY);
  const meCheck = userId === meData?.me?.id;
  const [click, setClick] = useState(false);
  const routename = useRoute().name;

  useEffect(() => {
    refetch();
  }, [screenFocus]);

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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: routename === "나" ? 20 : 0,
      }}
    >
      {/* 자기 정보 */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingHorizontal: 15,
        }}
      >
        {/* 로그인 유저 사진 */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ImageZoomIn", {
              infoPhoto: data?.seeProfile?.avatar,
            })
          }
          style={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
        </TouchableOpacity>
        {/* 정보창 */}
        <View
          style={{
            width: "55%",
            display: "flex",
            borderRadius: 10,
            paddingBottom: 10,
            justifyContent: "flex-start",
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
              display: "flex",
              alignItems: "center",
              borderRadius: 5,
              padding: 2,
              marginTop: 7,
            }}
          >
            {data?.seeProfile?.bio ? (
              <Text
                style={{ fontFamily: "Spoqa", fontWeight: "700", fontSize: 20 }}
              >
                " {data?.seeProfile?.bio} "
              </Text>
            ) : null}
          </View>
        </View>
        {/* 수정 버튼 */}
        {meCheck ? (
          <TouchableOpacity
            style={{
              width: "25%",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <SmallBtn
              text={"수정"}
              pressFunction={() => navigation.navigate("EditProfile")}
            />
          </TouchableOpacity>
        ) : null}
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
