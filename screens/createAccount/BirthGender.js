import React, { useEffect, useRef, useState } from "react";
import {
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
} from "react-native";
import { useForm } from "react-hook-form";
import { colors } from "../../colors";
import Layout from "../../components/Layout";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
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

const VeriMessage = styled.View`
  width: ${(props) => props.windowWidth * 0.6}px;
  height: ${(props) => (props.veriBox ? props.windowWidth * 0.2 : 0)}px;
  background-color: ${(props) =>
    props.overfifty ? colors.lightMain : colors.lightGray};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnimatedVeriMessage = Animated.createAnimatedComponent(VeriMessage);

export default function BirthGender({ navigation }) {
  const windowWidth = Dimensions.get("window").width;
  const [overfifty, setOverfifty] = useState(true);
  const [veriBox, setVeriBox] = useState(false);
  const [verimessage, setVerimessage] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [disableConfirm, setDisableConfirm] = useState(true);
  const { register, handleSubmit, setValue, getValues } = useForm();

  const birthRef = useRef();
  const genderRef = useRef();

  // (birth.length === 6 && gender.length === 1)

  const fillOut = (text, type) => {
    if (type === "birth") {
      setBirth(text);
    } else {
      setGender(text);
    }
  };

  useEffect(() => {
    if (birth.toString().length === 6 && gender.toString().length !== 1) {
      setDisableConfirm(true);
      setVeriBox(false);
      genderRef.current.focus();
    } else if (
      birth.toString().length !== 6 &&
      gender.toString().length === 1
    ) {
      setDisableConfirm(true);
      setVeriBox(false);
      birthRef.current.focus();
    } else if (
      birth.toString().length !== 6 &&
      gender.toString().length !== 1
    ) {
      setDisableConfirm(true);
      setVeriBox(false);
    } else {
      if (gender !== 1 && gender !== 2) {
        setVerimessage("1 또는 2를 기입해주세요.");
        goDownY.start();
        setVeriBox(true);
      } else {
        setDisableConfirm(false);
        let today = new Date();
        const age =
          today.getFullYear() -
          parseInt(19 + birth.toString().substring(0, 2)) +
          1;
        setAge(age);
        const checkFifty = age >= 50;
        if (!checkFifty) {
          goDownY.start();
          setVeriBox(true);
          setOverfifty(false);
          setVerimessage("50세 이하 가입자는 글쓰기가 불가능합니다.");
        }
      }
    }
  }, [birth, gender]);

  // 연령 안내 애니메이션
  const animateY = useRef(new Animated.Value(-30)).current;
  const goDownY = Animated.spring(animateY, {
    toValue: 0,
    duration: 20000,
    easing: Easing.linear,
    bounciness: 10,
    useNativeDriver: true,
  });
  const opacityToOne = animateY.interpolate({
    inputRange: [-30, 0],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // 확인 버튼
  const onConfirmBtn = () => {
    navigation.navigate("PhoneVerification", { birth, gender, age });
    setDisableConfirm(true);
    setVeriBox(false);
  };

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
          {...register("birth", {
            required: "주민등록번호 앞 6자리를 입력해주세요.",
          })}
          ref={birthRef}
          onChangeText={(text) => fillOut(parseInt(text), "birth")}
          onSubmitEditing={fillOut}
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
            {...register("gender", {
              required: "주민등록번호 뒤 1자리를 입력해주세요.",
            })}
            ref={genderRef}
            onChangeText={(text) => fillOut(parseInt(text), "gender")}
            onSubmitEditing={fillOut}
            placeholder="2"
            maxLength={1}
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
      {/* 인증 확인 메세지 */}
      <AnimatedVeriMessage
        windowWidth={windowWidth}
        style={{
          transform: [{ translateY: animateY }],
          opacity: opacityToOne,
        }}
        veriBox={veriBox}
        overfifty={overfifty}
      >
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            lineHeight: 30,
            color: colors.gray,
            fontWeight: "700",
          }}
        >
          {verimessage}
        </Text>
      </AnimatedVeriMessage>
      <View style={{ height: 40 }} />
      <TouchableOpacity
        disabled={disableConfirm}
        onPress={onConfirmBtn}
        style={{
          transform: [{ translateY: animateY }],
        }}
      >
        <ConfirmBtn text={"확인"} disable={disableConfirm} />
      </TouchableOpacity>
    </Layout>
  );
}
