import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import { colors } from "../colors";
import CreateAccount from "../screens/CreateAccount";

const Stack = createNativeStackNavigator();

export default function LoggedoutNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Welcome"
        component={Welcome}
      />
      <Stack.Screen
        options={{
          title: "로그인",
          headerShadowVisible: false,
          headerTintColor: colors.mainColor,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{
          title: "회원가입",
          headerShadowVisible: false,
          headerTintColor: colors.mainColor,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        name="CreateAccount"
        component={CreateAccount}
      />
    </Stack.Navigator>
  );
}
