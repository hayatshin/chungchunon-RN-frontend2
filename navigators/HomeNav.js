import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoggedoutNav from "./LoggedOutNav";
import LoggedInNav from "./LoggedInNav";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();

export default function HomeNav() {
  const { isLoggedIn } = useSelector((state) => state.usersReducer);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoggedIn ? (
        <Stack.Screen name="LoggedInNav" component={LoggedInNav} />
      ) : (
        <Stack.Screen name="LoggedOutNav" component={LoggedoutNav} />
      )}
    </Stack.Navigator>
  );
}
