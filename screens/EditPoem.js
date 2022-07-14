import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { colors } from "../colors";
import ImageSwiper from "../components/ImageSwiper";
import SmallBtn from "../components/SmallBtn";
import { POEM_FRAGMENT } from "../fragments";
import { useRoute } from "@react-navigation/native";

const SEE_CERTAIN_POEM_QUERY = gql`
  query seeCertainPoem($id: Int!) {
    seeCertainPoem(id: $id) {
      ...PoemFragement
    }
  }
  ${POEM_FRAGMENT}
`;

const EDIT_POEM_MUTATION = gql`
  mutation editPoem($id: Int!, $poemTitle: String, $poemCaption: String) {
    editPoem(id: $id, poemTitle: $poemTitle, poemCaption: $poemCaption) {
      ok
      error
    }
  }
`;

export default function EditPoem({ route, navigation }) {
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [titleClick, setTitleClick] = useState(false);
  const [captionClick, setCaptionClick] = useState(false);
  const poemId = route?.params?.poemId;
  const routename = useRoute().name;

  const { data: seeCertainPoemData } = useQuery(SEE_CERTAIN_POEM_QUERY, {
    variables: {
      id: parseInt(poemId),
    },
  });

  const onUpdateEdit = (cache, result) => {
    const {
      data: {
        editPoem: { ok },
      },
    } = result;
    if (ok) {
      const cachePoemId = `Poem:${poemId}`;
      cache.modify({
        id: cachePoemId,
        fields: {
          poemTitle(prev) {
            return title;
          },
          poemCaption(prev) {
            return caption;
          },
        },
      });
      navigation.goBack();
    }
  };

  const [editPoemMutation] = useMutation(EDIT_POEM_MUTATION, {
    variables: {
      id: parseInt(poemId),
      poemTitle: title,
      poemCaption: caption,
    },
    update: onUpdateEdit,
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <SmallBtn
            text={"수정 완료"}
            color={"main"}
            pressFunction={editPoemMutation}
          />
        );
      },
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: windowWidth, height: 50 }}></View>
        {/* 제목 쓰기 창 */}
        <TextInput
          onFocus={() => setTitleClick(true)}
          onBlur={() => setTitleClick(false)}
          onChangeText={(text) => setTitle(text)}
          onSubmitEditing={(text) => setTitle(text)}
          defaultValue={seeCertainPoemData?.seeCertainPoem?.poemTitle}
          style={{
            height: 80,
            width: "85%",
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 2,
            borderColor: titleClick ? colors.mainColor : colors.lightGray,
            paddingHorizontal: 30,
            fontSize: 25,
            fontFamily: "Spoqa",
            marginBottom: 50,
          }}
        />

        {/* 시 쓰기 창 */}
        <TextInput
          onFocus={() => setCaptionClick(true)}
          onBlur={() => setCaptionClick(false)}
          onChangeText={(text) => setCaption(text)}
          onSubmitEditing={(text) => setCaption(text)}
          defaultValue={seeCertainPoemData?.seeCertainPoem?.poemCaption}
          style={{
            height: 500,
            width: "85%",
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 2,
            borderColor: captionClick ? colors.mainColor : colors.lightGray,
            padding: 30,
            fontSize: 25,
            fontFamily: "Spoqa",
            textAlignVertical: "top",
          }}
          multiline={true}
        ></TextInput>
      </ScrollView>
    </SafeAreaView>
  );
}
