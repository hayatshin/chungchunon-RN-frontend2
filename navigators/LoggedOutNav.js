import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import { colors } from "../colors";
import BirthGender from "../screens/createAccount/BirthGender";
import PhoneVerification from "../screens/createAccount/PhoneVerification";
import PersonalInfo from "../screens/createAccount/PersonalInfo";

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
        name="BirthGender"
        component={BirthGender}
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
        name="PhoneVerification"
        component={PhoneVerification}
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
        name="PersonalInfo"
        component={PersonalInfo}
      />
    </Stack.Navigator>
  );
}
