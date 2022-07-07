import React from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Dimensions } from "react-native";
import { colors } from "../colors";

export default function ImageSwiper({ photosArray }) {
  const { width: windowWidth } = Dimensions.get("window");

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
      data={photosArray}
      showPrevButton={true}
      renderPrevButton={renderPrevButton}
      renderDoneButton={renderDoneButton}
      renderNextButton={renderNextButton}
      renderItem={({ item }) => {
        return (
          <View
            style={{
              width: windowWidth,
              height: windowWidth * 0.7,
            }}
          >
            <Image
              style={{
                flex: 1,
              }}
              source={{ uri: item }}
              resizeMode="contain"
            />
          </View>
        );
      }}
    />
  );
}
