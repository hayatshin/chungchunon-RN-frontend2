import React, { useCallback, useState } from "react";
import {
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { colors } from "../../colors";
import Layout from "../../components/Layout";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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

export default function BirthGender({ navigation }) {
  const windowWidth = Dimensions.get("window").width;
  return (
    <Layout>
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
          maxLength={6}
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
      <View style={{ height: 60 }} />
      <TouchableOpacity
        onPress={() => navigation.navigate("PhoneVerification")}
      >
        <ConfirmBtn text={"확인"} />
      </TouchableOpacity>
    </Layout>
  );
}
