import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import styled from "styled-components/native";
import { colors } from "../colors";
import { POEM_COMMENT_FRAGMENT } from "../fragments";
import { koreaDate } from "../koreaDate";

const CommnetBox = styled.View`
  width: ${(props) => props.windowWidth}px;
  height: ${(props) =>
    props.inputClick ? props.windowHeight * 0.5 : props.windowHeight * 0.8}px;
  background-color: white;
  position: absolute;
  bottom: 0px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`;

const AnimatedCommentBox = Animated.createAnimatedComponent(CommnetBox);

const NoCommentBox = styled.View`
  width: ${(props) => props.windowWidth}px;
  height: ${(props) => props.windowHeight * 0.3}px;
  background-color: white;
  position: absolute;
  bottom: 0px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 60px;
`;

const AnimatedNoCommentBox = Animated.createAnimatedComponent(NoCommentBox);

const SEE_COMMENTS_QUERY = gql`
  query seePoemComments($id: Int!) {
    seePoemComments(id: $id) {
      ...PoemCommentFragment
    }
  }
  ${POEM_COMMENT_FRAGMENT}
`;

const ME_QUERY = gql`
  query me {
    me {
      name
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createPoemComment($poemId: Int!, $payload: String!) {
    createPoemComment(poemId: $poemId, payload: $payload) {
      ...PoemCommentFragment
    }
  }
  ${POEM_COMMENT_FRAGMENT}
`;

const EDIT_COMMENT_MUTATION = gql`
  mutation editPoemComment($id: Int!, $payload: String!) {
    editPoemComment(id: $id, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deletePoemComment($id: Int!) {
    deletePoemComment(id: $id) {
      ok
      id
      error
    }
  }
`;

export default function PoemComment({ route, navigation }) {
  //  댓글창 애니메이션
  const animateY = useRef(new Animated.Value(500)).current;
  const goUpY = Animated.timing(animateY, {
    toValue: 0,
    duration: 400,
    useNativeDriver: true,
  });

  useEffect(() => {
    goUpY.start();
  }, []);

  const commentRef = useRef();
  const [inputClick, setInputClick] = useState(false);
  const [commentPayload, setCommentPayload] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [prevPayload, setPrevPayload] = useState("");
  const [commentSortArray, setCommentSortArray] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  const { data: meData } = useQuery(ME_QUERY);
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

  const { data: commentData, refetch } = useQuery(SEE_COMMENTS_QUERY, {
    variables: {
      id: parseInt(route?.params?.poemId),
    },
  });

  useEffect(() => {
    setCommentLoading(false);
  }, []);

  useEffect(() => {
    setCommentSortArray(commentData?.seePoemComments);
  }, [commentData, commentLoading]);

  useEffect(() => {
    if (commentSortArray !== undefined && commentSortArray !== null) {
      setCommentLoading(true);
    }
  }, [commentSortArray]);

  useEffect(() => {
    setCommentLoading(false);
  }, [navigation]);

  const onUpdateComment = (cache, result) => {
    const {
      data: { createPoemComment },
    } = result;
    if (createPoemComment.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seePoemComments(prev) {
            return [...prev, createPoemComment];
          },
        },
        id: `Poem:${route?.params?.poemId}`,
        fields: {
          poemCommentNumber(prev) {
            return prev + 1;
          },
        },
      });
      cache.modify({
        id: `Feedpoem:${route?.params?.poemId}`,
        fields: {
          poemCommentNumber(prev) {
            return prev + 1;
          },
        },
      });
      refetch();
      commentRef.current.clear();
    }
  };
  const [createCommentMutation] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: {
      poemId: parseInt(route?.params?.poemId),
      payload: commentPayload,
    },
    update: onUpdateComment,
  });

  const onEditCommentUpdate = async (cache, result) => {
    const {
      data: { editPoemComment },
    } = result;
    if (editPoemComment.id) {
      const cacheCommentId = `Poemcomment:${editPoemComment.id}`;
      await cache.modify({
        id: cacheCommentId,
        fields: {
          payload(prev) {
            return commentPayload;
          },
        },
      });
    }
    setPrevPayload("");
    setEditCommentId(null);
  };

  const onDeleteCommentUpdate = (cache, result) => {
    const {
      data: { deletePoemComment },
    } = result;
    if (deletePoemComment.id) {
      const cacheCommentId = `Poemcomment:${deletePoemComment.id}`;
      const cachePoemId = `Poem:${route.params.poemId}`;
      const cacheFpId = `Feedpoem:${route.params.poemId}`;

      cache.evict({
        id: cacheCommentId,
      });
      cache.modify({
        id: cachePoemId,
        fields: {
          poemCommentNumber(prev) {
            return prev - 1;
          },
        },
      });
      cache.modify({
        id: cacheFpId,
        fields: {
          poemCommentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    update: onDeleteCommentUpdate,
  });

  const [editCommentMutation] = useMutation(EDIT_COMMENT_MUTATION, {
    variables: { id: parseInt(editCommentId), payload: commentPayload },
    update: onEditCommentUpdate,
  });
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <Pressable
      onPress={dismissKeyboard}
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* 댓글 흰 배경 */}
      {commentLoading ? (
        commentSortArray.length !== 0 ? (
          <AnimatedCommentBox
            style={{
              transform: [{ translateY: animateY }],
            }}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            inputClick={inputClick}
          >
            {/* 댓글 */}
            <FlatList
              contentContainerStyle={{
                marginTop: 20,
                marginHorizontal: 20,
                paddingBottom: 80,
              }}
              showsVerticalScrollIndicator={true}
              data={[...commentSortArray].reverse()}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const commentCreateTime = koreaDate(item.createdAt);
                const meCheck = meData?.me?.name === item?.user?.name;
                const editClickFunction = (text) => {
                  setPrevPayload(item.payload);
                  setEditCommentId(item.id);
                };

                return (
                  <View
                    style={{
                      width: windowWidth,
                      paddingVertical: 10,
                      flex: 1,
                      justifyContent: "space-between",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {/* 작성자 사진 */}
                    <Image
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 24,
                      }}
                      source={{ uri: item.user.avatar }}
                    />
                    <View
                      style={{
                        width: parseInt(windowWidth) - 50,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: parseInt(windowWidth) - 90,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-end",
                          justifyContent: "space-between",
                          marginBottom: 10,
                        }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "flex-end",
                          }}
                        >
                          {/* 이름 */}
                          <Text
                            style={{
                              fontFamily: "Spoqa",
                              fontWeight: "700",
                              fontSize: 20,
                              marginRight: 15,
                            }}
                          >
                            {item.user.name}
                          </Text>
                          {/* 작성 시간 */}
                          <Text
                            style={{
                              fontFamily: "Spoqa",
                              color: colors.gray,
                              fontSize: 13,
                            }}
                          >
                            {commentCreateTime}
                          </Text>
                        </View>
                        {/* 수정 및 삭제 */}
                        {meCheck ? (
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <TouchableOpacity onPress={editClickFunction}>
                              <Text
                                style={{
                                  fontFamily: "Spoqa",
                                  fontSize: 19,
                                  fontWeight: "700",
                                  color: colors.gray,
                                  marginRight: 10,
                                }}
                              >
                                수정
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                deleteCommentMutation({
                                  variables: { id: parseInt(item.id) },
                                })
                              }
                            >
                              <Text
                                style={{
                                  fontFamily: "Spoqa",
                                  fontSize: 19,
                                  fontWeight: "700",
                                  color: colors.mainColor,
                                }}
                              >
                                삭제
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}

                        {/* 댓글 */}
                      </View>
                      <Text
                        style={{
                          width: parseInt(windowWidth) - 50,
                          fontFamily: "Spoqa",
                          fontSize: 18,
                        }}
                      >
                        {item.payload}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
            {/* 댓글 작성 */}
            <View
              style={{
                width: windowWidth,
                height: 60,
                position: "absolute",
                bottom: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "white",
                paddingBottom: 0,
              }}
            >
              <TextInput
                ref={commentRef}
                onFocus={() => setInputClick(true)}
                onBlur={() => setInputClick(false)}
                onChangeText={(text) => setCommentPayload(text)}
                defaultValue={prevPayload === "" ? null : prevPayload}
                style={{
                  width: windowWidth * 0.7,
                  height: 40,
                  borderWidth: 1,
                  borderColor:
                    inputClick || prevPayload !== ""
                      ? colors.mainColor
                      : "black",
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  fontSize: 20,
                }}
              />
              <TouchableOpacity
                onPress={
                  editCommentId === null
                    ? createCommentMutation
                    : editCommentMutation
                }
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: windowWidth * 0.15,
                  height: 40,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Spoqa",
                    fontSize: 20,
                    color: "black",
                  }}
                >
                  작성
                </Text>
              </TouchableOpacity>
            </View>
          </AnimatedCommentBox>
        ) : (
          <AnimatedNoCommentBox
            style={{
              transform: [{ translateY: animateY }],
            }}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
          >
            <Text
              style={{ fontFamily: "Spoqa", fontSize: 20, fontWeight: "700" }}
            >
              댓글이 없습니다
            </Text>
            {/* 댓글 작성 */}
            <View
              style={{
                width: windowWidth,
                height: 60,
                position: "absolute",
                bottom: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "white",
                paddingBottom: 0,
              }}
            >
              <TextInput
                ref={commentRef}
                onFocus={() => setInputClick(true)}
                onBlur={() => setInputClick(false)}
                onChangeText={(text) => setCommentPayload(text)}
                defaultValue={prevPayload === "" ? null : prevPayload}
                style={{
                  width: windowWidth * 0.7,
                  height: 40,
                  borderWidth: 1,
                  borderColor:
                    inputClick || prevPayload !== ""
                      ? colors.mainColor
                      : "black",
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  fontSize: 20,
                }}
              />
              <TouchableOpacity
                onPress={
                  editCommentId === null
                    ? createCommentMutation
                    : editCommentMutation
                }
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: windowWidth * 0.15,
                  height: 40,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Spoqa",
                    fontSize: 20,
                    color: "black",
                  }}
                >
                  작성
                </Text>
              </TouchableOpacity>
            </View>
          </AnimatedNoCommentBox>
        )
      ) : (
        <AnimatedNoCommentBox
          style={{
            transform: [{ translateY: animateY }],
          }}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
        >
          <ActivityIndicator size={30} color={colors.mainColor} />
        </AnimatedNoCommentBox>
      )}
    </Pressable>
  );
}
