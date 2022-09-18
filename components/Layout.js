import React from "react";
import { View, Keyboard, KeyboardAvoidingView, Pressable } from "react-native";

export default function Layout({ children }) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <Pressable
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      onPress={dismissKeyboard}
    >
      {/* <View style={{ flex: 1, backgroundColor: "white" }}> */}
      <KeyboardAvoidingView
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        {children}
      </KeyboardAvoidingView>
      {/* </View> */}
    </Pressable>
  );
}
