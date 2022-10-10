import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";
import { gql, useQuery } from "@apollo/client";
import { ME_FRAGMENT } from "../fragments";

const ME_QUERY = gql`
  query me {
    me {
      ...MeFragment
    }
  }
  ${ME_FRAGMENT}
`;

const InfoWrapper = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center
  align-items: flex-end;
`;

const InfoBox = styled.Pressable`
  width: ${(props) => props.windowWidth * 0.75}px;
  height: ${(props) => props.windowHeight}px;
  background-color: white;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  display: flex;
  padding-vertical: 20px;
  padding-horizontal: 10px;
`;

const AnimatedInfoBox = Animated.createAnimatedComponent(InfoBox);

const MeBox = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-vertical: 20px;
  padding-horizontal: 10px;
`;

const MenuBox = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-horizontal: 5px;
  padding-vertical: 10px;
`;

const MenuText = styled.Text`
  margin-left: 20px;
  font-family: "Spoqa";
  font-size: 17px;
`;

export default function Info({ navigation }) {
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const { data: meData } = useQuery(ME_QUERY);
  const animateX = useRef(new Animated.Value(500)).current;

  const showX = Animated.timing(animateX, {
    toValue: 0,
    duration: 400,
    useNativeDriver: true,
  });

  const disappearX = Animated.timing(animateX, {
    toValue: 500,
    duration: 400,
    useNativeDriver: true,
  });

  const goBackFunc = async () => {
    disappearX.start(() => navigation.goBack());
  };

  useEffect(() => {
    showX.start();
  }, []);

  return (
    <InfoWrapper onPress={goBackFunc}>
      <StatusBar backgroundColor={"rgba(0,0, 0, 0.6)"} />
      <AnimatedInfoBox
        onPress={() => {}}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        style={{ transform: [{ translateX: animateX }] }}
      >
        {/* 창 닫기 */}
        <TouchableOpacity onPress={goBackFunc}>
          <Ionicons
            name={"close"}
            style={{ color: colors.mainColor, fontSize: 30 }}
          />
        </TouchableOpacity>
        {/* MeBox */}
        <MeBox onPress={() => navigation.navigate("Me")}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 30 }}
            source={{ uri: meData?.me?.avatar }}
          />
          <View
            style={{ display: "flex", flexDirection: "column", marginLeft: 20 }}
          >
            <Text
              style={{ fontFamily: "Spoqa", fontSize: 20, marginBottom: 4 }}
            >
              {meData?.me?.name}
            </Text>
            <Text
              style={{ fontFamily: "Spoqa", fontSize: 18, color: colors.gray }}
            >
              {meData?.me?.bio}
            </Text>
          </View>
        </MeBox>
        {/* 경계선 */}
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: colors.lightGray,
            marginBottom: 30,
          }}
        />
        <MenuBox onPress={() => navigation.navigate("UseRule")}>
          <Ionicons name={"chevron-back"} style={{ fontSize: 18 }} />
          <MenuText>이용약관</MenuText>
        </MenuBox>
        <MenuBox onPress={() => navigation.navigate("PersonalInfoRule")}>
          <Ionicons name={"chevron-back"} style={{ fontSize: 18 }} />
          <MenuText>개인정보 처리방침</MenuText>
        </MenuBox>
      </AnimatedInfoBox>
    </InfoWrapper>
  );
}
