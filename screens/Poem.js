import { gql, useQuery } from "@apollo/client";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { colors } from "../colors";
import PoemLikeAndComment from "../components/PoemLikeAndComment";
import PoemNotiBox from "../components/PoemNotiBox";
import PoemWriterBox from "../components/PoemWriterBox";
import { POEM_FRAGMENT } from "../fragments";

const SEE_ALL_POEMS_QUERY = gql`
  query seeAllPoems($offset: Int!) {
    seeAllPoems(offset: $offset) {
      ...PoemFragement
    }
  }
  ${POEM_FRAGMENT}
`;

export default function Poem() {
  const screenFocus = useIsFocused();
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);

  const {
    data: poemData,
    refetch,
    fetchMore,
  } = useQuery(SEE_ALL_POEMS_QUERY, {
    variables: {
      offset: 0,
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (poemData !== null && poemData !== undefined) {
      setData(
        [...poemData?.seeAllPoems].sort(function (a, b) {
          return b.createdAt - a.createdAt;
        })
      );
    }
  }, [poemData]);

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

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "white",
      }}
    >
      <PoemNotiBox />
      {dataLoading ? (
        data.length !== 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.3}
            onEndReached={() =>
              fetchMore({
                variables: {
                  offset: poemData?.seeAllPoems?.length,
                },
              })
            }
            refreshing={refreshing}
            onRefresh={refresh}
            keyExtractor={(feed) => feed?.id}
            data={data}
            renderItem={({ item }) => {
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
