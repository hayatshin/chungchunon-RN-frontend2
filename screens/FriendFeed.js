import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { colors } from "../colors";
import { FEED_POEM_FRAGMENT } from "../fragments";
import ImageSwiper from "../components/ImageSwiper";
import LikeAndComment from "../components/LikeAndComment";
import WriterBox from "../components/WriterBox";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import InfoNotiBox from "../components/InfoNotiBox";
import NotiBox from "../components/NotiBox";
import PoemLikeAndComment from "../components/PoemLikeAndComment";
import PoemWriterBox from "../components/PoemWriterBox";

const SEE_CERTAIN_USER_FEED_POEM = gql`
  query seeCertainUserFeedPoem($offset: Int!, $id: Int!) {
    seeCertainUserFeedPoem(offset: $offset, id: $id) {
      ...FeedPoemFragment
    }
  }
  ${FEED_POEM_FRAGMENT}
`;
export default function FriendFeed({ route }) {
  const userId = route?.params?.writerId;
  const screenFocus = useIsFocused();
  const { width: windowWidth } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);
  const [seemore, setSeemore] = useState(false);

  const {
    data: fpData,
    loading: fpLoading,
    refetch: fpRefetch,
    fetchMore: fpFetchmore,
  } = useQuery(SEE_CERTAIN_USER_FEED_POEM, {
    variables: {
      offset: 0,
      id: parseInt(userId),
    },
  });

  useEffect(() => {
    if (userId !== null && userId !== undefined) {
      fpRefetch();
    } else {
      setDataLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (fpData !== null && fpData !== undefined) {
      setData((oldarray) =>
        [...fpData.seeCertainUserFeedPoem].sort(function (a, b) {
          return b.createdAt - a.createdAt;
        })
      );
    }
  }, [fpData]);

  useEffect(() => {
    if (data !== null && data !== undefined) {
      setDataLoading(true);
    }
  }, [data]);

  const refresh = async () => {
    setRefreshing(true);
    await fpRefetch();
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <InfoNotiBox userId={userId} />
      {dataLoading ? (
        data.length !== 0 ? (
          <FlatList
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              fpFetchmore({
                variables: {
                  // id: parseInt(userId),
                  offset: data.length,
                },
              });
            }}
            refreshing={refreshing}
            onRefresh={refresh}
            keyExtractor={(feed) => feed.id}
            data={data}
            renderItem={({ item }) => {
              if (item.caption !== null) {
                return (
                  <View style={{ width: windowWidth }}>
                    {/* 작성자 */}
                    <WriterBox
                      writerAvatar={item?.user?.avatar}
                      writerName={item?.user?.name}
                      writeTime={item?.createdAt}
                      editTime={item?.updatedAt}
                      feedId={item?.id}
                      writerId={item?.user?.id}
                    />
                    {/* 이미지 */}
                    {item.photos.length > 0 ? (
                      <ImageSwiper photosArray={item?.photos} />
                    ) : null}
                    <View style={{ width: windowWidth, padding: 15 }}>
                      {/* 글 */}
                      {item?.caption.length > 196 ? (
                        seemore ? (
                          <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
                            {item?.caption}
                          </Text>
                        ) : (
                          <View>
                            <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
                              {item?.caption.substr(0, 196)}
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
                          {item?.caption}
                        </Text>
                      )}
                      {/* 좋아요 와 댓글 */}
                      <LikeAndComment
                        likeNumber={item?.likeNumber}
                        commentNumber={item?.commentNumber}
                        feedId={item?.id}
                        isLiked={item?.isLiked}
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
              } else {
                return (
                  <View
                    style={{
                      width: windowWidth,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PoemWriterBox
                      writerAvatar={item?.user?.avatar}
                      writerName={item?.user?.name}
                      writeTime={item?.createdAt}
                      editTime={item?.updatedAt}
                      feedId={item?.id}
                      writerId={item?.user?.id}
                    />
                    {/* 시 박스 */}
                    <View
                      style={{
                        width: windowWidth * 0.9,
                        paddingVertical: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#C69978",
                        borderRadius: 2,
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          width: windowWidth * 0.8,
                          backgroundColor: "#FFFEF2",
                          borderRadius: 4,
                          paddingHorizontal: 20,
                          paddingVertical: 30,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Spoqa",
                            fontSize: 20,
                            fontWeight: "700",
                            marginBottom: 10,
                            textAlign: "center",
                          }}
                        >
                          {item?.poemTitle}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Spoqa",
                            fontSize: 17,
                            fontWeight: "700",
                            textAlign: "right",
                            marginBottom: 20,
                          }}
                        >
                          {item?.user?.name}
                        </Text>
                        <Text style={{ fontFamily: "Spoqa", fontSize: 17 }}>
                          {item?.poemCaption}
                        </Text>
                      </View>
                    </View>
                    {/* 좋아요 와 댓글 */}
                    <View
                      style={{
                        width: windowWidth,
                        padding: 15,
                        marginBottom: 10,
                      }}
                    >
                      <PoemLikeAndComment
                        likeNumber={item?.poemLikeNumber}
                        commentNumber={item?.poemCommentNumber}
                        poemId={item?.id}
                        isLiked={item?.isLiked}
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
                    <View style={{ width: "100%", height: 20 }}></View>
                  </View>
                );
              }
            }}
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
              작성하신 글이 없습니다
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
