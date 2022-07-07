import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoggedInTabsNav from "./LoggedInTabsNav";
import WriteFeed from "../screens/WriteFeed";
import { colors } from "../colors";
import Comment from "../screens/Comment";

const Stack = createNativeStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false }}
        component={LoggedInTabsNav}
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
          headerTintColor: colors.mainColor,
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
