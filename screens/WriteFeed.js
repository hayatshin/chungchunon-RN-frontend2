import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { View, Dimensions, TextInput, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../colors";
import SmallBtn from "../components/SmallBtn";

const ME_QUERY = gql`
  query me {
    me {
      avatar
    }
  }
`;

export default function WriteFeed({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const pressFunction = () => navigation.navigate("Comment");
        return (
          <SmallBtn
            pressFunction={pressFunction}
            text={"확인"}
            color={"main"}
          />
        );
      },
    });
  }, [navigation]);
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const { data } = useQuery(ME_QUERY);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        width: windowWidth,
        height: windowHeight,
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {/* 분홍 박스 */}
      <View
        style={{
          marginTop: 20,
          width: windowWidth * 0.9,
          height: windowHeight * 0.8,
          marginBottom: 20,
          backgroundColor: colors.lightMain,
          borderRadius: 20,
          borderWidth: 4,
          borderColor: colors.gray,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: 35,
          paddingHorizontal: 25,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Image
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 3,
              borderColor: colors.lightGray,
            }}
            source={{ uri: data?.me?.avatar }}
          />
          {/* 사진 올리기 버튼 */}
          <SmallBtn
            text={"사진 올리기"}
            color={"black"}
            pressFunction={() => navigation.navigate("UploadNav")}
          />
        </View>

        {/* 글쓰기 창 */}
        <TextInput
          placeholder="글쓰기..."
          placeholderTextColor={colors.lightGray}
          style={{
            width: "100%",
            height: "73%",
            backgroundColor: "white",
            borderRadius: 20,
            borderWidth: 4,
            borderColor: colors.lightGray,
            padding: 30,
            fontSize: 25,
            fontFamily: "Spoqa",
            textAlignVertical: "top",
            marginBottom: 50,
          }}
          multiline={true}
        ></TextInput>
      </View>
    </KeyboardAwareScrollView>
  );
}
