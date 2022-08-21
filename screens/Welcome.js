import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import { colors } from "../colors";
import ConfirmBtn from "../components/ConfirmBtn";
import Layout from "../components/Layout";
import KakaoSDK from "@actbase/react-kakaosdk";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { ReactNativeFile } from "apollo-upload-client";

const LOGIN_MUATION = gql`
  mutation Login($kakaoId: String!) {
    login(kakaoId: $kakaoId) {
      ok
      error
      token
    }
  }
`;

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
  const [loading, setLoading] = useState(false);

  const [loginMutation, { data: loginData }] = useMutation(LOGIN_MUATION);

  const login = async () => {
    setLoading(true);
    try {
      await KakaoSDK.init("7b75ed8572cde8b500be41d8bbf28296");
      await KakaoSDK.login();
      const profile = await KakaoSDK.getProfile();
      const kakaoId = profile.id.toString();
      await loginMutation({
        variables: {
          kakaoId,
        },
        update: (_, result) => {
          const {
            data: {
              login: { ok, token },
            },
          } = result;
          if (ok) {
            logUserIn(token);
          } else {
            const genderModified =
              profile.kakao_account.gender === "MALE" ? "남성" : "여성";
            let today = new Date();
            const cellphoneModified =
              0 + profile.kakao_account.phone_number.substring(4, 16);
            const ageModified = String(
              today.getFullYear() -
                parseInt(profile.kakao_account.birthyear) +
                1
            );
            const avatarModified = new ReactNativeFile({
              uri: profile.properties.profile_image,
              name: `1.jpg`,
              type: "image/jpeg",
            });
            navigation.navigate("PersonalInfo", {
              kakaoId,
              birthyear: profile.kakao_account.birthyear,
              birthday: profile.kakao_account.birthday,
              gender: genderModified,
              cellphone: cellphoneModified,
              name: profile.properties.nickname,
              avatar: avatarModified,
              age: ageModified,
            });
          }
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

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

        <View style={{ height: 30 }} />
        <Text
          style={{
            fontFamily: "Spoqa",
            fontSize: 18,
            marginBottom: 10,
            color: "gray",
            fontWeight: "700",
          }}
        >
          카카오톡으로 빠르게
        </Text>
        <Text
          style={{
            fontFamily: "Spoqa",
            fontSize: 18,
            marginBottom: 40,
            color: "gray",
            fontWeight: "700",
          }}
        >
          회원가입 또는 로그인하세요.
        </Text>

        {/* 카카오톡 로그인 */}
        {loading ? (
          <ActivityIndicator color={colors.mainColor} size={30} />
        ) : (
          <TouchableOpacity onPress={login}>
            <KakaoLogin
              source={require("../assets/images/kakao_login.png")}
              resizeMode="stretch"
              windowWidth={windowWidth}
            />
          </TouchableOpacity>
        )}
      </View>
    </Layout>
  );
}
