import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ImageSwiper from "../components/ImageSwiper";
import LikeAndCommnet from "../components/LikeAndCommnet";
import NotiBox from "../components/NotiBox";
import WriterBox from "../components/WriterBox";
import Constants from "expo-constants";
import { FEED_FRAGMENT } from "../fragments";
import { colors } from "../colors";

const SEE_ALL_FEEDS_QUERY = gql`
  query seeAllFeeds($offset: Int!) {
    seeAllFeeds(offset: $offset) {
      ...FeedFragment
    }
  }
  ${FEED_FRAGMENT}
`;

export default function Feed() {
  const { width: windowWidth } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);
  const [dataSortArray, setDataSortArray] = useState([]);
  // seeAllFeeds
  const { data, loading, refetch, fetchMore } = useQuery(SEE_ALL_FEEDS_QUERY, {
    variables: {
      offset: 0,
    },
  });

  useEffect(() => {
    const dataSortStep = [...data?.seeAllFeeds].sort(
      (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt)
    );
    setDataSortArray(dataSortStep);
  }, [data]);

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
        {feed?.photos.length > 0 ? (
          <ImageSwiper photosArray={feed?.photos} />
        ) : null}
        <View style={{ width: windowWidth, padding: 15 }}>
          {/* 글 */}
          <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
            {feed?.caption}
          </Text>
          {/* 좋아요 와 댓글 */}
          <LikeAndCommnet
            likeNumber={feed?.likeNumber}
            commentNumber={feed?.commentNumber}
            feedId={feed?.id}
            isLiked={feed?.isLiked}
          />
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

  return dataSortArray.length === 0 ? (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={50} color={colors.mainColor} />
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "white",
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
        keyExtractor={(feed) => feed.id}
        data={dataSortArray}
        renderItem={eachPhoto}
      />
    </View>
  );
}
