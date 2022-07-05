import React from "react";
import { View, TouchableOpacity, Dimensions, Text } from "react-native";
import styled from "styled-components/native";
import { colors } from "../colors";
import ConfirmBtn from "../components/ConfirmBtn";
import Layout from "../components/Layout";

const Logo = styled.Image`
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
`;

const LogoFont = styled.Text`
  font-size: 50px;
  font-family: "Spoqa";
  color: ${colors.mainColor};
  font-weight: 700;
  margin-bottom: 50px;
`;

const KakaoLogin = styled.Image`
  width: ${(props) => props.windowWidth * 0.8}px;
  height: 50px;
`;

export default function Welcome({ navigation }) {
  const windowWidth = Dimensions.get("window").width;
  return (
    <Layout>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 로고 */}
        <Logo source={require("../assets/images/ch-logo.gif")} />
        <LogoFont>청춘온</LogoFont>

        {/* 회원가입 */}
        <TouchableOpacity onPress={() => navigation.navigate("BirthGender")}>
          <ConfirmBtn text={"회원가입"} />
        </TouchableOpacity>

        <View style={{ height: 15 }} />

        {/* 로그인 */}
        <TouchableOpacity>
          <ConfirmBtn text={"로그인"} />
        </TouchableOpacity>

        <View style={{ height: 60 }} />
        <Text
          style={{
            fontFamily: "Spoqa",
            fontSize: 18,
            marginBottom: 20,
            color: "gray",
            fontWeight: "700",
          }}
        >
          카카오톡으로 빠르게 로그인 하세요.
        </Text>

        {/* 카카오톡 로그인 */}
        <TouchableOpacity>
          <KakaoLogin
            source={require("../assets/images/kakao_login.png")}
            resizeMode="stretch"
            windowWidth={windowWidth}
          />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
