import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { colors } from "../colors";
import AllRank from "../screens/AllRank";
import CommunityRank from "../screens/CommunityRank";

const Stack = createNativeStackNavigator();

export default function RankNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "",
        headerShadowVisible: false,
        headerTintColor: colors.mainColor,
        headerTitleStyle: {
          fontFamily: "Spoqa",
          fontWeight: "700",
        },
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen name="AllRank" component={AllRank} />
      <Stack.Screen
        options={{
          headerTitle: "전체 순위 보기",
          headerTintColor: colors.mainColor,
        }}
        name="CommunityRank"
        component={CommunityRank}
      />
    </Stack.Navigator>
  );
}
