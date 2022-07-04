import React from "react";
import { Dimensions } from "react-native";
import { colors } from "../colors";
import styled from "styled-components/native";

const BtnBox = styled.View`
  width: ${(props) => props.windowWidth * 0.8}px;
  height: 50px;
  background-color: ${colors.mainColor};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BtnText = styled.Text`
  font-family: "Spoqa";
  font-size: 23px;
  color: white;
  font-weight: 800;
`;

export default function ConfirmBtn({ text }) {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  return (
    <BtnBox windowWidth={windowWidth}>
      <BtnText>{text}</BtnText>
    </BtnBox>
  );
}
