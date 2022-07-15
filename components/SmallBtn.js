import React from "react";
import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { colors } from "../colors";

export default function SmallBtn({ color, text, pressFunction, disabled }) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={pressFunction}
      style={{
        paddingVertical: 3,
        paddingHorizontal: 10,
        // backgroundColor: color === "main" ? colors.lightMain : colors.lightGray,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: color === "main" ? colors.mainColor : colors.gray,
      }}
    >
      <Text
        style={{
          fontFamily: "Spoqa",
          fontSize: 20,
          fontWeight: "700",
          color: color === "main" ? colors.mainColor : colors.gray,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
