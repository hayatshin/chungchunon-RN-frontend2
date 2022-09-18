import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "../colors";

const ME_QUERY = gql`
  query me {
    me {
      id
      avatar
      age
      master
    }
  }
`;

export default function PoemNotiBox() {
  const { data } = useQuery(ME_QUERY);
  const [underfiftyclick, setUnderfiftyclick] = useState(false);
  const navigation = useNavigation();
  const FiftyValidation = () => {
    data?.me?.age >= 50 || data.me.master
      ? navigation.navigate("WritePoem")
      : setUnderfiftyclick(true);
  };

  return (
    <View
      style={{
        width: "100%",
        height: 80,
        marginBottom: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 최대 박스 */}
      <TouchableOpacity
        onPress={FiftyValidation}
        disabled={underfiftyclick}
        style={{
          width: "100%",
          height: 80,
          backgroundColor: "white",
          borderColor: colors.gray,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {underfiftyclick ? (
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontFamily: "Spoqa", fontSize: 20, fontWeight: "700" }}
            >
              50세 이하는 글쓰기가 불가능합니다.
            </Text>
          </View>
        ) : (
          <>
            {/* 로그인 유저 사진 */}
            <View
              style={{
                width: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingHorizontal: 15,
              }}
            >
              <Image
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                }}
                source={{ uri: data?.me?.avatar }}
              />
            </View>
            {/* 글쓰기창 */}
            <View
              style={{
                width: "80%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "85%",
                  height: 40,
                  backgroundColor: "white",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.gray,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Spoqa",
                    fontSize: 20,
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  시 한편을 지어주세요.
                </Text>
              </View>
            </View>
          </>
        )}
      </TouchableOpacity>
      {/* 경계 */}
      <View
        style={{
          width: "100%",
          height: 10,
          backgroundColor: colors.lightGray,
        }}
      ></View>
    </View>
  );
}
