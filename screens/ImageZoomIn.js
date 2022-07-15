import React, { useEffect, useState } from "react";
import {
  Dimensions,
  View,
  ActivityIndicator,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { colors } from "../colors";
import ImageViewer from "react-native-image-zoom-viewer";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function ImageZoomIn({ route, navigation }) {
  const screenFocus = useIsFocused();
  const [dataphotos, setDataphotos] = useState([]);
  const [dataready, setDataready] = useState(false);

  useEffect(() => {
    if (route.params.photosArray) {
      setDataphotos((oldArray) =>
        [...route.params.photosArray].map((photo) => ({
          url: photo,
          width: windowWidth,
          height: windowWidth,
        }))
      );
    } else {
      setDataphotos([
        {
          url: route.params.infoPhoto,
          width: windowWidth,
          height: windowWidth,
        },
      ]);
    }
  }, [screenFocus]);

  useEffect(() => {
    if (dataphotos.length !== 0) {
      setDataready(true);
    }
  }, [dataphotos]);

  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

  return dataready ? (
    <Modal
      visible={true}
      transparent={false}
      animationType="fade"
      statusBarTranslucent={false}
    >
      <View
        style={{ width: windowWidth, height: 25, backgroundColor: "black" }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="md-arrow-back"
            color={colors.lightMain}
            size={25}
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
      </View>
      <ImageViewer
        imageUrls={dataphotos}
        enableImageZoom={true}
        enablePreload={true}
        loadingRender={() => (
          <ActivityIndicator
            name={30}
            color={colors.mainColor}
          ></ActivityIndicator>
        )}
        renderHeader={(index) => null}
        renderArrowLeft={() =>
          dataphotos.length === 1 ? null : (
            <View
              style={{
                marginTop: windowWidth * 1.3,
                marginLeft: 50,
                width: 40,
                height: 40,
                backgroundColor: "rgba(255, 45, 120, 0.6)",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="md-arrow-back" color="white" size={30} />
            </View>
          )
        }
        renderArrowRight={() =>
          dataphotos.length === 1 ? null : (
            <View
              style={{
                marginTop: windowWidth * 1.3,
                marginRight: 50,
                width: 40,
                height: 40,
                backgroundColor: "rgba(255, 45, 120, 0.6)",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="arrow-forward" color="white" size={30} />
            </View>
          )
        }
      />
    </Modal>
  ) : (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <ActivityIndicator color={colors.mainColor} size={30} />
    </View>
  );
}
