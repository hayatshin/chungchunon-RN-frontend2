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
import { gql, useQuery } from "@apollo/client";
import { ME_FRAGMENT } from "../fragments";

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
  useEffect(() => {
    navigation.setOptions({});
  }, []);

  const { data: meData } = useQuery(Me_QUERY);

  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const startOfWeek = moment()
    .startOf("week")
    .format("YYYY/MM/DD hh:mm")
    .substring(0, 10);
  const today = moment().format("YYYY/MM/DD hh:mm").substring(0, 10);

  // 일상, 댓글, 좋아요
  const { data: communityFeedData, loading: communityFeedLoading } = useQuery(
    SEE_COMMUNITY_FEED_ORDER,
    {
      variables: {
        id: parseInt(meData?.me?.community?.id),
      },
    }
  );

  const { data: communityCommentData, loading: communityCommentLoading } =
    useQuery(SEE_COMMUNITY_COMMENT_ORDER, {
      variables: {
        id: parseInt(meData?.me?.community?.id),
      },
    });
  const { data: communityLikeData, loading: communityLikeLoading } = useQuery(
    SEE_COMMUNITY_LIKE_ORDER,
    {
      variables: {
        id: parseInt(meData?.me?.community?.id),
      },
    }
  );

  const [feedClick, setFeedClick] = useState(true);
  const [commentClick, setCommentClick] = useState(false);
  const [likeClick, setLikeClick] = useState(false);
  const [flatlistdata, setFlatlistdata] = useState([]);

  useEffect(() => {
    if (feedClick) {
      setFlatlistdata(
        [...communityFeedData.seeCommunityFeedOrder].sort(function (a, b) {
          return b.directFeedNumber - a.directFeedNumber;
        })
      );
    } else if (commentClick) {
      setFlatlistdata(
        [...communityCommentData.seeCommunityCommentOrder].sort(function (
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
  }, [feedClick, commentClick, likeClick]);

  const feedClickFunction = () => {
    setFeedClick(true);
    setCommentClick(false);
    setLikeClick(false);
    // setFlatlistdata(communityFeedData?.seeCommunityFeedOrder);
  };

  const commentClickFunction = () => {
    setFeedClick(false);
    setCommentClick(true);
    setLikeClick(false);
    // setFlatlistdata(communityCommentData?.seeCommunityCommentOrder);
  };

  const likeClickFunction = () => {
    setFeedClick(false);
    setCommentClick(false);
    setLikeClick(true);
    // setFlatlistdata(communityLikeData?.seeCommunityLikeOrder);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 소속기관 헤더 */}
      <View
        style={{
          width: windowWidth,
          height: 60,
          justifyContent: "space-around",
          paddingHorizontal: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
          marginBottom: 15,
        }}
      >
        <Image
          style={{
            width: 100,
            height: 50,
            borderWidth: 1,
            borderColor: colors.lightGray,
            borderRadius: 5,
            marginRight: 20,
          }}
          source={{ uri: meData?.me?.community.communityLogo }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 25, fontWeight: "700" }}>
          {meData?.me?.community?.communityName}
        </Text>
      </View>
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
      {flatlistdata === [] ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={30} color={colors.mainColor} />
        </View>
      ) : (
        <FlatList
          data={flatlistdata}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: windowWidth,
                  height: 60,
                  display: "flex",
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 50,
                }}
              >
                <HeaderText>{index}위</HeaderText>
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
                  <BodyText>{item.directFeedNumber}개</BodyText>
                ) : commentClick ? (
                  <BodyText>{item.directCommentNumber}개</BodyText>
                ) : likeClick ? (
                  <BodyText>{item.directLikeNumber}개</BodyText>
                ) : null}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
