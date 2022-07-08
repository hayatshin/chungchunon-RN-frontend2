import React from "react";
import { View, Text } from "react-native";
import Layout from "../components/Layout";

export default function Comment() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white" }}>Comment</Text>
    </View>
  );
}
