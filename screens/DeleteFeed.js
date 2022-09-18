import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "../colors";

const DELETE_FEED_MUTATION = gql`
  mutation deleteFeed($id: Int!) {
    deleteFeed(id: $id) {
      ok
      error
    }
  }
`;

const DELETE_POEM_MUTATION = gql`
  mutation deletePoem($id: Int!) {
    deletePoem(id: $id) {
      ok
      error
    }
  }
`;

export default function DeleteFeed({ navigation, route }) {
  const feedId = route?.params?.feedId;
  const poemId = route?.params?.poemId;
  const [deleteloading, setDeleteloading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <View></View>,
    });
  }, []);

  // delete feed
  const onUpdateFeedDelete = (cache, result) => {
    const {
      data: {
        deleteFeed: { ok },
      },
    } = result;
    if (ok) {
      const cacheFeedId = `Feed:${feedId}`;
      cache.evict({
        id: cacheFeedId,
      });
      cache.evict({
        id: "ROOT_QUERY",
        fields: {
          seeAllFeeds(prev) {
            return [...prev.filter((item) => item.__ref !== cacheFeedId)];
          },
        },
      });
    }
    navigation.goBack();
  };

  const onUpdatePoemDelete = (cache, result) => {
    const {
      data: {
        deletePoem: { ok },
      },
    } = result;
    if (ok) {
      const cachePoemId = `Poem:${feedId}`;
      cache.evict({
        id: cachePoemId,
      });
      cache.evict({
        id: "ROOT_QUERY",
        fields: {
          seeAllPoems(prev) {
            return [...prev.filter((item) => item.__ref !== cachePoemId)];
          },
        },
      });
    }
    setDeleteloading(false);
    navigation.goBack();
  };

  const [deleteFeedMutation] = useMutation(DELETE_FEED_MUTATION, {
    update: onUpdateFeedDelete,
  });

  const [deletePoemMutation] = useMutation(DELETE_POEM_MUTATION, {
    update: onUpdatePoemDelete,
  });

  const cancelClick = () => {
    navigation.goBack();
  };

  const deleteConfirmClick = () => {
    setDeleteloading(true);
    if (feedId) {
      deleteFeedMutation({
        variables: { id: parseInt(feedId) },
      });
    } else {
      deletePoemMutation({
        variables: { id: parseInt(poemId) },
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "60%",
          height: "20%",
          backgroundColor: "white",
          borderRadius: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 2,
          }}
        >
          <Text
            style={{
              fontFamily: "Spoqa",
              fontWeight: "700",
              textAlign: "center",
              fontSize: 17,
            }}
          >
            이 게시물을
          </Text>
          <Text
            style={{
              fontFamily: "Spoqa",
              fontWeight: "700",
              textAlign: "center",
              fontSize: 17,
            }}
          >
            정말 삭제하시겠습니까?
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", flex: 1 }}>
          <TouchableOpacity
            onPress={deleteConfirmClick}
            style={{ width: "50%" }}
          >
            {deleteloading ? (
              <ActivityIndicator size={30} color={colors.mainColor} />
            ) : (
              <Text
                style={{
                  fontFamily: "Spoqa",
                  fontWeight: "700",
                  textAlign: "center",
                  color: colors.mainColor,
                  fontSize: 15,
                }}
              >
                삭제
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelClick} style={{ width: "50%" }}>
            <Text
              style={{
                fontFamily: "Spoqa",
                textAlign: "center",
                fontSize: 15,
                color: colors.gray,
              }}
            >
              삭제 안 함
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
