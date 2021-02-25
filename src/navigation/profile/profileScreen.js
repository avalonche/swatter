import React, { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import UserBio from "./UserBio";
import EditProfileButton from "./EditProfileButton";
import ConstantStories from "./ConstantStories";
import LineSeperator from "./LineSeperator";
import ProfileGrid from "./ProfileGrid";
import colors from "../../res/colors";
import GridIcon from "./gridIcon";
import { Avatar } from "react-native-paper";
import { View, StyleSheet, Image, Text } from "react-native";
import images from "../../res/images";
import { useUserContext } from "../../context";
import * as bs58 from "bs58";
import { getAccountInfo } from "../../utils";
import { networks } from "../../config";
import { Account } from "@solana/web3.js";
import { useState } from "react/cjs/react.development";

const data = [{ key: "1" }];

export default function profileScreen() {
  const { walletKey } = useUserContext();
  const [balance, setBalance] = useState(0);
  const [pubKey, setPubKey] = useState("");
  useEffect(() => {
    const getAccount = async () => {
      const bytes = bs58.decode(walletKey);
      const account = new Account(bytes);
      const accountInfo = await getAccountInfo(
        networks["devnet"].url,
        account.publicKey
      );
      if (accountInfo) {
        setBalance(accountInfo.lamports);
        setPubKey(account.publicKey.toBase58());
      }
    };
    getAccount();
  }, []);
  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bottomBackGround }}
      data={data}
      renderItem={() => (
        <View style={styles.container}>
          <Image
            style={styles.profilePicture}
            source={images.profile_selected}
          />
          <View style={{ alignItems: "center" }}>
            <Text numberOfLines={1} style={styles.balance}>
              ${balance}
            </Text>
            <Text>Account: {pubKey}</Text>
            <Text></Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profilePicture: {
    height: 80,
    width: 80,
    borderRadius: 100,
    margin: 20,
  },
  numberContainer: {
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 15,
  },
  container2: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    marginEnd: 20,
  },
  text: {
    color: "white",
    //fontWeight: 'bold',
    alignSelf: "center",
  },
  container3: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  balance: {
    fontFamily: "Cerebri Sans",
    fontWeight: "bold",
    color: "white",
    paddingVertical: 50,
    marginHorizontal: 20,
    fontSize: 50,
  },
});
