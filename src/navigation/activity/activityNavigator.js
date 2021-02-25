import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import activityTabs from "./activityTabs";
import colors from "../../res/colors";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import palette from "../../res/palette";

const Stack = createStackNavigator();

export default function activityNavigator() {


  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Activity"
        component={activityTabs}
        options={({ navigation }) => ({
          //headerTransparent: true,
          headerTitle: () => (
            <Text
              style={{
                fontFamily: "Cerebri Sans",
                color: "white",
                fontWeight: "bold",
                fontSize: 17,
              }}
            >
              Activity
            </Text>
          ),
          headerStyle: {
            backgroundColor: colors.bottomBackGround,
            shadowColor: colors.seperatorLineColor,
          },
          headerRight: () => (
            <View>
              <TouchableOpacity
                style={styles.headerRightContainer}
                onPress={() => navigation.navigate("Profile")}
              >
                <FontAwesomeIcon
                  color={colors.primary}
                  size={28}
                  style={styles.headerRightImage}
                  icon={faUserCircle}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: palette.header.headerRightContainer,
  headerRightImage: palette.header.headerRightImage,
});
