import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { colors } from "../colors";
import Constants from "expo-constants";
import { FEED_FRAGMENT } from "../fragments";
import MeNotiBox from "../components/MeNotiBox";
import ImageSwiper from "../components/ImageSwiper";
import LikeAndCommnet from "../components/LikeAndComment";
import LikeAndComment from "../components/LikeAndComment";
import WriterBox from "../components/WriterBox";

const Me_QUERY = gql`
  query me {
    me {
      id
      name
      avatar
    }
  }
`;

const SEE_CERTAIN_USER_FEED_QUERY = gql`
  query seeCertainUserFeed($offset: Int!, $userName: String!) {
    seeCertainUserFeed(offset: $offset, userName: $userName) {
      ...FeedFragment
    }
  }
  ${FEED_FRAGMENT}
`;

export default function Me() {
  const { width: windowWidth } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);
  const [dataSortArray, setDataSortArray] = useState([]);
  // meQuery
  const { data: meData } = useQuery(Me_QUERY);
  // seeAllFeeds
  const {
    data: meFeedData,
    loading,
    refetch,
    fetchMore,
  } = useQuery(SEE_CERTAIN_USER_FEED_QUERY, {
    variables: {
      offset: 0,
      userName: meData?.me?.name,
    },
  });

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (meFeedData) {
      const dataSortStep = [...meFeedData?.seeCertainUserFeed].sort(
        (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt)
      );
      setDataSortArray(dataSortStep);
    }
  }, [meFeedData]);

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
      <MeNotiBox />
      <FlatList
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: meFeedData?.seeCertainUserFeed?.length,
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
