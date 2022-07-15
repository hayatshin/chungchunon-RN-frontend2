import React from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Dimensions, Pressable } from "react-native";
import { colors } from "../colors";
import { useNavigation } from "@react-navigation/native";

export default function ImageSwiper({ photosArray }) {
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const navigation = useNavigation();

  const renderPrevButton = () => {
    return (
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "rgba(255, 45, 120, 0.6)",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="md-arrow-back" color="white" size={30} />
      </View>
    );
  };
  const renderNextButton = () => {
    return (
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "rgba(255, 45, 120, 0.6)",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="arrow-forward" color="white" size={30} />
      </View>
    );
  };
  const renderDoneButton = () => {
    return (
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "rgba(255, 45, 120, 0.6)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="md-checkmark" color="white" size={30} />
      </View>
    );
  };
  return (
    <AppIntroSlider
      key={(item) => item}
      data={photosArray}
      showPrevButton={true}
      renderPrevButton={renderPrevButton}
      renderDoneButton={renderDoneButton}
      renderNextButton={renderNextButton}
      renderItem={({ item }) => {
        return (
          <Pressable
            onPress={() => navigation.navigate("ImageZoomIn", { photosArray })}
            style={{
              width: windowWidth,
              height: windowWidth,
              backgroundColor: colors.lightGray,
            }}
          >
            <Image
              style={{
                flex: 1,
              }}
              source={{ uri: item }}
            />
          </Pressable>
        );
      }}
    />
  );
}
