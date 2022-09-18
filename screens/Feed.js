import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ImageSwiper from "../components/ImageSwiper";
import LikeAndComment from "../components/LikeAndComment";
import NotiBox from "../components/NotiBox";
import WriterBox from "../components/WriterBox";
import Constants from "expo-constants";
import { FEED_FRAGMENT } from "../fragments";
import { useIsFocused } from "@react-navigation/native";
import { colors } from "../colors";
import SmallBtn from "../components/SmallBtn";

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
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);
  const [seemore, setSeemore] = useState(false);

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

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (feedData !== null && feedData !== undefined) {
      setData(
        [...feedData?.seeAllFeeds].sort(function (a, b) {
          return b.createdAt - a.createdAt;
        })
      );
    }
  }, [feedData]);

  useEffect(() => {
    if (data !== undefined && data !== null) {
      setDataLoading(true);
    }
  }, [data]);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const eachPhoto = ({ item: feed, index }) => {
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
          onDeletePress={() => setDeletecheck(true)}
        />
        {/* 이미지 */}
        {feed?.photos.length > 0 ? (
          <ImageSwiper photosArray={feed?.photos} />
        ) : null}
        <View style={{ width: windowWidth, padding: 15 }}>
          {/* 글 */}
          {feed?.caption.length > 196 ? (
            seemore ? (
              <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
                {feed?.caption}
              </Text>
            ) : (
              <View>
                <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
                  {feed?.caption.substr(0, 196)}
                </Text>
                <TouchableOpacity onPress={() => setSeemore(true)}>
                  <Text
                    style={{
                      fontFamily: "Spoqa",
                      fontSize: 20,
                      fontWeight: "700",
                      color: colors.gray,
                    }}
                  >
                    ...더보기
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
              {feed?.caption}
            </Text>
          )}
          {/* 좋아요 와 댓글 */}
          <LikeAndComment
            likeNumber={feed?.likeNumber}
            commentNumber={feed?.commentNumber}
            feedId={feed?.id}
            isLiked={feed?.isLiked}
          />
        </View>
        {/* 칸막이 */}
        <View
          style={{
            width: "100%",
            height: 10,
            backgroundColor: colors.lightGray,
          }}
        ></View>
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
        data.length !== 0 ? (
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
              backgroundColor: "white",
            }}
          >
            <Text
              style={{ fontFamily: "Spoqa", fontSize: 20, fontWeight: "700" }}
            >
              작성된 글이 없습니다
            </Text>
          </View>
        )
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
      )}
    </View>
  );
}
