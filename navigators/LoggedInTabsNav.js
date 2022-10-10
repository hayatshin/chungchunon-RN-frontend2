import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "../screens/Feed";
import { colors } from "../colors";
import Me from "../screens/Me";
import RankNav from "./RankNav";
import Poem from "../screens/Poem";
import Info from "../screens/Info";

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
        name="시"
        options={{
          tabBarBadgeStyle: {},
        }}
        component={Poem}
      />
      <Tabs.Screen
        name="순위"
        options={{
          tabBarBadgeStyle: {},
        }}
        component={RankNav}
      />

      <Tabs.Screen
        name="정보"
        options={{
          tabBarBadgeStyle: {},
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Info");
          },
        })}
        component={Info}
      />
    </Tabs.Navigator>
  );
}
