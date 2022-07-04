import React, { useCallback, useState } from "react";
import {
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { colors } from "../colors";
import Layout from "../components/Layout";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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

export default function CreateAccount({ navigation }) {
  const windowWidth = Dimensions.get("window").width;
  const [regionOpen, setRegionOpen] = useState(false);
  const [regionValue, setRegionValue] = useState(null);
  const [regionList, setRegionList] = useState([
    { id: 1, label: "강원도 강릉시", value: "강원도 강릉시" },
    { id: 2, label: "강원도 고성군", value: "강원도 고성군" },
  ]);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [communityValue, setCommunityValue] = useState(null);
  const [communityList, setCommunityList] = useState([
    { id: 1, label: "서울의료원", value: "서울의료원" },
    { id: 2, label: "강원도 치매안심센터", value: "강원도 치매안심센터" },
  ]);
  const onRegionOpen = useCallback(() => {
    setCommunityOpen(false);
  }, []);
  const onCommunityOopen = useCallback(() => {
    setRegionOpen(false);
  }, []);
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneNumberFormat = (num) => {
    let newNum = num.replace(/[-]+/g, "");
    let x;
    if (newNum.length <= 3) {
      x = newNum;
    } else if (newNum.length > 3 && newNum.length <= 7) {
      x = newNum.slice(0, 3) + "-" + newNum.slice(3, 7);
    } else {
      x =
        newNum.slice(0, 3) +
        "-" +
        newNum.slice(3, 7) +
        "-" +
        newNum.slice(7, 11);
    }
    setPhoneNumber(x);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView nestedScrollEnabled={true}>
        <Layout>
          <View style={{ height: 20 }} />
          {/* 생년월일 및 성별 */}
          <InputHeader windowWidth={windowWidth}>생년월일 및 성별</InputHeader>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: windowWidth * 0.8,
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            {/* 생년월일 */}
            <TextInput
              placeholder="581101"
              placeholderTextColor={colors.gray}
              keyboardType={"numeric"}
              style={{
                height: 50,
                borderWidth: 1,
                width: "45%",
                borderRadius: 5,
                textAlign: "center",
                fontSize: 20,
                fontFamily: "Spoqa",
              }}
            />
            <Ionicons name="ios-remove-outline" />
            <View
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* 성별 */}
              <TextInput
                placeholder="2"
                placeholderTextColor={colors.gray}
                keyboardType={"numeric"}
                style={{
                  height: 50,
                  borderWidth: 1,
                  borderRadius: 5,
                  textAlign: "center",
                  width: "30%",
                  fontSize: 20,
                  fontFamily: "Spoqa",
                }}
              />
              <Ionicons name="ellipse" />
              <Ionicons name="ellipse" />
              <Ionicons name="ellipse" />
              <Ionicons name="ellipse" />
              <Ionicons name="ellipse" />
              <Ionicons name="ellipse" />
            </View>
          </View>
          {/* 휴대전화 번호 */}
          <InputHeader windowWidth={windowWidth}>휴대전화 번호</InputHeader>
          {/* 휴대전호 번호 입력 */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: windowWidth * 0.8,
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 40,
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <TextInput
              placeholder="휴대전화 번호를 입력해주세요."
              placeholderTextColor={colors.gray}
              onChangeText={(text) => phoneNumberFormat(text)}
              value={phoneNumber}
              keyboardType={"numeric"}
              style={{
                height: 50,
                width: "70%",
                textAlign: "center",
                fontSize: 16,
                fontFamily: "Spoqa",
              }}
            ></TextInput>
            <TouchableOpacity
              style={{
                width: "30%",
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.gray,
              }}
            >
              <Text
                style={{
                  fontFamily: "Spoqa",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                인증번호 받기
              </Text>
            </TouchableOpacity>
          </View>
          {/* 인증번호 */}
          <InputHeader windowWidth={windowWidth}>인증번호</InputHeader>
          <GeneralInput
            placeholder="전송된 인증번호를 입력해주세요."
            placeholderTextColor={colors.gray}
            windowWidth={windowWidth}
            keyboardType={"numeric"}
          />
          <View
            style={{
              width: windowWidth,
              height: 1,
              backgroundColor: colors.gray,
              marginBottom: 40,
            }}
          ></View>
          {/* 이름 */}
          <InputHeader windowWidth={windowWidth}>이름</InputHeader>
          <GeneralInput
            placeholder="이름을 입력해주세요."
            placeholderTextColor={colors.gray}
            windowWidth={windowWidth}
          />
          {/* 지역 */}
          <InputHeader windowWidth={windowWidth}>지역</InputHeader>
          <DropDownPicker
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
            placeholder="강원도 강릉시"
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
            placeholder="서울의료원"
            containerStyle={{
              width: windowWidth * 0.8,
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
          <View style={{ height: 40 }} />
        </Layout>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
