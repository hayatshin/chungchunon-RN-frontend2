import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../colors";
import { Ionicons } from "@expo/vector-icons";

export default function NextBtn({ text, icon, pressFunction, disabled }) {
  const nextBtn = icon === "arrow-forward";
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        width: "40%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "Spoqa",
          fontSize: 20,
          color: colors.mainColor,
          fontWeight: "700",
        }}
      >
        {text}
      </Text>
      <TouchableOpacity
        onPress={pressFunction}
        disabled={disabled}
        style={{
          width: 40,
          height: 40,
          backgroundColor: "rgba(255, 45, 120, 0.6)",
          borderRadius: nextBtn ? 20 : 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name={icon} color="white" size={30} />
      </TouchableOpacity>
    </View>
  );
}
