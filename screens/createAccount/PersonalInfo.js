import React, { useCallback, useState } from "react";
import {
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { colors } from "../../colors";
import Layout from "../../components/Layout";
import styled from "styled-components/native";
import DropDownPicker from "react-native-dropdown-picker";
import ConfirmBtn from "../../components/ConfirmBtn";

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

export default function CreateAccount({ navigation, route }) {
  console.log(route);
  const windowWidth = Dimensions.get("window").width;
  const [disable, setDisable] = useState(true);

  const onConfirmBtn = () => {
    setDisable(false);
  };
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

  return (
    <Layout>
      <View style={{ height: 20 }} />
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
      <View style={{ height: 100 }} />
      {/* 확인 버튼 */}
      <TouchableOpacity onPress={onConfirmBtn} disabled={disable}>
        <ConfirmBtn text={"확인"} disable={disable} />
      </TouchableOpacity>
      <View style={{ height: 60 }} />
    </Layout>
  );
}
