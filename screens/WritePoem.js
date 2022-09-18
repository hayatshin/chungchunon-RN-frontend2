import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { View, Dimensions, TextInput, Image, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../colors";
import SmallBtn from "../components/SmallBtn";

export default function WritePoem({ navigation }) {
  const [caption, setCaption] = useState("");
  const [captionClick, setCaptionClick] = useState(false);
  const [title, setTitle] = useState("");
  const [titleClick, setTitleClick] = useState(false);
  const [showNoti, setShowNoti] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const pressFunction = () => {
          if (title === "" || caption === "") {
            setShowNoti(true);
          } else {
            navigation.navigate("UploadPoem", { title, caption });
          }
        };

        if (title !== "" && caption !== "") {
          setShowNoti(false);
        }

        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {showNoti ? (
              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  fontWeight: "700",
                  marginRight: 16,
                  textDecorationLine: "underline",
                }}
              >
                제목과 시 작성 후 클릭해주세요! 👉
              </Text>
            ) : null}
            <SmallBtn
              pressFunction={pressFunction}
              text={"확인"}
              color={"main"}
            />
          </View>
        );
      },
    });
  }, [navigation, title, caption, showNoti]);

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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 제목 쓰기 창 */}
        <TextInput
          onFocus={() => setTitleClick(true)}
          onBlur={() => setTitleClick(false)}
          onChangeText={(text) => setTitle(text)}
          onSubmitEditing={(text) => setTitle(text)}
          style={{
            marginTop: 10,
            // height: 80,
            flex: 1,
            width: "85%",
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 2,
            borderColor: titleClick ? colors.mainColor : colors.lightGray,
            paddingHorizontal: 30,
            fontSize: 25,
            fontFamily: "Spoqa",
            marginBottom: 50,
          }}
          placeholder="제목 쓰기"
          placeholderTextColor={colors.lightGray}
        />

        {/* 시 쓰기 창 */}
        <TextInput
          onFocus={() => setCaptionClick(true)}
          onBlur={() => setCaptionClick(false)}
          onChangeText={(text) => setCaption(text)}
          onSubmitEditing={(text) => setCaption(text)}
          placeholder="시 쓰기"
          placeholderTextColor={colors.lightGray}
          style={{
            // height: 500,
            flex: 8,
            width: "85%",
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 2,
            borderColor: captionClick ? colors.mainColor : colors.lightGray,
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
