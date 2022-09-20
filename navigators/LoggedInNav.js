import React, { useEffect, useRef, useState } from "react";
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
import PoemComment from "../screens/PoemComment";
import EditProfile from "../screens/EditProfile";
import ImageZoomIn from "../screens/ImageZoomIn";
import { Pedometer } from 'expo-sensors';

const Stack = createNativeStackNavigator();

export default function LoggedInNav() {

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCOunt, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const _subscription = useRef(null)

  useEffect(() => {
    _subscribe()

    return (() => {
      _unsubscribe()
    })
  }, [])

  const _subscribe = () => {
    _subscription.current = Pedometer.watchStepCount(result => {
      console.log("1111111111", result.steps)
      setCurrentStepCount(result.steps)
    });

    Pedometer.isAvailableAsync().then(
      result => {
        console.log("22222222222222", String(result))
        setIsPedometerAvailable(String(result))
      },
      error => {
        console.log('Could not get isPedometerAvailable: ' + error)
        setIsPedometerAvailable('Could not get isPedometerAvailable: ' + error)
      }
    );
  };

  const _unsubscribe = () => {
    _subscription.current && _subscription.current.remove();
    _subscription.current = null;
  };


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
      <Stack.Screen
        name="PoemComment"
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
        component={PoemComment}
      />
      <Stack.Screen
        name="EditProfile"
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
        component={EditProfile}
      />
      <Stack.Screen
        name="ImageZoomIn"
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: colors.lightMain,
          headerTitleStyle: {
            fontFamily: "Spoqa",
            fontWeight: "700",
          },
        }}
        component={ImageZoomIn}
      />
    </Stack.Navigator>
  );
}
