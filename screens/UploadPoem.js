import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import ImageSwiper from "../components/ImageSwiper";
import SmallBtn from "../components/SmallBtn";
import { ReactNativeFile } from "apollo-upload-client";
import { colors } from "../colors";
import { ME_FRAGMENT } from "../fragments";
import { feedAddVar } from "../apollo";

const ME_QUERY = gql`
  query me {
    me {
      ...MeFragment
    }
  }
  ${ME_FRAGMENT}
`;

const UPLOAD_POEM_MUTATION = gql`
  mutation createPoem($poemTitle: String!, $poemCaption: String!) {
    createPoem(poemTitle: $poemTitle, poemCaption: $poemCaption) {
      id
      poemTitle
      poemCaption
    }
  }
`;

export default function UploadPoem({ route, navigation }) {
  const poemTitle = route?.params?.title;
  const poemCaption = route?.params?.caption;

  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const [uploadWait, setUploadwait] = useState(false);

  const updateUploadPoem = async (cache, result) => {
    const {
      data: { createPoem },
    } = result;
    const certainPoemFragment = { ...createPoem };
    certainPoemFragment.__typename = "Feedpoem";
    if (createPoem.id) {
      await cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeAllPoems(prev) {
            return [createPoem, ...prev];
          },
          seeMeFeedPoem(prev) {
            return [certainPoemFragment, ...prev];
          },
        },
      });
      navigation.navigate("Tabs", { screen: "시" });
    }
  };

  const { data: meData } = useQuery(ME_QUERY);
  const [uploadPoemMutation] = useMutation(UPLOAD_POEM_MUTATION, {
    update: updateUploadPoem,
  });

  const onUploadPress = () => {
    setUploadwait(true);
    uploadPoemMutation({
      variables: {
        poemTitle,
        poemCaption,
      },
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return uploadWait ? (
          <ActivityIndicator color={colors.mainColor} size={30} />
        ) : (
          <SmallBtn
            text={"확인"}
            color={"main"}
            pressFunction={onUploadPress}
          />
        );
      },
    });
  }, [uploadWait]);

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ padding: 15, height: windowWidth * 0.5 }}
        >
          <View
            style={{
              width: windowWidth * 0.9,
              paddingVertical: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#C69978",
              borderRadius: 2,
              marginTop: 10,
              marginBottom: 30,
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
                {poemTitle}
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
                {meData?.me?.name}
              </Text>
              <Text style={{ fontFamily: "Spoqa", fontSize: 17 }}>
                {poemCaption}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
