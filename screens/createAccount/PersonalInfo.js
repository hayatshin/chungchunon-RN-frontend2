import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../colors";
import styled from "styled-components/native";
import DropDownPicker from "react-native-dropdown-picker";
import ConfirmBtn from "../../components/ConfirmBtn";
import { openRegionList } from "../../openRegionList";
import { gql, useMutation, useQuery } from "@apollo/client";
import Layout from "../../components/Layout";
import { logUserIn } from "../../apollo";

const CREATE_ACCOUNT_MUATION = gql`
  mutation createAccount(
    $kakaoId: String!
    $birthyear: String!
    $birthday: String!
    $gender: String!
    $cellphone: String!
    $name: String!
    $avatar: Upload
    $age: String!
    $region: String!
    $community: String!
    $bio: String!
  ) {
    createAccount(
      kakaoId: $kakaoId
      birthyear: $birthyear
      birthday: $birthday
      gender: $gender
      cellphone: $cellphone
      name: $name
      avatar: $avatar
      age: $age
      region: $region
      community: $community
      bio: $bio
    ) {
      ok
      error
    }
  }
`;

const LOGIN_MUATION = gql`
  mutation Login($kakaoId: String!) {
    login(kakaoId: $kakaoId) {
      ok
      error
      token
    }
  }
`;

const SEE_ALL_COMMUNITIES_QUERY = gql`
  query seeAllCommunities {
    seeAllCommunities {
      communityName
    }
  }
`;

const InputHeader = styled.Text`
  width: ${(props) => props.windowWidth * 0.8}px;
  display: flex;
  justify-content: flex-start;
  font-family: "Spoqa";
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const GeneralInput = styled.TextInput`
  display: flex;
  flex-direction: row;
  width: ${(props) => props.windowWidth * 0.8}px;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-width: 1px;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Spoqa";
  padding: 0px 20px;
`;

export default function PersonalInfo({ navigation, route }) {
  const windowWidth = Dimensions.get("window").width;
  const [disableConfirm, setDisableConfirm] = useState(true);
  const { data: communityData, loading: communityLoading } = useQuery(
    SEE_ALL_COMMUNITIES_QUERY
  );
  const [loading, setLoading] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [regionValue, setRegionValue] = useState([]);
  const [regionList, setRegionList] = useState(openRegionList);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [communityValue, setCommunityValue] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [confirmloading, setConfirmloading] = useState(false);

  const [createAccountMutation, { data: accountData }] = useMutation(
    CREATE_ACCOUNT_MUATION
  );
  const [loginMutation, { data: loginData }] = useMutation(LOGIN_MUATION);

  useEffect(() => {
    if (communityData !== undefined && communityData !== null) {
      setCommunityList(
        communityData.seeAllCommunities.map((community, index) => {
          return {
            label: community.communityName,
            value: community.communityName,
          };
        })
      );
    }
  }, [communityData]);

  useEffect(() => {
    setLoading(true);
  }, [communityList]);

  const onRegionOpen = useCallback(() => {
    setCommunityOpen(false);
  }, []);
  const onCommunityOopen = useCallback(() => {
    setRegionOpen(false);
  }, []);

  // 소개 함수
  const [bioValue, setBioValue] = useState("");

  // 완료 버튼
  useEffect(() => {
    if (regionValue && communityValue && bioValue) {
      setDisableConfirm(false);
    }
  }, [regionValue, communityValue, bioValue]);

  // mutation

  const fillOutBtn = () => {
    setConfirmloading(true);
    createAccountMutation({
      variables: {
        kakaoId: route.params.kakaoId,
        birthyear: route.params.birthyear,
        birthday: route.params.birthday,
        gender: route.params.gender,
        cellphone: route.params.cellphone,
        name: route.params.name,
        avatar: route.params.avatar,
        age: route.params.age,
        region: regionValue,
        community: communityValue,
        bio: bioValue,
      },
      onCompleted: () => {
        loginMutation({
          variables: {
            kakaoId: route.params.kakaoId,
          },
          update: (_, result) => {
            const {
              data: {
                login: { ok, token },
              },
            } = result;
            if (ok) {
              logUserIn(token);
            }
          },
        });
      },
    });
  };

  return (
    <Layout>
      {!loading ? (
        <ActivityIndicator
          size={30}
          color={colors.mainColor}
        ></ActivityIndicator>
      ) : (
        <>
          <InputHeader windowWidth={windowWidth}>지역</InputHeader>
          <DropDownPicker
            searchable={true}
            searchPlaceholder="지역 이름을 검색해주세요."
            listMode="MODAL"
            open={regionOpen}
            onOpen={onRegionOpen}
            value={regionValue}
            setOpen={setRegionOpen}
            setValue={setRegionValue}
            setItems={setRegionList}
            items={regionList}
            zIndex={3000}
            zIndexInverse={1000}
            placeholder="거주 지역 이름을 검색해주세요."
            containerStyle={{
              width: windowWidth * 0.8,
              marginBottom: 60,
            }}
            textStyle={{
              fontSize: 16,
            }}
            placeholderStyle={{
              color: colors.gray,
              fontSize: 16,
            }}
            labelStyle={{
              fontWeight: "600",
              borderColor: colors.gray,
            }}
          />
          {/* 소속 기관 */}
          <InputHeader windowWidth={windowWidth}>소속 기관</InputHeader>
          <DropDownPicker
            searchable={true}
            searchPlaceholder="소속 기관 이름을 검색해주세요."
            listMode="MODAL"
            open={communityOpen}
            onOpen={onCommunityOopen}
            value={communityValue}
            setOpen={setCommunityOpen}
            setValue={setCommunityValue}
            setItems={setCommunityList}
            items={communityList}
            zIndex={2000}
            zIndexInverse={2000}
            placeholder="소속 기관 이름을 검색해주세요."
            containerStyle={{
              width: windowWidth * 0.8,
              marginBottom: 60,
            }}
            textStyle={{
              fontSize: 16,
            }}
            placeholderStyle={{
              color: colors.gray,
              fontSize: 16,
            }}
            labelStyle={{
              fontWeight: "600",
              borderColor: colors.gray,
            }}
          />
          {/* 소개 문구 */}
          <InputHeader windowWidth={windowWidth}>소개</InputHeader>
          <GeneralInput
            maxLength={15}
            onChangeText={(text) => setBioValue(text)}
            placeholder="15자 이내 소개 문구를 적어주세요."
            placeholderTextColor={colors.gray}
            windowWidth={windowWidth}
          />
          <View style={{ height: 60 }} />
          {confirmloading ? (
            <ActivityIndicator color={colors.mainColor} size={30} />
          ) : (
            <TouchableOpacity disabled={disableConfirm} onPress={fillOutBtn}>
              <ConfirmBtn text={"회원가입 완료"} disable={disableConfirm} />
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </>
      )}
    </Layout>
  );
}
