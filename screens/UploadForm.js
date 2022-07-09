import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import ImageSwiper from "../components/ImageSwiper";
import SmallBtn from "../components/SmallBtn";
import { ReactNativeFile } from "apollo-upload-client";
import { FEED_FRAGMENT } from "../fragments";

const UPLOAD_FEED_MUTATION = gql`
  mutation createFeed($photos: [Upload], $caption: String!) {
    createFeed(photos: $photos, caption: $caption) {
      ...FeedFragment
    }
  }
  ${FEED_FRAGMENT}
`;

export default function UploadForm({ route, navigation }) {
  const caption = route?.params?.caption;
  const uploadPhotos =
    route?.params?.selectPhotos || route?.params?.takenPhoto || null;
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

  const updateUploadPhoto = (cache, result) => {
    const {
      data: { createFeed },
    } = result;
    if (createFeed.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeAllFeeds(prev) {
            return [createFeed, ...prev];
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };

  const [uploadFeedMutation, { loading, data }] = useMutation(
    UPLOAD_FEED_MUTATION,
    {
      update: updateUploadPhoto,
    }
  );

  const onUploadPress = () => {
    if (uploadPhotos !== null) {
      const files = uploadPhotos.map(
        (file) =>
          new ReactNativeFile({
            uri: file,
            name: `1.jpg`,
            type: "image/jpeg",
          })
      );
      uploadFeedMutation({
        variables: {
          caption,
          photos: files,
        },
      });
    } else {
      uploadFeedMutation({
        variables: {
          caption,
        },
      });
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <SmallBtn
            text={"확인"}
            color={"main"}
            pressFunction={onUploadPress}
          />
        );
      },
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          width: windowWidth,
          height: windowHeight * 0.5,
          display: "flex",
          justifyContent: "space-between",
          // backgroundColor: "red",
        }}
      >
        {/* 이미지 */}
        {uploadPhotos ? (
          <View style={{ width: "100%", height: windowWidth * 0.7 }}>
            <ImageSwiper photosArray={uploadPhotos} />
          </View>
        ) : null}
        {/* 글 */}
        <View style={{ padding: 15 }}>
          <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>{caption}</Text>
        </View>
      </View>
    </View>
  );
}
