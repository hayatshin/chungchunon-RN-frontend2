import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import ImageSwiper from "../components/ImageSwiper";
import SmallBtn from "../components/SmallBtn";
import { ReactNativeFile } from "apollo-upload-client";
import { colors } from "../colors";
import { ME_FRAGMENT } from "../fragments";

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

  const updateUploadPoem = async (cache, result) => {
    const {
      data: { createPoem },
    } = result;
    if (createPoem.id) {
      await cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeAllPoems(prev) {
            return [createPoem, ...prev];
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
        return (
          <SmallBtn
            text={"확인"}
            color={"main"}
            pressFunction={onUploadPress}
          />
        );
      },
    });
  }, []);

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
              width: windowWidth * 0.8,
              paddingVertical: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.brown,
              borderRadius: 5,
              marginTop: 10,
              marginBottom: 30,
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
