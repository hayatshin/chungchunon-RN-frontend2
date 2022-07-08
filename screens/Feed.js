import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import ImageSwiper from "../components/ImageSwiper";
import LikeAndCommnet from "../components/LikeAndCommnet";
import NotiBox from "../components/NotiBox";
import WriterBox from "../components/WriterBox";
import Constants from "expo-constants";

const SEE_ALL_FEEDS_QUERY = gql`
  query seeAllFeeds($offset: Int!) {
    seeAllFeeds(offset: $offset) {
      id
      user {
        id
        name
        avatar
      }
      photos
      caption
      createdAt
      updatedAt
      likeNumber
      comments {
        id
        user {
          name
        }
        payload
        createdAt
        updatedAt
      }
      commentNumber
      isMine
      isLiked
    }
  }
`;

export default function Feed() {
  const { width: windowWidth } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);

  // seeAllFeeds
  const { data, loading, refetch, fetchMore } = useQuery(SEE_ALL_FEEDS_QUERY, {
    variables: {
      offset: 0,
    },
  });
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const eachPhoto = ({ item: feed }) => {
    return (
      <View style={{ width: windowWidth }}>
        {/* 작성자 */}
        <WriterBox
          writerAvatar={feed?.user?.avatar}
          writerName={feed?.user?.name}
          writeTime={feed?.createdAt}
          editTime={feed?.updatedAt}
        />
        {/* 이미지 */}
        <ImageSwiper photosArray={feed?.photos} />
        <View style={{ width: windowWidth, padding: 15 }}>
          {/* 좋아요 와 댓글 */}
          <LikeAndCommnet
            likeNumber={feed?.likeNumber}
            commentNumber={feed?.commentNumber}
            feedId={feed?.id}
            isLiked={feed?.isLiked}
          />
          {/* 글 */}
          <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
            {feed?.caption}
          </Text>
        </View>
        {/* 경계 */}
        <View
          style={{
            height: 13,
            width: "100%",
          }}
        ></View>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
      }}
    >
      <NotiBox />
      <FlatList
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeAllFeeds?.length,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={refresh}
        keyExtractor={(feed) => "" + feed.id}
        data={data?.seeAllFeeds}
        renderItem={eachPhoto}
      />
    </View>
  );
}
