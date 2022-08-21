import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
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

const SEE_COMMUNNITY_USERS_QUERY = gql`
  query seeCommunityUsers($id: Int!) {
    seeCommunityUsers(id: $id) {
      id
      name
      avatar
      thisweekLikeNumber
      thisweekCommentNumber
      thisweekFeedNumber
      thisweekPoemNumber
      lastweekLikeNumber
      lastweekCommentNumber
      lastweekFeedNumber
      lastweekPoemNumber
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

export default function CommunityRank({ navigation }) {
  const screenFocus = useIsFocused();
  const { data: meData, refetch: meRefetch } = useQuery(Me_QUERY);

  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const startOfWeek = moment()
    .startOf("week")
    .format("YYYY/MM/DD hh:mm")
    .substring(0, 10);
  const today = moment().format("YYYY/MM/DD hh:mm").substring(0, 10);

  // 일상, 댓글, 좋아요, 시

  const {
    data: communitydata,
    loading: communityloading,
    refetch: communityrefetch,
  } = useQuery(SEE_COMMUNNITY_USERS_QUERY, {
    variables: {
      id: parseInt(meData?.me?.community?.id),
    },
  });

  const [thisweekClick, setThisweekClick] = useState(true);
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
    communityrefetch();
  }, [screenFocus]);

  useEffect(() => {
    const result = [];
    let index = 1;
    if (communitydata !== undefined) {
      if (thisweekClick && feedClick) {
        const sort = [...communitydata.seeCommunityUsers].sort(function (a, b) {
          return b.thisweekFeedNumber - a.thisweekFeedNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.thisweekFeedNumber !== current.thisweekFeedNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (thisweekClick && commentClick) {
        const sort = [...communitydata.seeCommunityUsers].sort(function (a, b) {
          return b.thisweekCommentNumber - a.thisweekCommentNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (
            sort[n + 1]?.thisweekCommentNumber !== current.thisweekCommentNumber
          ) {
            ++index;
          }
        }
        setData(result);
      } else if (thisweekClick && likeClick) {
        const sort = [...communitydata.seeCommunityUsers].sort(function (a, b) {
          return b.thisweekLikeNumber - a.thisweekLikeNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.thisweekLikeNumber !== current.thisweekLikeNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (thisweekClick && poemClick) {
        const sort = [...communitydata.seeCommunityUsers].sort(function (a, b) {
          return b.thisweekPoemNumber - a.thisweekPoemNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.thisweekPoemNumber !== current.thisweekPoemNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (!thisweekClick && feedClick) {
        const sort = [...communitydata.seeCommunityUsers].sort(function (a, b) {
          return b.lastweekFeedNumber - a.lastweekFeedNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.lastweekFeedNumber !== current.lastweekFeedNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (!thisweekClick && commentClick) {
        const sort = [...communitydata.seeCommunityUsers].sort(function (a, b) {
          return b.lastweekCommentNumber - a.lastweekCommentNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (
            sort[n + 1]?.lastweekCommentNumber !== current.lastweekCommentNumber
          ) {
            ++index;
          }
        }
        setData(result);
      } else if (!thisweekClick && likeClick) {
        const sort = [...communitydata.seeCommunityUsers].sort(function (a, b) {
          return b.lastweekLikeNumber - a.lastweekLikeNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.lastweekLikeNumber !== current.lastweekLikeNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (!thisweekClick && poemClick) {
        const sort = [...communitydata.seeCommunityUsers].sort(function (a, b) {
          return b.lastweekPoemNumber - a.lastweekPoemNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.lastweekPoemNumber !== current.lastweekPoemNumber) {
            ++index;
          }
        }
        setData(result);
      }
    }
  }, [
    communitydata,
    feedClick,
    commentClick,
    likeClick,
    poemClick,
    thisweekClick,
  ]);

  useEffect(() => {
    setDatafinish(true);
    const myOrder = () => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === meData.me.id) {
          return data[i]?.index;
        }
      }
    };
    setMyrankOrder(myOrder);
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
    setFeedClick(false);
    setCommentClick(false);
    setLikeClick(false);
    setPoemClick(true);
  };

  const refresh = async () => {
    setRefreshing(true);
    await meRefetch();
    await communityrefetch();
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
        <HeaderText>{item?.index}위</HeaderText>
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
              marginRight: 15,
            }}
            source={{ uri: item.avatar }}
          />
          <HeaderText>{item.name}</HeaderText>
        </View>
        {thisweekClick && feedClick ? (
          <BodyText>{item.thisweekFeedNumber || 0} 개</BodyText>
        ) : thisweekClick && commentClick ? (
          <BodyText>{item.thisweekCommentNumber || 0} 개</BodyText>
        ) : thisweekClick && likeClick ? (
          <BodyText>{item.thisweekLikeNumber || 0} 개</BodyText>
        ) : thisweekClick && poemClick ? (
          <BodyText>{item.thisweekPoemNumber || 0} 개</BodyText>
        ) : !thisweekClick && feedClick ? (
          <BodyText>{item.lastweekFeedNumber || 0} 개</BodyText>
        ) : !thisweekClick && commentClick ? (
          <BodyText>{item.lastweekCommentNumber || 0} 개</BodyText>
        ) : !thisweekClick && likeClick ? (
          <BodyText>{item.lastweekLikeNumber || 0} 개</BodyText>
        ) : !thisweekClick && poemClick ? (
          <BodyText>{item.lastweekPoemNumber || 0} 개</BodyText>
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
      {/* 소속 기관 */}
      <View
        style={{
          width: windowWidth,
          paddingVertical: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 150,
            height: 60,
            borderWidth: 1,
            borderColor: colors.lightGray,
            borderRadius: 5,
            marginRight: 15,
          }}
        >
          <Image
            style={{ flex: 1 }}
            source={{ uri: meData?.me?.community.communityLogo }}
            resizeMode="contain"
          />
        </View>
        <Text style={{ fontFamily: "Spoqa", fontSize: 20, fontWeight: "700" }}>
          {meData?.me?.community.communityName}
        </Text>
      </View>
      {/* 헤더 */}
      <View
        style={{
          width: windowWidth,
          justifyContent: "space-around",
          paddingHorizontal: 20,
          paddingBottom: 15,
        }}
      >
        <HeaderText>주간 순위표</HeaderText>
        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            windowWidth: windowWidth * 0.8,
            height: 40,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.mainColor,
          }}
        >
          <TouchableOpacity
            onPress={() => setThisweekClick(true)}
            style={{
              flex: 1,
              height: thisweekClick ? 40 : null,
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              backgroundColor: thisweekClick ? colors.mainColor : "white",
            }}
          >
            <BodyText style={{ color: thisweekClick ? "white" : "black" }}>
              이번주
            </BodyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setThisweekClick(false)}
            style={{
              flex: 1,
              height: thisweekClick ? null : 40,
              justifyContent: "center",
              alignItems: "center",
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: thisweekClick ? "white" : colors.mainColor,
            }}
          >
            <BodyText style={{ color: thisweekClick ? "black" : "white" }}>
              지난주
            </BodyText>
          </TouchableOpacity>
        </View>
      </View>
      {/* 메뉴 */}
      <View
        style={{
          width: windowWidth,
          height: windowHeight * 0.05,
          display: "flex",
          flexDirection: "row",
          marginBottom: 15,
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
        <HeaderText>{myrankOrder}위</HeaderText>
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
              marginRight: 15,
            }}
            source={{ uri: meData?.me?.avatar }}
          />
          <HeaderText>{meData?.me?.name}</HeaderText>
        </View>
        {thisweekClick && feedClick ? (
          <BodyText>{meData?.me?.thisweekFeedNumber || 0} 개</BodyText>
        ) : thisweekClick && commentClick ? (
          <BodyText>{meData?.me?.thisweekCommentNumber || 0} 개</BodyText>
        ) : thisweekClick && likeClick ? (
          <BodyText>{meData?.me?.thisweekLikeNumber || 0} 개</BodyText>
        ) : thisweekClick && poemClick ? (
          <BodyText>{meData?.me?.thisweekPoemNumber || 0} 개</BodyText>
        ) : !thisweekClick && feedClick ? (
          <BodyText>{meData?.me?.lastweekFeedNumber || 0} 개</BodyText>
        ) : !thisweekClick && commentClick ? (
          <BodyText>{meData?.me?.lastweekCommentNumber || 0} 개</BodyText>
        ) : !thisweekClick && likeClick ? (
          <BodyText>{meData?.me?.lastweekLikeNumber || 0} 개</BodyText>
        ) : !thisweekClick && poemClick ? (
          <BodyText>{meData?.me?.lastweekPoemNumber || 0} 개</BodyText>
        ) : null}
      </View>
    </View>
  );
}
