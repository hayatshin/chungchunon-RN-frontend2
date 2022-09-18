import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { colors } from "../colors";
import styled from "styled-components/native";
import DropDownPicker from "react-native-dropdown-picker";
import ConfirmBtn from "../components/ConfirmBtn";
import { openRegionList } from "../openRegionList";
import * as ImagePicker from "expo-image-picker";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import { ME_FRAGMENT } from "../fragments";

const ME_QUERY = gql`
  query me {
    me {
      ...MeFragment
    }
  }
  ${ME_FRAGMENT}
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $birthday: String
    $gender: String
    $cellphone: String
    $name: String
    $avatar: Upload
    $bio: String
    $region: String
    $community: String
  ) {
    editProfile(
      birthday: $birthday
      gender: $gender
      cellphone: $cellphone
      name: $name
      avatar: $avatar
      bio: $bio
      region: $region
      community: $community
    ) {
      ok
      error
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

const SEE_ALL_COMMUNITIES_QUERY = gql`
  query seeAllCommunities {
    seeAllCommunities {
      communityName
    }
  }
`;

export default function EditProfile({ navigation, route }) {
  const windowWidth = Dimensions.get("window").width;
  const [disableConfirm, setDisableConfirm] = useState(true);
  const { data: meData } = useQuery(ME_QUERY);
  const { data: communityData, loading: communityLoading } = useQuery(
    SEE_ALL_COMMUNITIES_QUERY
  );

  const [loading, setLoading] = useState(false);
  const [nameValue, setNameValue] = useState(meData?.me?.name);
  const [regionOpen, setRegionOpen] = useState(false);
  const [regionValue, setRegionValue] = useState(meData?.me?.region);
  const [regionList, setRegionList] = useState(openRegionList);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [communityValue, setCommunityValue] = useState(
    meData?.me?.community.communityName
  );
  const [communityList, setCommunityList] = useState([]);

  useEffect(() => {
    const communityNameList = communityData?.seeAllCommunities.map(
      (community, index) => {
        return {
          label: community.communityName,
          value: community.communityName,
        };
      }
    );
    if (!communityLoading) {
      setCommunityList(communityNameList);
    }
  }, [communityLoading]);

  const onRegionOpen = useCallback(() => {
    setCommunityOpen(false);
  }, []);
  const onCommunityOopen = useCallback(() => {
    setRegionOpen(false);
  }, []);

  // 이미지 업로드 합수
  const [avatarValue, setAvatarValue] = useState(meData?.me?.avatar);

  const handleUploadAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      saveToPhotos: true,
    });
    if (!result.cancelled) {
      // 이미지 보여주기
      setAvatarValue(result.uri);
    }
  };

  // 소개 함수
  const [bioValue, setBioValue] = useState(meData?.me?.bio);

  // 완료 버튼
  useEffect(() => {
    if (
      nameValue !== meData?.me?.name ||
      regionValue !== meData?.me?.region ||
      communityValue !== meData?.me?.community.communityName ||
      avatarValue !== meData?.me?.avatar ||
      bioValue !== meData?.me?.bio
    ) {
      setDisableConfirm(false);
    }
  }, [nameValue, regionValue, communityValue, avatarValue, bioValue]);

  // mutation

  const editComplete = (data) => {
    if (data?.editProfile?.ok) {
      navigation.goBack();
    }
  };

  const [editProfileMutation, { data: profileData }] = useMutation(
    EDIT_PROFILE_MUTATION,
    {
      onCompleted: editComplete,
    }
  );
  const fillOutBtn = () => {
    setLoading(true);
    const avatarModified = new ReactNativeFile({
      uri: avatarValue,
      name: `1.jpg`,
      type: "image/jpeg",
    });

    editProfileMutation({
      variables: {
        name: nameValue,
        avatar: avatarModified,
        bio: bioValue,
        region: regionValue,
        community: communityValue,
      },
    });
  };

  return communityList === [] ? (
    <ActivityIndicator size={30} color={colors.mainColor}></ActivityIndicator>
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          <View style={{ height: 20 }} />
          {/* 이름 */}
          <InputHeader windowWidth={windowWidth}>이름</InputHeader>
          <GeneralInput
            defaultValue={meData?.me?.name}
            onChangeText={(text) => setNameValue(text)}
            placeholder="이름을 입력해주세요."
            placeholderTextColor={colors.gray}
            windowWidth={windowWidth}
          />
          {/* 지역 */}
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
              marginBottom: 40,
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
              marginBottom: 40,
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
          {/* 사진 */}
          <InputHeader windowWidth={windowWidth}>사진</InputHeader>
          <View
            style={{
              width: windowWidth * 0.8,
              height: windowWidth * 0.2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <Image
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                marginRight: 30,
                borderWidth: 2,
                borderColor: colors.gray,
              }}
              source={{ uri: avatarValue }}
            />
            <TouchableOpacity
              onPress={handleUploadAvatar}
              style={{
                width: 100,
                height: 35,
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                borderWidth: 2,
                borderColor: colors.gray,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Spoqa",
                  fontWeight: "700",
                  color: colors.gray,
                }}
              >
                사진 올리기
              </Text>
            </TouchableOpacity>
          </View>
          {/* 소개 문구 */}
          <InputHeader windowWidth={windowWidth}>소개</InputHeader>
          <GeneralInput
            defaultValue={meData?.me?.bio}
            maxLength={60}
            onChangeText={(text) => setBioValue(text)}
            placeholder="60자 이내 소개 문구를 적어주세요."
            placeholderTextColor={colors.gray}
            windowWidth={windowWidth}
          />
          <View style={{ height: 20 }} />
        </>
      </ScrollView>

      {/* 확인 버튼 */}
      <View style={{ height: 20 }} />

      <TouchableOpacity disabled={disableConfirm} onPress={fillOutBtn}>
        {loading ? (
          <ActivityIndicator color={colors.mainColor} size={30} />
        ) : (
          <ConfirmBtn text={"프로필 수정 완료"} disable={disableConfirm} />
        )}
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </SafeAreaView>
  );
}
