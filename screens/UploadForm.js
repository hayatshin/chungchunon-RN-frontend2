import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import ImageSwiper from "../components/ImageSwiper";
import SmallBtn from "../components/SmallBtn";
import { ReactNativeFile } from "apollo-upload-client";
import { FEED_FRAGMENT } from "../fragments";
import { colors } from "../colors";
import { feedAddVar } from "../apollo";

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
  const [captionConfirm, setCaptionconfirm] = useState(caption);
  const [inputClick, setInputClick] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [uploadWait, setUploadwait] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uploadPhotos !== undefined) {
      setLoading(true);
    }
  }, [uploadPhotos]);

  const updateUploadPhoto = (cache, result) => {
    const {
      data: { createFeed },
    } = result;
    const certainFeedFragment = { ...createFeed };
    certainFeedFragment.__typename = "Feedpoem";
    if (createFeed.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeAllFeeds(prev) {
            return [createFeed, ...prev];
          },
          seeMeFeedPoem(prev) {
            return [certainFeedFragment, ...prev];
          },
        },
      });
      navigation.navigate("Tabs", { screen: "일상" });
    }
  };

  const [uploadFeedMutation] = useMutation(UPLOAD_FEED_MUTATION, {
    update: updateUploadPhoto,
  });

  useEffect(() => {
    if (captionConfirm !== "") {
      setShowNoti(false);
    }
    const onUploadPress = () => {
      if (captionConfirm === "") {
        setShowNoti(true);
      } else {
        setUploadwait(true);
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
              caption: captionConfirm,
              photos: files,
            },
          });
        } else {
          uploadFeedMutation({
            variables: {
              caption: captionConfirm,
            },
          });
        }
      }
    };

    navigation.setOptions({
      headerRight: () => {
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {showNoti ? (
              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  fontWeight: "700",
                  marginRight: 16,
                  textDecorationLine: "underline",
                }}
              >
                글을 작성해야 업로드가 가능해요! 👉
              </Text>
            ) : null}
            {uploadWait ? (
              <ActivityIndicator color={colors.mainColor} size={30} />
            ) : (
              <SmallBtn
                text={"확인"}
                color={"main"}
                pressFunction={onUploadPress}
              />
            )}
          </View>
        );
      },
    });
  }, [captionConfirm, showNoti, uploadWait]);

  return loading ? (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          width: windowWidth,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* 이미지 */}
        {uploadPhotos.length > 0 ? (
          <View style={{ width: windowWidth, height: windowWidth }}>
            <ImageSwiper photosArray={uploadPhotos} />
          </View>
        ) : null}
        {/* 글 */}
        {caption !== "" ? (
          <SafeAreaView>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                padding: 15,
                paddingVertical: 30,
              }}
            >
              <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
                {caption}
              </Text>
            </ScrollView>
          </SafeAreaView>
        ) : (
          <View
            style={{
              height: (windowHeight - windowWidth) * 0.7,
              padding: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              onFocus={() => setInputClick(true)}
              onBlur={() => setInputClick(false)}
              onChangeText={(text) => setCaptionconfirm(text)}
              onSubmitEditing={(text) => setCaptionconfirm(text)}
              placeholder="글쓰기..."
              placeholderTextColor={colors.lightGray}
              multiline={true}
              style={{
                flex: 4,
                width: "90%",
                backgroundColor: "white",
                borderRadius: 5,
                borderWidth: 2,
                borderColor: inputClick ? colors.mainColor : colors.lightGray,
                padding: 30,
                fontSize: 25,
                fontFamily: "Spoqa",
                textAlignVertical: "top",
                marginBottom: 10,
              }}
            ></TextInput>
          </View>
        )}
      </View>
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <ActivityIndicator size={30} color={colors.mainColor} />
    </View>
  );
}
