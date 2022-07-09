import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { colors } from "../colors";
import UploadForm from "../screens/UploadForm";

const Stack = createNativeStackNavigator();

export default function UploadNav() {
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
      <Stack.Screen name="SelectPhoto" component={SelectPhoto} />
      <Stack.Screen
        options={{
          headerTintColor: colors.lightMain,
          headerStyle: {
            backgroundColor: "black",
          },
        }}
        name="TakePhoto"
        component={TakePhoto}
      />
      <Stack.Screen
        options={{
          headerTitle: "미리보기",
          headerTintColor: colors.mainColor,
        }}
        name="UploadForm"
        component={UploadForm}
      />
    </Stack.Navigator>
  );
}
