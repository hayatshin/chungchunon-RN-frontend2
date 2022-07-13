import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, FlatList, Image } from "react-native";
import moment from "moment";
import styled from "styled-components/native";
import { colors } from "../colors";
import { gql, useQuery } from "@apollo/client";
import { ME_FRAGMENT } from "../fragments";
import { useIsFocused } from "@react-navigation/native";

const Me_QUERY = gql`
  query me {
    me {
      ...MeFragment
    }
  }
  ${ME_FRAGMENT}
`;

const SEE_COMMUNITY_FEED_ORDER = gql`
  query seeCommunityFeedOrder($id: Int!) {
    seeCommunityFeedOrder(id: $id) {
      id
      name
      avatar
      directFeedNumber
    }
  }
`;

const SEE_COMMUNITY_COMMENT_ORDER = gql`
  query seeCommunityCommentOrder($id: Int!) {
    seeCommunityCommentOrder(id: $id) {
      id
      name
      avatar
      directCommentNumber
    }
  }
`;

const SEE_COMMUNITY_LIKE_ORDER = gql`
  query seeCommunityLikeOrder($id: Int!) {
    seeCommunityLikeOrder(id: $id) {
      id
      name
      avatar
      directLikeNumber
    }
  }
`;

const HeaderText = styled.Text`
  font-family: "Spoqa";
  font-size: 18px;
  font-weight: 700;
`;

const BodyText = styled.Text`
  font-family: "Spoqa";
  font-size: 17px;
`;

const MenuBox = styled.TouchableOpacity`
  width: ${(props) => props.windowWidth / 3}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
`;

export default function CommunityRank({ navigation }) {
  const screenFocus = useIsFocused();
  const { data: meData } = useQuery(Me_QUERY);

  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const startOfWeek = moment()
    .startOf("week")
    .format("YYYY/MM/DD hh:mm")
    .substring(0, 10);
  const today = moment().format("YYYY/MM/DD hh:mm").substring(0, 10);

  // 일상, 댓글, 좋아요
  const {
    data: communityFeedData,
    loading: communityFeedLoading,
    refetch: communityFeedRefetch,
  } = useQuery(SEE_COMMUNITY_FEED_ORDER, {
    variables: {
      id: parseInt(meData?.me?.community?.id),
    },
  });

  const { data: communityCommentData } = useQuery(SEE_COMMUNITY_COMMENT_ORDER, {
    variables: {
      id: parseInt(meData?.me?.community?.id),
    },
  });
  const { data: communityLikeData } = useQuery(SEE_COMMUNITY_LIKE_ORDER, {
    variables: {
      id: parseInt(meData?.me?.community?.id),
    },
  });

  const [feedClick, setFeedClick] = useState(true);
  const [commentClick, setCommentClick] = useState(false);
  const [likeClick, setLikeClick] = useState(false);
  const [flatlistdata, setFlatlistdata] = useState([]);
  const [myrankOrder, setMyrankOrder] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!communityFeedLoading) {
      communityFeedRefetch();

      setFlatlistdata(
        [...communityFeedData?.seeCommunityFeedOrder].sort(function (a, b) {
          return b.directFeedNumber - a.directFeedNumber;
        })
      );
    }
  }, []);

  useEffect(() => {
    if (feedClick || screenFocus) {
      setFlatlistdata(
        [...communityFeedData?.seeCommunityFeedOrder].sort(function (a, b) {
          return b.directFeedNumber - a.directFeedNumber;
        })
      );
    } else if (commentClick) {
      setFlatlistdata(
        [...communityCommentData?.seeCommunityCommentOrder].sort(function (
          a,
          b
        ) {
          return b.directCommentNumber - a.directCommentNumber;
        })
      );
    } else if (likeClick) {
      setFlatlistdata(
        [...communityLikeData.seeCommunityLikeOrder].sort(function (a, b) {
          return b.directLikeNumber - a.directLikeNumber;
        })
      );
    }
  }, [screenFocus, feedClick, commentClick, likeClick]);

  useEffect(
    () =>
      setMyrankOrder(
        [...flatlistdata].findIndex((object) => {
          return object.id === meData?.me?.id;
        })
      ),
    [flatlistdata]
  );

  const feedClickFunction = () => {
    setFeedClick(true);
    setCommentClick(false);
    setLikeClick(false);
  };

  const commentClickFunction = () => {
    setFeedClick(false);
    setCommentClick(true);
    setLikeClick(false);
  };

  const likeClickFunction = () => {
    setFeedClick(false);
    setCommentClick(false);
    setLikeClick(true);
  };

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const RankRow = ({ item, index }) => {
    return (
      <View
        style={{
          width: windowWidth,
          height: 60,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 50,
          borderColor: colors.gray,
          marginBottom: 20,
          backgroundColor: "white",
        }}
      >
        <HeaderText>{index + 1}위</HeaderText>
        {/* 이미지와 이름 */}
        <View
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 20,
            }}
            source={{ uri: item.avatar }}
          />
          <HeaderText>{item.name}</HeaderText>
        </View>
        {feedClick ? (
          <BodyText>{item.directFeedNumber || 0} 개</BodyText>
        ) : commentClick ? (
          <BodyText>{item.directCommentNumber || 0} 개</BodyText>
        ) : likeClick ? (
          <BodyText>{item.directLikeNumber || 0} 개</BodyText>
        ) : null}
      </View>
    );
  };

  return flatlistdata === [] ? null : (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 헤더 */}
      <View
        style={{
          width: windowWidth,
          height: windowHeight * 0.1,
          justifyContent: "space-around",
          paddingHorizontal: 20,
          paddingBottom: 15,
        }}
      >
        <HeaderText>주간 순위표</HeaderText>
        <BodyText>
          {startOfWeek} ~ {today}
        </BodyText>
      </View>
      {/* 메뉴 */}
      <View
        style={{
          width: windowWidth,
          height: windowHeight * 0.05,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <MenuBox
          windowWidth={windowWidth}
          height={windowHeight}
          onPress={feedClickFunction}
          feedClick={feedClick}
          style={{
            borderColor: feedClick ? colors.mainColor : colors.lightGray,
          }}
        >
          <HeaderText>일상</HeaderText>
        </MenuBox>
        <MenuBox
          windowWidth={windowWidth}
          height={windowHeight}
          onPress={commentClickFunction}
          commentClick={commentClick}
          style={{
            borderColor: commentClick ? colors.mainColor : colors.lightGray,
          }}
        >
          <HeaderText>댓글</HeaderText>
        </MenuBox>
        <MenuBox
          windowWidth={windowWidth}
          height={windowHeight}
          onPress={likeClickFunction}
          likeClick={likeClick}
          style={{
            borderColor: likeClick ? colors.mainColor : colors.lightGray,
          }}
        >
          <HeaderText>좋아요</HeaderText>
        </MenuBox>
      </View>
      {/* 순위 리스트 */}
      <FlatList
        data={flatlistdata}
        keyExtractor={(item) => item.id}
        renderItem={RankRow}
        refreshing={refreshing}
        onRefresh={refresh}
      />
      {/* 내 순위 */}
      <View
        style={{
          width: windowWidth * 0.9,
          height: 60,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 50,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: colors.gray,
          marginBottom: 20,
          backgroundColor: "white",
        }}
      >
        <HeaderText>{myrankOrder + 1}위</HeaderText>
        {/* 이미지와 이름 */}
        <View
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 20,
            }}
            source={{ uri: meData?.me?.avatar }}
          />
          <HeaderText>{meData?.me?.name}</HeaderText>
        </View>
        {feedClick ? (
          <BodyText>{meData?.me?.directFeedNumber || 0} 개</BodyText>
        ) : commentClick ? (
          <BodyText>{meData?.me?.directCommentNumber || 0} 개</BodyText>
        ) : likeClick ? (
          <BodyText>{meData?.me?.directLikeNumber || 0} 개</BodyText>
        ) : null}
      </View>
    </View>
  );
}
