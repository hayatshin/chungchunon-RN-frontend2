import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, FlatList } from "react-native";
import { colors } from "../colors";
import Constants from "expo-constants";
import { FEED_FRAGMENT, ME_FRAGMENT } from "../fragments";
import ImageSwiper from "../components/ImageSwiper";
import LikeAndComment from "../components/LikeAndComment";
import WriterBox from "../components/WriterBox";
import { useIsFocused } from "@react-navigation/native";
import InfoNotiBox from "../components/InfoNotiBox";
import NotiBox from "../components/NotiBox";

const SEE_CERTAIN_USER_FEED_QUERY = gql`
  query seeCertainUserFeed($offset: Int!, $id: Int!) {
    seeCertainUserFeed(offset: $offset, id: $id) {
      ...FeedFragment
    }
  }
  ${FEED_FRAGMENT}
`;

export default function FriendFeed({ route }) {
  const userId = route?.params?.userId;
  const screenFocus = useIsFocused();
  const { width: windowWidth } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: friendFeedData,
    loading,
    refetch,
    fetchMore,
  } = useQuery(SEE_CERTAIN_USER_FEED_QUERY, {
    variables: {
      offset: 0,
      id: parseInt(userId),
    },
  });

  useEffect(() => {
    refetch();
  }, [screenFocus]);

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
        backgroundColor: "white",
      }}
    >
      <InfoNotiBox userId={userId} />
      <FlatList
        onEndReachedThreshold={0.1}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: friendFeedData?.seeCertainUserFeed?.length,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={refresh}
        keyExtractor={(feed) => feed.id}
        data={friendFeedData?.seeCertainUserFeed}
        renderItem={eachPhoto}
      />
    </View>
  );
}
