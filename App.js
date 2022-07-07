import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo";
import { Provider, useSelector } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import HomeNav from "./navigators/HomeNav";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        const fontsToLoad = [
          Ionicons.font,
          { Spoqa: require("./assets/fonts/SpoqaHanSansNeo-Regular.otf") },
        ];
        const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
        const imagesToLoad = [
          require("./assets/images/ch-logo.gif"),
          require("./assets/images/kakao_login.png"),
        ];
        const imagePromises = imagesToLoad.map((image) =>
          Asset.loadAsync(image)
        );
        await new Promise.all(
          [...fontPromises, ...imagePromises],
          (resolve) => {
            return setTimeout(resolve, 2000);
          }
        );
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <View onLayout={onLayoutRootView}></View>
            <HomeNav />
            {/* {loggedIn ? <LoggedInNav /> : <LoggedoutNav />} */}
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
}
