import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { View, Dimensions, TextInput, Image, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../colors";
import SmallBtn from "../components/SmallBtn";

export default function WriteFeed({ navigation }) {
  const [caption, setCaption] = useState("");
  const [inputClick, setInputClick] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const pressFunction = () =>
          navigation.navigate("UploadNav", {
            screen: "UploadForm",
            params: { caption },
          });
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {caption === "" ? (
              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  fontWeight: "700",
                  marginRight: 16,
                  textDecorationLine: "underline",
                }}
              >
                글을 작성해야 업로드가 가능해요! 👉
              </Text>
            ) : null}
            <SmallBtn
              pressFunction={pressFunction}
              text={"확인"}
              color={"main"}
              disabled={caption === "" ? true : false}
            />
          </View>
        );
      },
    });
  }, [navigation, caption]);
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
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
      <View
        style={{
          width: windowWidth,
          height: windowHeight * 0.9,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* 소개 */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "85%",
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
            marginBottom: 30,
          }}
        >
          {/* 사진 올리기 버튼 */}
          <SmallBtn
            text={"사진 올리기"}
            color={"black"}
            disabled={caption === "" ? true : false}
            pressFunction={() =>
              navigation.navigate("UploadNav", {
                screen: "SelectPhoto",
                params: { caption },
              })
            }
          />
        </View>

        {/* 글쓰기 창 */}
        <TextInput
          onFocus={() => setInputClick(true)}
          onBlur={() => setInputClick(false)}
          onChangeText={(text) => setCaption(text)}
          onSubmitEditing={(text) => setCaption(text)}
          placeholder="글쓰기..."
          placeholderTextColor={colors.lightGray}
          style={{
            flex: 4,
            width: "85%",
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 2,
            borderColor: inputClick ? colors.mainColor : colors.lightGray,
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
