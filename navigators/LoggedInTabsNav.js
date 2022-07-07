import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "../screens/Feed";
import { colors } from "../colors";
import Rank from "../screens/Rank";
import Friend from "../screens/Friend";
import Me from "../screens/Me";

const Tabs = createBottomTabNavigator();

export default function LoggedInTabsNav() {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarIconStyle: { display: "none" },
        headerShown: false,
        tabBarActiveTintColor: `${colors.mainColor}`,
        tabBarInactiveTintColor: `${colors.gray}`,
        tabBarStyle: {
          backgroundColor: "white",
          height: 60,
          paddingBottom: 15,
        },
        tabBarLabelStyle: {
          fontFamily: "Spoqa",
          fontSize: 25,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="일상"
        options={{
          tabBarBadgeStyle: {},
        }}
        component={Feed}
      />
      <Tabs.Screen
        name="순위"
        options={{
          tabBarBadgeStyle: {},
        }}
        component={Rank}
      />
      <Tabs.Screen
        name="친구"
        options={{
          tabBarBadgeStyle: {},
        }}
        component={Friend}
      />
      <Tabs.Screen
        name="나"
        options={{
          tabBarBadgeStyle: {},
        }}
        component={Me}
      />
    </Tabs.Navigator>
  );
}
