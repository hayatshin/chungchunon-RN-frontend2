import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import styled from "styled-components/native";
import { colors } from "../colors";
import { Ionicons } from "@expo/vector-icons";
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

const SEE_ALL_FEED_ORDER = gql`
  query seeAllFeedOrder {
    seeAllFeedOrder {
      id
      name
      avatar
      directFeedNumber
    }
  }
`;

const SEE_ALL_COMMENT_ORDER = gql`
  query seeAllCommentOrder {
    seeAllCommentOrder {
      id
      name
      avatar
      directCommentNumber
    }
  }
`;

const SEE_ALL_LIKE_ORDER = gql`
  query seeAllLikeOrder {
    seeAllLikeOrder {
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

export default function AllRank({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return communityExist ? (
          <TouchableOpacity
            style={{ display: "flex", flexDirection: "row" }}
            onPress={() => navigation.navigate("CommunityRank")}
          >
            <HeaderText style={{ color: colors.mainColor }}>
              소속 기관 순위 보기
            </HeaderText>
            <Ionicons name="arrow-forward" size={25} color={colors.mainColor} />
          </TouchableOpacity>
        ) : (
          <View>
            <HeaderText style={{ color: colors.gray }}>
              소속된 기관이 없습니다
            </HeaderText>
          </View>
        );
      },
    });
  }, []);

  const screenFocus = useIsFocused();
  const { data: meData } = useQuery(Me_QUERY);
  const communityExist = meData?.me?.community?.communityName !== "없음";
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const startOfWeek = moment()
    .startOf("week")
    .format("YYYY/MM/DD hh:mm")
    .substring(0, 10);
  const today = moment().format("YYYY/MM/DD hh:mm").substring(0, 10);

  // 일상, 댓글, 좋아요

  const {
    data: allFeedData,
    loading: allFeedLoading,
    refetch: allFeedRefetch,
  } = useQuery(SEE_ALL_FEED_ORDER);
  const { data: allCommentData } = useQuery(SEE_ALL_COMMENT_ORDER);
  const { data: allLikeData } = useQuery(SEE_ALL_LIKE_ORDER);

  const [feedClick, setFeedClick] = useState(true);
  const [commentClick, setCommentClick] = useState(false);
  const [likeClick, setLikeClick] = useState(false);
  const [flatlistdata, setFlatlistdata] = useState([]);
  const [myrankOrder, setMyrankOrder] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!allFeedLoading) {
      allFeedRefetch();
      setFlatlistdata(
        [...allFeedData.seeAllFeedOrder].sort(function (a, b) {
          return b.directFeedNumber - a.directFeedNumber;
        })
      );
    }
  }, []);

  useEffect(() => {
    if (feedClick || screenFocus) {
      setFlatlistdata(
        [...allFeedData.seeAllFeedOrder].sort(function (a, b) {
          return b.directFeedNumber - a.directFeedNumber;
        })
      );
    } else if (commentClick) {
      setFlatlistdata(
        [...allCommentData.seeAllCommentOrder].sort(function (a, b) {
          return b.directCommentNumber - a.directCommentNumber;
        })
      );
    } else if (likeClick) {
      setFlatlistdata(
        [...allLikeData.seeAllLikeOrder].sort(function (a, b) {
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
