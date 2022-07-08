import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoggedInTabsNav from "./LoggedInTabsNav";
import WriteFeed from "../screens/WriteFeed";
import { colors } from "../colors";
import Comment from "../screens/Comment";
import UploadNav from "./UploadNav";

const Stack = createNativeStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        presentation: "transparentModal",
        cardStyle: {
          backgroundColor: "transparent",
          opacity: 0.3,
        },
        cardOverlayEnabled: true,
        cardOverlay: true,
      }}
    >
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false }}
        component={LoggedInTabsNav}
      />
      <Stack.Screen
        name="UploadNav"
        options={{ headerShown: false }}
        component={UploadNav}
      />
      <Stack.Screen
        name="WriteFeed"
        options={{
          title: "",
          headerShadowVisible: false,
          headerTintColor: colors.mainColor,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        component={WriteFeed}
      />
      <Stack.Screen
        name="Comment"
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
          headerTintColor: colors.lightMain,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        component={Comment}
      />
    </Stack.Navigator>
  );
}
