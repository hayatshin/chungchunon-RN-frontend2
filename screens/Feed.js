import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import ImageSwiper from "../components/ImageSwiper";
import LikeAndComment from "../components/LikeAndComment";
import NotiBox from "../components/NotiBox";
import WriterBox from "../components/WriterBox";
import Constants from "expo-constants";
import { FEED_FRAGMENT } from "../fragments";
import { useIsFocused } from "@react-navigation/native";
import { colors } from "../colors";

const SEE_ALL_FEEDS_QUERY = gql`
  query seeAllFeeds($offset: Int!) {
    seeAllFeeds(offset: $offset) {
      ...FeedFragment
    }
  }
  ${FEED_FRAGMENT}
`;

export default function Feed({ navigation }) {
  const screenFocus = useIsFocused();
  const { width: windowWidth } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);

  // seeAllPoems
  const {
    data: feedData,
    loading,
    refetch,
    fetchMore,
  } = useQuery(SEE_ALL_FEEDS_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    refetch();
  }, [screenFocus]);

  useEffect(() => {
    if (feedData) {
      setData((oldarray) =>
        [...feedData.seeAllFeeds].sort(function (a, b) {
          return b.createdAt - a.createdAt;
        })
      );
    }
  }, [feedData]);

  useEffect(() => {
    if (data.length > 0) {
      setDataLoading(true);
    }
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
          feedId={feed?.id}
          writerId={feed?.user?.id}
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
          <LikeAndComment
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

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "white",
      }}
    >
      <NotiBox />
      {dataLoading ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.3}
          onEndReached={() =>
            fetchMore({
              variables: {
                offset: data.length,
              },
            })
          }
          refreshing={refreshing}
          onRefresh={refresh}
          keyExtractor={(feed) => feed?.id}
          data={data}
          renderItem={eachPhoto}
        />
      ) : (
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={30} color={colors.mainColor} />
        </View>
      )}
    </View>
  );
}
