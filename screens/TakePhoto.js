import React, { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import Slider from "@react-native-community/slider";
import {
  Text,
  View,
  StatusBar,
  Dimensions,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";
import styled from "styled-components/native";
import SmallBtn from "../components/SmallBtn";

const FunctionBox = styled.View`
  flex: 3;
  width: ${(props) => props.windowWidth}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 40px;
`;

const TakePhotoBtn = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: white;
  border-width: 10px;
  border-color: ${colors.gray};
  right: 10px;
`;

export default function TakePhoto({ navigation, route }) {
  const camera = useRef();
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const [takenPhoto, setTakenPhoto] = useState([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, setPermission] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <SmallBtn
            text={"사진 올리기"}
            color={"main"}
            pressFunction={() =>
              navigation.navigate("UploadForm", {
                caption: route?.params?.caption,
                takenPhoto,
              })
            }
          />
        );
      },
    });
  }, [takenPhoto]);

  const getPermissions = async () => {
    const { granted } = await Camera.requestCameraPermissionsAsync();
    setPermission(granted);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const onCameraSwitch = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  const onZoomValueChange = (e) => {
    setZoom(e);
  };

  const onFlashValueChange = (e) => {
    if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on);
    } else {
      setFlashMode(Camera.Constants.FlashMode.off);
    }
  };

  const onCameraReady = () => setCameraReady(true);

  const saveToPhone = async (save) => {
    if (save) {
      await MediaLibrary.saveToLibraryAsync(takenPhoto);
    }
  };

  const takePhoto = async () => {
    if (camera.current && cameraReady) {
      const { uri } = await camera.current.takePictureAsync({
        quality: 1,
        exif: true,
      });
      setTakenPhoto((oldArray) => [...oldArray, uri]);
    }
  };

  const onDismiss = () => setTakenPhoto([]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {takenPhoto.length === 0 ? (
        <Camera
          type={cameraType}
          zoom={zoom}
          flashMode={flashMode}
          onCameraReady={onCameraReady}
          ref={camera}
          style={{ width: windowWidth, flex: 2, marginTop: 15 }}
        ></Camera>
      ) : (
        <Image
          source={{ uri: takenPhoto[0] }}
          style={{
            width: windowWidth,
            flex: 2,
            transform:
              cameraType === Camera.Constants.Type.back
                ? [{ rotate: "270deg" }]
                : [{ scaleX: -1 }, { rotate: "90deg" }],
          }}
          resizeMode="contain"
        />
      )}
      <View
        style={{
          width: windowWidth,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Slider
          style={{
            width: 300,
            flex: 1.2,
          }}
          value={zoom}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={colors.mainColor}
          maximumTrackTintColor={colors.lightMain}
          onValueChange={onZoomValueChange}
        />
        <FunctionBox windowWidth={windowWidth}>
          {/* 플래시 */}
          <TouchableOpacity
            onPress={onFlashValueChange}
            style={{ marginRight: 30 }}
          >
            <Ionicons
              size={40}
              color={colors.lightMain}
              name={
                flashMode === Camera.Constants.FlashMode.off
                  ? "flash-off"
                  : "flash"
              }
            />
          </TouchableOpacity>
          {/* TakePhotoBtn */}
          {takenPhoto.length > 0 ? (
            <SmallBtn text={"다시 찍기"} pressFunction={onDismiss} />
          ) : (
            <TakePhotoBtn onPress={takePhoto}></TakePhotoBtn>
          )}
          {/* 앞뒤 전환 */}
          <TouchableOpacity onPress={onCameraSwitch}>
            <Ionicons
              size={50}
              color={colors.lightMain}
              name={
                cameraType === Camera.Constants.Type.front
                  ? "camera-reverse"
                  : "camera"
              }
            />
          </TouchableOpacity>
        </FunctionBox>
      </View>
    </View>
  );
}
