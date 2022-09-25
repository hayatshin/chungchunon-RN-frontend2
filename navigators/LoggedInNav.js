import { gql, useMutation, useQuery } from "@apollo/client";
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
import axios from "axios";
import moment from 'moment';
import BackgroundService from 'react-native-background-actions';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import { Alert, PermissionsAndroid } from "react-native";
import { PEDOMETER_FRAGMENT } from "../fragments";

const Stack = createNativeStackNavigator();


const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const options = {
  taskName: '청춘온',
  taskTitle: '0',
  taskDesc: '',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 5000,
  },
};

const authorizeGoogleFit = (p_callback) => {
  // Google Fit 로 걸음수 recording 시작
  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_ACTIVITY_WRITE,
    ],
  }
  GoogleFit.authorize(options)
    .then(authResult => {
      if (authResult.success) {
        console.log("AUTH_SUCCESS");
        // ...
        // Call when authorized
        GoogleFit.startRecording((callback) => {
          // Process data from Google Fit Recording API (no google fit app needed)
        });
        p_callback()

      } else {
        console.log("AUTH_DENIED");
        console.log(authResult);
      }
    })
    .catch(() => {
      console.log("AUTH_ERROR");
    })
}

const CREATE_PEDOMETER_MUTATION = gql`
  mutation createPedometer($stepCount: Int!) {
    createPedometer(stepCount: $stepCount) {
      ...PedometerFragment
    }
  }
  ${PEDOMETER_FRAGMENT}
`;

export default function LoggedInNav() {

  useEffect(() => {
    requestActivityPermission()

    return (() => {
    })
  }, [])


  const [createPedometerMutation] = useMutation(CREATE_PEDOMETER_MUTATION);

  // You can do anything in your task such as network requests, timers and so on,
  // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
  // React Native will go into "paused" mode (unless there are other tasks running,
  // or there is a foreground app).
  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log(i);
        getStepsInfo()
        await sleep(delay)
      }
    });
  };


  const getStepsInfo = () => {
    const options = {
      startDate: moment(moment().format("YYYY-MM-DD")).format(), // required ISO8601Timestamp
      endDate: moment().format(), // required ISO8601Timestamp
      bucketUnit: "DAY", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1. 
    };

    GoogleFit.getDailyStepCountSamples(options)
      .then(async (res) => {
        const estimatedSteps = res.find(it => it.source == "com.google.android.gms:estimated_steps").steps
        if (estimatedSteps.length > 0) {
          const todaySteps = estimatedSteps.find((it => it.date == moment().format("YYYY-MM-DD"))).value
          createPedometerMutation({
            variables: {
              stepCount: todaySteps,
            }
          })
          if (BackgroundService.isRunning()) {
            await BackgroundService.updateNotification({ taskTitle: todaySteps.toString() + " 걸음" }); // Only Android, iOS will ignore this call
          }
        }
      })
      .catch((err) => {
        console.warn("bbbbbbbbbbbbbbbb", err)
      })
  }


  const requestActivityPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        authorizeGoogleFit(() => {
          getStepsInfo()
          startBackgroundService()
        })
      } else {
        alert("앱을 정상적으로 이용하려면 앱 설정 -> 앱권한에서 신체 활동 권한을 허용해주세요.")
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const startBackgroundService = async () => {
    if (!BackgroundService.isRunning()) {
      await BackgroundService.start(veryIntensiveTask, options);
    }
  }

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
