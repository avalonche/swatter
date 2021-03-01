import React, { useEffect, View, Text } from "react";
import { enableScreens } from "react-native-screens";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { MainNavigator } from "./navigation";
import { Login } from "./screens";
import Spinner from "react-native-loading-spinner-overlay";
import colors from "./res/colors";
import { useLoadingContext, useUserContext } from "./context";
import { getLoginState } from './state';

enableScreens();

const RootStack = createNativeStackNavigator();

export default AppNavigator = () => {
  const { loggedIn, setWalletKey } = useUserContext();
  const { loading, loadingMessage, setLoading } = useLoadingContext();

  useEffect(() => {
    const restoreState = async () => {
      const { walletKey } = await getLoginState();
      setWalletKey(walletKey);
      setLoading(false);
    };
    restoreState();
  }, []);

  return (
    <NavigationContainer>
      <Spinner
        visible={loading}
        textContent={loadingMessage}
        color={colors.primary}
        overlayColor={"rgba(0, 0, 0, 0.5)"}
        textStyle={{ color: colors.primary }}
      />
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="RootModal"
          component={loggedIn ? MainNavigator : Login}
            // component={MainNavigator}
          options={{
            headerShown: false,
            stackPresentation: "fullScreenModal",
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#fff",
            headerTransparent: true,
            title: "",
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
