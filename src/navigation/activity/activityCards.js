import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { BarIndicator } from "react-native-indicators";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import colors from "../../res/colors";
import images from "../../res/images";
import { color } from "react-native-reanimated";

export default ActivityCards = () => {
  const [ready, setReady] = useState(false);
  const [activities, setActivities] = useState([]);
  const route = useRoute();
  const { name } = route;
  // event listener for transactions
  useEffect(() => {
    setReady(true);
  }, []);
  const getEmptyText = (name) => {
    let emptyText;
    switch (name) {
      case "All":
        emptyText = "It seems like you haven't made any transactions yet";
        break;
      case "Paid":
        emptyText = "It seems like you haven't send any payments yet";
        break;
      case "Received":
        emptyText = "It seems like you haven't received any payments yet";
        break;
      case "Pending":
        emptyText = "No pending transactions found";
        break;
      default:
        emptyText = "";
    }
    return emptyText;
  };
  return ready ? (
    <ImageBackground source={images.background} style={styles.imageBackground}>
      <View style={styles.innerContainer}>
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Title style={styles.font}>No Transactions!</Title>
            <Paragraph style={styles.font}>{getEmptyText(name)}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    </ImageBackground>
  ) : (
    <View style={{ backgroundColor: colors.bottomBackGround, flex: 1 }}>
      <BarIndicator color={colors.textInputBackground} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    height: "100%",
    width: "100%",
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0, 0.80)",
  },
  emptyCard: {
    borderRadius: 0,
    backgroundColor: colors.bottomBackGround,
    marginVertical: 20,
    borderColor: colors.seperatorLineColor,
  },
  font: {
    fontFamily: "Cerebri Sans",
    color: colors.textFaded2,
    textAlign: "center",
  }
});
