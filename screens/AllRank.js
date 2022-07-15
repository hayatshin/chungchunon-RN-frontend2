import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  LogBox,
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

const SEE_ALL_USERS_QUERY = gql`
  query seeAllUsers {
    seeAllUsers {
      id
      name
      avatar
      directFeedNumber
      directLikeNumber
      directCommentNumber
      directPoemNumber
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
  width: ${(props) => props.windowWidth / 4}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function AllRank({ navigation }) {
  const startOfWeek = moment()
    .startOf("week")
    .format("YYYY/MM/DD hh:mm")
    .substring(0, 10);
  const today = moment().format("YYYY/MM/DD hh:mm").substring(0, 10);

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
  const { data: meData, refetch: meRefetch } = useQuery(Me_QUERY);
  const communityExist = meData?.me?.community?.communityName !== "없음";
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

  // 일상, 댓글, 좋아요, 시

  const {
    data: alluserdata,
    loading: alluserlaoding,
    refetch: alluserrefetch,
  } = useQuery(SEE_ALL_USERS_QUERY);

  const [feedClick, setFeedClick] = useState(true);
  const [commentClick, setCommentClick] = useState(false);
  const [likeClick, setLikeClick] = useState(false);
  const [poemClick, setPoemClick] = useState(false);

  const [datafinish, setDatafinish] = useState(false);
  const [data, setData] = useState([]);

  const [myrankOrder, setMyrankOrder] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    meRefetch();
    alluserrefetch();
  }, [screenFocus]);

  useEffect(() => {
    if (alluserdata !== undefined) {
      if (feedClick) {
        setData((oldarray) =>
          [...alluserdata.seeAllUsers].sort(function (a, b) {
            return b.directFeedNumber - a.directFeedNumber;
          })
        );
      } else if (commentClick) {
        setData((oldarray) =>
          [...alluserdata.seeAllUsers].sort(function (a, b) {
            return b.directCommentNumber - a.directCommentNumber;
          })
        );
      } else if (likeClick) {
        setData((oldarray) =>
          [...alluserdata.seeAllUsers].sort(function (a, b) {
            return b.directLikeNumber - a.directLikeNumber;
          })
        );
      } else if (poemClick) {
        setData((oldarray) =>
          [...alluserdata.seeAllUsers].sort(function (a, b) {
            return b.directPoemNumber - a.directPoemNumber;
          })
        );
      }
    }
  }, [alluserdata, feedClick, commentClick, likeClick, poemClick]);

  useEffect(() => {
    setDatafinish(true);
    setMyrankOrder(
      [...data].findIndex((object) => {
        return object.id === meData?.me?.id;
      })
    );
  }, [data]);

  const feedClickFunction = () => {
    setFeedClick(true);
    setCommentClick(false);
    setLikeClick(false);
    setPoemClick(false);
  };

  const commentClickFunction = () => {
    setFeedClick(false);
    setCommentClick(true);
    setLikeClick(false);
    setPoemClick(false);
  };

  const likeClickFunction = () => {
    setFeedClick(false);
    setCommentClick(false);
    setLikeClick(true);
    setPoemClick(false);
  };

  const poemClickFunction = () => {
    meRefetch();
    alluserrefetch();
    setFeedClick(false);
    setCommentClick(false);
    setLikeClick(false);
    setPoemClick(true);
  };

  const refresh = async () => {
    setRefreshing(true);
    await meRefetch();
    await alluserrefetch();
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
        ) : poemClick ? (
          <BodyText>{item.directPoemNumber || 0} 개</BodyText>
        ) : null}
      </View>
    );
  };
  return !datafinish ? (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={30} color={colors.mainColor}></ActivityIndicator>
    </View>
  ) : (
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
          style={{
            borderBottomWidth: feedClick ? 2 : 1,
            borderColor: feedClick ? colors.mainColor : "#ECE7E2",
          }}
        >
          <HeaderText>일상</HeaderText>
        </MenuBox>
        <MenuBox
          windowWidth={windowWidth}
          height={windowHeight}
          onPress={poemClickFunction}
          style={{
            borderBottomWidth: poemClick ? 2 : 1,
            borderColor: poemClick ? colors.mainColor : "#ECE7E2",
          }}
        >
          <HeaderText>시</HeaderText>
        </MenuBox>
        <MenuBox
          windowWidth={windowWidth}
          height={windowHeight}
          onPress={commentClickFunction}
          style={{
            borderBottomWidth: commentClick ? 2 : 1,
            borderColor: commentClick ? colors.mainColor : "#ECE7E2",
          }}
        >
          <HeaderText>댓글</HeaderText>
        </MenuBox>
        <MenuBox
          windowWidth={windowWidth}
          height={windowHeight}
          onPress={likeClickFunction}
          style={{
            borderBottomWidth: likeClick ? 2 : 1,
            borderColor: likeClick ? colors.mainColor : "#ECE7E2",
          }}
        >
          <HeaderText>좋아요</HeaderText>
        </MenuBox>
      </View>
      {/* 순위 리스트 */}
      <FlatList
        data={data}
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
        ) : poemClick ? (
          <BodyText>{meData?.me?.directPoemNumber || 0} 개</BodyText>
        ) : null}
      </View>
    </View>
  );
}
