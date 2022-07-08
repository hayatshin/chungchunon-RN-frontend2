import React, { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import {
  FlatList,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import styled from "styled-components/native";
import { colors } from "../colors";
import NextBtn from "../components/NextBtn";
import PrevBtn from "../components/PrevBtn";
import SmallBtn from "../components/SmallBtn";

export default function SelectPhoto({ navigation }) {
  const numColumns = 3;
  const { width: windowWidth } = Dimensions.get("window");
  const [permission, setPermission] = useState(false);
  const [phonePhotos, setPhonePhotos] = useState([]);
  const [selectPhotos, setSelectPhotos] = useState([]);
  const [endCursor, setEndCursor] = useState("");
  const [nextPage, setNextPage] = useState(false);

  useEffect(() => {
    getPermission();
    navigation.setOptions({
      headerRight: () => {
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <SmallBtn
              text={"사진 찍기"}
              pressFunction={() => navigation.navigate("TakePhoto")}
            />
            <View style={{ width: 15 }} />
            <SmallBtn text={"사진 올리기"} color={"main"} />
          </View>
        );
      },
    });
  }, []);

  const firstGetPhotos = async () => {
    const { assets, endCursor, hasNextPage } =
      await MediaLibrary.getAssetsAsync({
        first: 30,
        sortBy: "creationTime",
        after: endCursor,
      });

    if (hasNextPage) {
      setNextPage(true);
    } else {
      setNextPage(false);
    }
    setEndCursor(endCursor);
    setPhonePhotos(assets);
    // setPhonePhotos(assets);
  };

  const prevGetPhotos = async () => {
    const toGetEndCursor = JSON.stringify(parseInt(endCursor) - 60);
    const {
      assets: prevAssets,
      endCursor: prevEndCurosr,
      hasNextPage: prevNextPage,
    } = await MediaLibrary.getAssetsAsync({
      first: 30,
      sortBy: "creationTime",
      after: toGetEndCursor,
    });
    if (prevNextPage) {
      setNextPage(true);
    } else {
      setNextPage(false);
    }
    setEndCursor(prevEndCurosr);
    setPhonePhotos(prevAssets);
  };

  const nextGetPhotos = async () => {
    const {
      assets: nextAssets,
      endCursor: nextEndCursor,
      hasNextPage: nextHasNextPage,
    } = await MediaLibrary.getAssetsAsync({
      first: 30,
      sortBy: "creationTime",
      after: endCursor,
    });
    if (nextHasNextPage) {
      setNextPage(true);
    } else {
      setNextPage(false);
    }
    setEndCursor(nextEndCursor);
    setPhonePhotos(nextAssets);
  };

  const getPermission = async () => {
    const { canAskAgain } = await MediaLibrary.getPermissionsAsync();
    if (canAskAgain) {
      const { granted } = await MediaLibrary.requestPermissionsAsync();
      if (granted) {
        setPermission(true);
        firstGetPhotos();
      } else {
        null;
      }
    }
  };

  const pushPhotoURI = (item) => {
    if (selectPhotos.includes(item)) {
      setSelectPhotos((oldArray) =>
        oldArray.filter((oldItem) => oldItem !== item)
      );
    } else {
      setSelectPhotos((oldArray) => [...oldArray, item]);
    }
  };

  const renderPhoto = ({ item: photo }) => {
    return (
      <TouchableOpacity
        onPress={() => pushPhotoURI(photo.uri)}
        style={{
          width: windowWidth / numColumns,
          height: windowWidth / numColumns,
          padding: 5,
        }}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
            borderWidth: selectPhotos.includes(photo.uri) ? 8 : 0,
            borderColor: colors.mainColor,
          }}
          source={{ uri: photo.uri }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 10 }}>
        <FlatList
          contentContainerStyle={{ backgroundColor: "white" }}
          numColumns={numColumns}
          data={phonePhotos}
          keyExtractor={(photo) => photo.id}
          renderItem={renderPhoto}
        />
      </View>
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 20,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* 이전 페이지 버튼 */}
        {endCursor === "30" ? (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "40%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></View>
        ) : (
          <PrevBtn
            text={"이전 페이지"}
            icon={"md-arrow-back"}
            pressFunction={prevGetPhotos}
          />
        )}

        {/* 다음 페이지 버튼 */}
        {nextPage ? (
          <NextBtn
            text={"다음 페이지"}
            icon={"arrow-forward"}
            pressFunction={nextGetPhotos}
          />
        ) : (
          <PrevBtn
            text={"마지막 페이지"}
            icon={"md-checkmark"}
            disabled={true}
          />
        )}
      </View>
    </View>
  );
}
