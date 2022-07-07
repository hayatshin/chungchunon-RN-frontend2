import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabsNav from "./LoggedInTabsNav";
import LoggedInTabsNav from "./LoggedInTabsNav";

const Stack = createNativeStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false }}
        component={LoggedInTabsNav}
      />
    </Stack.Navigator>
  );
}
