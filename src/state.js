import AsyncStorage from "@react-native-async-storage/async-storage";

const LOGIN_PERSISTENCE_KEY = "LOGIN_STATE";

export const getLoginState = async () => {
  const loginState = await AsyncStorage.getItem(LOGIN_PERSISTENCE_KEY);
  return loginState
    ? JSON.parse(loginState)
    : { loggedIn: null, walletKey: null };
};

export const setLoginState = async (state) => {
  await AsyncStorage.setItem(LOGIN_PERSISTENCE_KEY, JSON.stringify(state));
};
