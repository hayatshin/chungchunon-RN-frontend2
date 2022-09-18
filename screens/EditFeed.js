import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { colors } from "../colors";
import ImageSwiper from "../components/ImageSwiper";
import SmallBtn from "../components/SmallBtn";
import { FEED_FRAGMENT } from "../fragments";

const SEE_ALL_FEEDS_QUERY = gql`
  query seeAllFeeds($offset: Int!) {
    seeAllFeeds(offset: $offset) {
      ...FeedFragment
    }
  }
  ${FEED_FRAGMENT}
`;

const SEE_CERTAIN_FEED_QUERY = gql`
  query seeCertainFeed($id: Int!) {
    seeCertainFeed(id: $id) {
      ...FeedFragment
    }
  }
  ${FEED_FRAGMENT}
`;

const EDIT_FEED_MUTATION = gql`
  mutation editFeed($id: Int!, $caption: String!) {
    editFeed(id: $id, caption: $caption) {
      ok
      error
    }
  }
`;

export default function EditFeed({ route, navigation }) {
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const [caption, setCaption] = useState("");
  const [inputClick, setInputClick] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataLength, setDataLength] = useState("");

  const feedId = route?.params?.feedId;

  const { data: seeCertainFeedData } = useQuery(SEE_CERTAIN_FEED_QUERY, {
    variables: {
      id: parseInt(feedId),
    },
  });

  useEffect(() => {
    if (seeCertainFeedData !== null && seeCertainFeedData !== undefined) {
      setData((oldArray) => seeCertainFeedData?.seeCertainFeed);
    }
  }, [seeCertainFeedData]);

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      setDataLoading(true);
      setDataLength(data?.photos?.length);
    }
  }, [data]);

  const onUpdateEdit = (cache, result) => {
    const cacheFeedId = `Feed:${feedId}`;
    const cacheFPId = `Feedpoem:${feedId}`;
    const {
      data: {
        editFeed: { ok },
      },
    } = result;
    if (ok) {
      cache.modify({
        id: cacheFeedId,
        fields: {
          caption(prev) {
            return caption;
          },
        },
      });
      cache.modify({
        id: cacheFPId,
        fields: {
          caption(prev) {
            return caption;
          },
        },
      });

      navigation.goBack();
    }
  };

  const [editFeedMutation] = useMutation(EDIT_FEED_MUTATION, {
    variables: {
      id: parseInt(feedId),
      caption,
    },
    update: onUpdateEdit,
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <SmallBtn
            text={"수정 완료"}
            color={"main"}
            pressFunction={editFeedMutation}
          />
        );
      },
    });
  }, []);
  return dataLoading ? (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 이미지 */}
        {dataLength !== 0 && dataLength !== "" ? (
          <View style={{ width: windowWidth, height: windowWidth }}>
            <ImageSwiper
              photosArray={seeCertainFeedData?.seeCertainFeed?.photos}
            />
          </View>
        ) : null}
        <View style={{ width: windowWidth, height: 50 }}></View>
        {/* 글 */}
        <TextInput
          onFocus={() => setInputClick(true)}
          onBlur={() => setInputClick(false)}
          onChangeText={(text) => setCaption(text)}
          onSubmitEditing={(text) => setCaption(text)}
          defaultValue={seeCertainFeedData?.seeCertainFeed?.caption}
          style={{
            width: windowWidth * 0.9,
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 2,
            borderColor: inputClick ? colors.mainColor : colors.lightGray,
            padding: 30,
            fontSize: 25,
            fontFamily: "Spoqa",
            textAlignVertical: "top",
          }}
          multiline={true}
        ></TextInput>
      </ScrollView>
    </SafeAreaView>
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
