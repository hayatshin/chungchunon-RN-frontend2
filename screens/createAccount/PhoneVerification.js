import React, { useEffect, useRef, useState } from "react";
import {
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../colors";
import Layout from "../../components/Layout";
import styled from "styled-components/native";
import ConfirmBtn from "../../components/ConfirmBtn";
import { TWILLIO_BASE_URL } from "@env";

const PRACTICE_BASE_URL = "http://172.30.1.18:4000";

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
    props.disableConfirm ? colors.lightGray : colors.lightMain};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnimatedVeriMessage = Animated.createAnimatedComponent(VeriMessage);

export default function PhoneVerification({ navigation, route }) {
  const windowWidth = Dimensions.get("window").width;

  const [veriBox, setVeriBox] = useState(false);
  const [phoneInserted, setPhoneInserted] = useState(false);
  const [phone, setphone] = useState("");
  const [verfication, setverfication] = useState("");
  const [waitMessage, setwaitMessage] = useState(false);
  const [checkedNumber, setcheckedNumber] = useState("");
  const [retry, setretry] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [verimessage, setVerimessage] = useState("");

  const reset = () => {
    setPhoneInserted(false);
    setphone("");
    setverfication("");
    setwaitMessage(false);
    setcheckedNumber("");
  };

  const retryCode = () => {
    setverfication("");
  };

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
    setphone(x);
  };

  const sendCode = async () => {
    setPhoneInserted(true);
    setwaitMessage(true);

    goDownY.start();
    setVeriBox(true);
    setVerimessage("휴대전화번호가 인증되었습니다.");
    setDisableConfirm(false);
    // send verfication code to phone number
    // await fetch(`${PRACTICE_BASE_URL}/verify/${phone}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status === "pending") {
    //       setcheckedNumber(phone);
    //       setwaitMessage(false);
    //     }
    //   })
    //   .catch((err) => {
    //     setPhoneInserted(false);
    //     setwaitMessage(false);
    //     setphone("");
    //     console.log(err);
    //     setDisableConfirm(true);
    //     goDownY.start();
    //     setVeriBox(true);
    //     setVerimessage("잘못된 휴대전화번호입니다.");
    //     reset();
    //     setretry(true);
    //   });
  };

  // const verifyCode = () => {
  //   // Now check if the verfication inserted was the same as
  //   // the one sent
  //   try {
  //     fetch(`${PRACTICE_BASE_URL}/check/${checkedNumber}/${verfication}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.status === "approved") {
  //           goDownY.start();
  //           setVeriBox(true);
  //           setVerimessage("휴대전화번호가 인증되었습니다.");
  //           setDisableConfirm(false);
  //           // Navigate to another page  once phone is verfied
  //         } else {
  //           // Handle other error cases like network connection problems
  //           setDisableConfirm(true);
  //           goDownY.start();
  //           setVeriBox(true);
  //           setVerimessage("휴대전화번호 인증에 실패했습니다.");
  //           reset();
  //           setretry(true);
  //         }
  //       });
  //   } catch {
  //     setDisableConfirm(true);
  //     goDownY.start();
  //     setVerimessage("휴대전화번호 인증에 실패했습니다.");
  //     reset();
  //     setretry(true);
  //   }
  // };

  // 인증 메세지 애니메이션
  const animateY = useRef(new Animated.Value(-30)).current;
  const goDownY = Animated.spring(animateY, {
    toValue: 0,
    duration: 20000,
    bounciness: 10,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  const opacityToOne = animateY.interpolate({
    inputRange: [-30, 0],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // 확인 버튼
  const onConfirmBtn = () => {
    setVerimessage("");
    reset();
    setretry(true);
    navigation.navigate("PersonalInfo", {
      birth: route.params.birth,
      gender: route.params.gender,
      age: route.params.age,
      phone,
    });
    setDisableConfirm(true);
    setVeriBox(false);
  };
  return (
    <Layout>
      {/* 휴대전화번호 */}
      <InputHeader windowWidth={windowWidth}>휴대전화번호</InputHeader>
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
          value={phone}
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
          onPress={sendCode}
          disabled={phone.length === 13 ? false : true}
          style={{
            width: "30%",
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              phone.length === 13 ? colors.mainColor : colors.gray,
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
          placeholder="전송된 인증번호를 입력해주세요."
          placeholderTextColor={colors.gray}
          onChangeText={setverfication}
          value={verfication}
          keyboardType={"numeric"}
          maxLength={6}
          style={{
            height: 50,
            width: "70%",
            textAlign: "center",
            fontSize: 16,
            fontFamily: "Spoqa",
          }}
        ></TextInput>
        <TouchableOpacity
          // onPress={verifyCode}
          disabled={verfication.length === 6 ? false : true}
          style={{
            width: "30%",
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              verfication.length === 6 ? colors.mainColor : colors.gray,
          }}
        >
          {waitMessage ? (
            <ActivityIndicator
              fontSize={20}
              color={colors.lightMain}
            ></ActivityIndicator>
          ) : (
            <Text
              style={{
                fontFamily: "Spoqa",
                color: "white",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              인증번호 확인
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {/* 인증 확인 메세지 */}
      <AnimatedVeriMessage
        windowWidth={windowWidth}
        style={{
          transform: [{ translateY: animateY }],
          opacity: opacityToOne,
        }}
        disableConfirm={disableConfirm}
        veriBox={veriBox}
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

      {/* 확인 버튼 */}
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
