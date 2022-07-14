import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { colors } from "../colors";
import Constants from "expo-constants";
import { FEED_FRAGMENT, ME_FRAGMENT, POEM_FRAGMENT } from "../fragments";
import ImageSwiper from "../components/ImageSwiper";
import LikeAndComment from "../components/LikeAndComment";
import WriterBox from "../components/WriterBox";
import { useIsFocused } from "@react-navigation/native";
import InfoNotiBox from "../components/InfoNotiBox";
import PoemWriterBox from "../components/PoemWriterBox";
import PoemLikeAndComment from "../components/PoemLikeAndComment";
import { useRoute } from "@react-navigation/native";

const Me_QUERY = gql`
  query me {
    me {
      ...MeFragment
    }
  }
  ${ME_FRAGMENT}
`;

const SEE_CERTAIN_USER_FEED_QUERY = gql`
  query seeCertainUserFeed($offset: Int!, $id: Int!) {
    seeCertainUserFeed(offset: $offset, id: $id) {
      ...FeedFragment
    }
  }
  ${FEED_FRAGMENT}
`;

const SEE_CERTAIN_USER_POEM_QUERY = gql`
  query seeCertainUserPoem($offset: Int!, $id: Int!) {
    seeCertainUserPoem(offset: $offset, id: $id) {
      ...PoemFragement
    }
  }
  ${POEM_FRAGMENT}
`;

export default function Me() {
  const screenFocus = useIsFocused();

  const { width: windowWidth } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);
  // meQuery
  const { data: meData } = useQuery(Me_QUERY);
  // seeCertainUserFeed & seeCertainUserPoem
  const {
    data: feedData,
    loading: feedLoading,
    refetch: feedRefetch,
    fetchMore: feedFetchmore,
  } = useQuery(SEE_CERTAIN_USER_FEED_QUERY, {
    variables: {
      offset: 0,
      id: parseInt(meData?.me?.id),
    },
  });
  const {
    data: poemData,
    loading: poemLoading,
    refetch: poemRefetch,
    fetchMore: poemFetchmore,
  } = useQuery(SEE_CERTAIN_USER_POEM_QUERY, {
    variables: {
      offset: 0,
      id: parseInt(meData?.me?.id),
    },
  });

  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    feedRefetch();
    poemRefetch();
  }, [screenFocus]);

  useEffect(() => {
    if (feedData && poemData) {
      const feedresult = feedData.seeCertainUserFeed;
      const poemresult = poemData.seeCertainUserPoem;
      const combineresult = feedresult.concat(poemresult);
      if (combineresult) {
        setData((oldarray) =>
          [...combineresult].sort(function (a, b) {
            return b.createdAt - a.createdAt;
          })
        );
      }
    }
  }, [feedData, poemData]);

  useEffect(() => {
    if (data.length > 0) {
      setDataLoading(true);
    }
  }, [data, meData]);

  const refresh = async () => {
    setRefreshing(true);
    await feedRefetch();
    await poemRefetch();
    setRefreshing(false);
  };

  // const eachFeed = ({ item }) => {
  //   return (
  //     <View style={{ width: windowWidth }}>
  //       {/* 작성자 */}
  //       <WriterBox
  //         writerAvatar={item?.user?.avatar}
  //         writerName={item?.user?.name}
  //         writeTime={item?.createdAt}
  //         editTime={item?.updatedAt}
  //         feedId={item?.id}
  //       />
  //       {/* 이미지 */}
  //       {feed.photos.length > 0 ? (
  //         <ImageSwiper photosArray={item?.photos} />
  //       ) : null}
  //       <View style={{ width: windowWidth, padding: 15 }}>
  //         {/* 글 */}
  //         <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
  //           {item?.caption}
  //         </Text>
  //         {/* 좋아요 와 댓글 */}
  //         <LikeAndComment
  //           likeNumber={item?.likeNumber}
  //           commentNumber={item?.commentNumber}
  //           feedId={item?.id}
  //           isLiked={item?.isLiked}
  //         />
  //       </View>

  //       {/* 경계 */}
  //       <View
  //         style={{
  //           height: 13,
  //           width: "100%",
  //         }}
  //       ></View>
  //     </View>
  //   );
  // };

  // const eachPoem = ({ item }) => {
  //   return (
  //     <View
  //       style={{
  //         width: windowWidth,
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <PoemWriterBox
  //         writerAvatar={item?.user?.avatar}
  //         writerName={item?.user?.name}
  //         writeTime={item?.createdAt}
  //         editTime={item?.updatedAt}
  //         feedId={item?.id}
  //         writerId={item?.user?.id}
  //       />
  //       {/* 시 박스 */}
  //       <View
  //         style={{
  //           width: windowWidth * 0.8,
  //           paddingVertical: 20,
  //           justifyContent: "center",
  //           alignItems: "center",
  //           backgroundColor: colors.brown,
  //           borderRadius: 5,
  //           marginTop: 10,
  //         }}
  //       >
  //         <View
  //           style={{
  //             width: windowWidth * 0.7,
  //             backgroundColor: colors.ivory,
  //             borderRadius: 7,
  //             paddingHorizontal: 20,
  //             paddingVertical: 30,
  //           }}
  //         >
  //           <Text
  //             style={{
  //               fontFamily: "Spoqa",
  //               fontSize: 20,
  //               fontWeight: "700",
  //               marginBottom: 10,
  //               textAlign: "center",
  //             }}
  //           >
  //             {item?.poemTitle}
  //           </Text>
  //           <Text
  //             style={{
  //               fontFamily: "Spoqa",
  //               fontSize: 17,
  //               fontWeight: "700",
  //               textAlign: "right",
  //               marginBottom: 20,
  //             }}
  //           >
  //             {item?.user?.name}
  //           </Text>
  //           <Text style={{ fontFamily: "Spoqa", fontSize: 17 }}>
  //             {item?.poemCaption}
  //           </Text>
  //         </View>
  //       </View>
  //       {/* 좋아요 와 댓글 */}
  //       <View style={{ width: windowWidth, padding: 15, marginBottom: 20 }}>
  //         <PoemLikeAndComment
  //           likeNumber={item?.poemLikeNumber}
  //           commentNumber={item?.poemCommentNumber}
  //           poemId={item?.id}
  //           isLiked={item?.isLiked}
  //         />
  //       </View>
  //     </View>
  //   );
  // };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "white",
      }}
    >
      <InfoNotiBox userId={meData?.me?.id} />
      {dataLoading ? (
        <FlatList
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            feedFetchmore({
              variables: {
                offset: data.length,
              },
            });
            poemFetchmore({
              variables: {
                offset: data.length,
              },
            });
          }}
          refreshing={refreshing}
          onRefresh={refresh}
          keyExtractor={(feed) => feed.id}
          data={data}
          renderItem={({ item }) => {
            if (item.__typename === "Feed") {
              return (
                <View style={{ width: windowWidth }}>
                  {/* 작성자 */}
                  <WriterBox
                    writerAvatar={item?.user?.avatar}
                    writerName={item?.user?.name}
                    writeTime={item?.createdAt}
                    editTime={item?.updatedAt}
                    feedId={item?.id}
                  />
                  {/* 이미지 */}
                  {item.photos.length > 0 ? (
                    <ImageSwiper photosArray={item?.photos} />
                  ) : null}
                  <View style={{ width: windowWidth, padding: 15 }}>
                    {/* 글 */}
                    <Text style={{ fontFamily: "Spoqa", fontSize: 22 }}>
                      {item?.caption}
                    </Text>
                    {/* 좋아요 와 댓글 */}
                    <LikeAndComment
                      likeNumber={item?.likeNumber}
                      commentNumber={item?.commentNumber}
                      feedId={item?.id}
                      isLiked={item?.isLiked}
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
                      width: windowWidth * 0.8,
                      paddingVertical: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.brown,
                      borderRadius: 5,
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        width: windowWidth * 0.7,
                        backgroundColor: colors.ivory,
                        borderRadius: 7,
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
                      marginBottom: 20,
                    }}
                  >
                    <PoemLikeAndComment
                      likeNumber={item?.poemLikeNumber}
                      commentNumber={item?.poemCommentNumber}
                      poemId={item?.id}
                      isLiked={item?.isLiked}
                    />
                  </View>
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
          }}
        >
          <ActivityIndicator size={30} color={colors.mainColor} />
        </View>
      )}
    </View>
  );
}
