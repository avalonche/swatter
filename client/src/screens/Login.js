import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import TorusSdk from "@toruslabs/torus-direct-react-native-sdk";
import { Account } from "@solana/web3.js";
import nacl from "tweetnacl";
import * as bs58 from "bs58";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GOOGLE, GITHUB, FACEBOOK, TWITTER, verifierMap } from "../config";
import images from "../res/images";
import colors from "../res/colors";
import { fromHexString, getAccountInfo } from "../utils";
import { useLoadingContext, useUserContext } from "../context";
import { setLoginState } from "../state";

export default Login = () => {
  const { setWalletKey } = useUserContext();
  const { setLoading, setLoadingMessage } = useLoadingContext();
  const [error, setError] = useState("");

  React.useEffect(() => {
    try {
      TorusSdk.init({
        browserRedirectUri: "https://scripts.toruswallet.io/redirect.html",
        redirectUri: "torusapp://org.torusresearch.torusdirectexample/redirect",
        network: "testnet", // details for test net
        proxyContractAddress: "0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183", // details for test net
      });
    } catch (error) {
      //   console.error(error, "could not initiate Torus sdk");
      setError("Unable to initiate Torus SDK");
    }
  }, []);

  const login = async (selectedVerifier) => {
    try {
      setLoading(true);
      setLoadingMessage("Fetching Torus Key...");
      const { typeOfLogin, clientId, verifier, jwtParams } = verifierMap[
        selectedVerifier
      ];
      const loginDetails = await TorusSdk.triggerLogin({
        typeOfLogin,
        verifier,
        clientId,
        jwtParams,
      });
      setLoading(false);
      const solanaPrivateKey = nacl.sign.keyPair.fromSeed(
        fromHexString(loginDetails.privateKey.padStart(64, 0))
      ).secretKey;
      const walletPrivateKey = bs58.encode(solanaPrivateKey);
      setWalletKey(walletPrivateKey);
      await setLoginState({ loggedIn: true, walletKey: walletPrivateKey });
    } catch (error) {
      //   console.error(error, "could not login");
      setLoading(false);
      setError(`Failed to fetch torus key through ${selectedVerifier}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={images.solanaLogo} style={{ height: 70, width: 200 }} />
      </View>
      <Text
        style={{
          fontFamily: "Roboto",
          fontWeight: "bold",
          fontSize: 20,
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 20,
          color: "#00ffad",
          textAlign: "center",
        }}
      >
        Login to Wallet
      </Text>
      <View
        style={{
          //flex: 0.1,
          flexDirection: "row",
          // justifyContent: 'space-between',
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "#262626" }}></View>
      </View>
      <View style={{ marginTop: 30 }}>
        <TouchableOpacity
          style={styles.googleLogin}
          onPress={() => login(GOOGLE)}
        >
          <Image source={images.google} style={{ width: 20, height: 20 }} />
          <Text
            style={{
              color: "#fff",
              marginStart: 20,
              fontFamily: "Roboto",
              fontWeight: "bold",
            }}
          >
            CONTINUE WITH GOOGLE
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", marginStart: 15, marginEnd: 15 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => login(FACEBOOK)}
          >
            <Image source={images.facebook} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => login(TWITTER)}
          >
            <Image source={images.twitter} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => login(GITHUB)}
          >
            <Image
              source={images.github}
              style={{ width: 30, height: 30 }}
              onPress={() => login(GITHUB)}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          //flex: 0.1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "#262626" }}></View>
        <Text style={{ marginLeft: 40, marginRight: 40, color: "#969696" }}>
          OR
        </Text>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#262626",
          }}
        ></View>
      </View>
      <View style={styles.userNameContainer}>
        <TextInput
          style={styles.userNameInput}
          placeholder="Phone number, username or email"
          placeholderTextColor={colors.textFaded2}
        />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          secureTextEntry={true}
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor={colors.textFaded2}
        />
      </View>
      {error ? (
        <Text
          style={{
            fontFamily: "Cerebri Sans",
            marginLeft: 20,
            marginRight: 20,
            color: colors.error,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      ) : null}
      <TouchableOpacity style={styles.loginContainer}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginTop: 50 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#262626",
            height: 1,
          }}
        ></View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#969696", marginRight: 10 }}>Powered by</Text>
        <TouchableOpacity onPress={() => Linking.openURL("https://tor.us/")}>
          <Image
            source={images.torus_logo}
            style={{ width: 100, height: 20, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 40,
  },
  userNameContainer: {
    borderColor: "#262626",
    backgroundColor: colors.loginInputBackground,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
    //alignItems: 'center',
    marginStart: 20,
    marginEnd: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  userNameInput: {
    marginStart: 10,
    color: "white",
  },
  passwordContainer: {
    borderColor: "#262626",
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
    //alignItems: 'center',
    marginStart: 20,
    marginEnd: 20,
    backgroundColor: colors.loginInputBackground,
    marginBottom: 20,
  },
  passwordInput: { marginStart: 10, color: "white" },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginEnd: 20,
  },
  forgotPasswordText: {
    color: "#0088f8",
  },
  loginContainer: {
    alignItems: "center",
    height: 40,
    marginTop: 30,
    justifyContent: "center",
    marginStart: 20,
    marginEnd: 20,
    borderWidth: 1,
    borderRadius: 5,
    // borderColor: '#00ffad',
    backgroundColor: "#00ffad",
  },
  loginText: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#262626",
  },
  googleLogin: {
    marginStart: 20,
    marginEnd: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    padding: 15,
    borderColor: "#969696",
  },
  loginButton: {
    alignItems: "center",
    marginVertical: 15,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    borderColor: "#969696",
  },
});
