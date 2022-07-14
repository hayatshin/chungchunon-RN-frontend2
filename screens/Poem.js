import { gql, useQuery } from "@apollo/client";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, FlatList } from "react-native";
import { colors } from "../colors";
import PoemLikeAndComment from "../components/PoemLikeAndComment";
import PoemNotiBox from "../components/PoemNotiBox";
import PoemWriterBox from "../components/PoemWriterBox";
import WriterBox from "../components/WriterBox";
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
  const { width: windowWidth } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);

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
  }, [screenFocus]);

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
      <FlatList
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
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
        data={poemData?.seeAllPoems}
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
                style={{ width: windowWidth, padding: 15, marginBottom: 20 }}
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
        }}
      />
    </View>
  );
}
