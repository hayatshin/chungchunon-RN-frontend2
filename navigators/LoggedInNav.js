import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoggedInTabsNav from "./LoggedInTabsNav";
import WriteFeed from "../screens/WriteFeed";
import { colors } from "../colors";
import Comment from "../screens/Comment";
import UploadNav from "./UploadNav";
import EditFeed from "../screens/EditFeed";
import LikeInfo from "../screens/LikeInfo";
import FriendFeed from "../screens/FriendFeed";
import WritePoem from "../screens/WritePoem";
import UploadPoem from "../screens/UploadPoem";
import EditPoem from "../screens/EditPoem";

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
      <Stack.Screen
        name="EditFeed"
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: colors.mainColor,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        component={EditFeed}
      />
      <Stack.Screen
        name="LikeInfo"
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: colors.mainColor,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        component={LikeInfo}
      />
      <Stack.Screen
        name="FriendFeed"
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: colors.mainColor,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        component={FriendFeed}
      />
      <Stack.Screen
        name="WritePoem"
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: colors.mainColor,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        component={WritePoem}
      />
      <Stack.Screen
        name="UploadPoem"
        options={{
          title: "미리보기",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: colors.mainColor,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        component={UploadPoem}
      />
      <Stack.Screen
        name="EditPoem"
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: colors.mainColor,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        component={EditPoem}
      />
    </Stack.Navigator>
  );
}
