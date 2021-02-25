import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import paymentScreen from "./paymentScreen";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faQrcode, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import palette from "../../res/palette";
import images from "../../res/images";
import colors from "../../res/colors";

const Stack = createStackNavigator();

export default function paymentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Send or Request Transactions"
        component={paymentScreen}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: colors.secondary,
            shadowColor: colors.secondary,
          },
          headerLeft: () => (
            <View style={styles.headerLeftContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("StoryCameraScreen")}
              >
                <FontAwesomeIcon
                  color="white"
                  size={28}
                  style={styles.headerLeftImage}
                  icon={faQrcode}
                />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity
                style={styles.headerRightContainer}
                onPress={() => navigation.navigate("Profile")}
              >
                <FontAwesomeIcon
                  color="white"
                  size={28}
                  style={styles.headerRightImage}
                  icon={faUserCircle}
                />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: () => (
            <Text
              style={{
                fontFamily: "Cerebri Sans",
                color: "white",
                fontWeight: "bold",
                fontSize: 17,
              }}
            >
              Payments
            </Text>
          ),
          headerTitleStyle: { alignSelf: "center" },
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeftContainer: palette.header.headerLeftContainer,
  headerLeftImage: palette.header.headerLeftImage,
  headerRightContainer: palette.header.headerRightContainer,
  headerRightImage: palette.header.headerRightImage,
});