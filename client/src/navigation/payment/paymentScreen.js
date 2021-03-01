import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../res/colors";
import palette from "../../res/palette";
import { LinearGradient } from "expo-linear-gradient";
import { Button, DataTable } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const numberPadSymbols = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  "<",
];

export default function PaymentScreen() {
  const [amount, setAmount] = useState("0");
  const [amountMargin, setAmountMarin] = useState(0);
  const buttonIcon = (type) => {
    type === "Send" ? (
      <FontAwesomeIcon color="white" size={20} icon={faSignOutAlt} />
    ) : (
      <FontAwesomeIcon color="white" size={20} icon={faSignInAlt} />
    );
  };

  const updateAmount = (symbol) => {
    const wholeAmount = amount.split('.')[0];
    const decimal = amount.split('.')[1];
    if (amount === '0') {
      if (symbol === "<" || symbol === "0" || symbol === ".") {
        return;
      }
      setAmount(symbol);
      return
    }
    if (symbol === '<') {
      amount.length === 1 ? setAmount("0") : setAmount(amount.slice(0, -1));
      return;
    }
    if (decimal && decimal.length >= 2) {
      return;
    }
    setAmount(amount + symbol);
  }

  const renderNumberSymbol = (symbol) => {
    return (
      <TouchableOpacity onPress={() => updateAmount(symbol)}>
        <Text style={styles.numberSymbol}>{symbol}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[colors.secondary, "#779ac8", colors.primary]}
      style={styles.mainContainter}
    >
      <View style={{ alignItems: "center" }}>
        <Text numberOfLines={1} style={styles.amount}>${amount}</Text>
      </View>
      <View>
        {[...Array(4)].map((e, i) => {
          return (
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              {[...Array(3)].map((f, j) => {
                return renderNumberSymbol(numberPadSymbols[3 * i + j]);
              })}
            </View>
          );
        })}
      </View>
      <View style={styles.paymentContainer}>
        <Button
          style={styles.paymentButtons}
          labelStyle={styles.paymentLabels}
          color={colors.primary}
          mode="outlined"
          onPress={() => console.log("Pressed")}
        >
          Request
        </Button>
        <Button
          style={styles.paymentButtons}
          labelStyle={styles.paymentLabels}
          color={colors.primary}
          mode="outlined"
          onPress={() => console.log("Pressed")}
        >
          Pay
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainter: {
    // alignItems: "center",
    // justifyContent: "center",
    flex: 1,
  },
  paymentContainer: {
    flexDirection: "row",
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  paymentButtons: {
    borderRadius: 50,
    margin: 10,
    flex: 1,
    borderColor: colors.primary
  },
  paymentLabels: {
    fontFamily: "Cerebri Sans",
    color: "white",
    fontSize: 18,
    paddingVertical: 2,
  },
  numberSymbol: {
    fontSize: 30,
    fontFamily: "Cerebri Sans",
    color: "white",
    paddingVertical: 20,
  },
  amount: {
    fontFamily: "Cerebri Sans", 
    fontWeight: "bold",
    color: "white",
    paddingVertical: 50,
    marginHorizontal: 20,
    fontSize: 50,
  }
});
