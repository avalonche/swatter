import React from "react";
import { createStackNavigator, TransitionSpecs } from "@react-navigation/stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faQrcode, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import homeScreen from "./homeScreen";
import StoryScreen from "./story/StoryScreen";
import StoryCamera from "./StoryCamera/StoryCamera";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import palette from "../../res/palette";
import images from "../../res/images";
import colors from "../../res/colors";
import DirectMessageScreen from "./DirectMessage/DirectMessageScreen";

const Stack = createStackNavigator();
StatusBar.setBarStyle("light-content");

export default HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={homeScreen}
        options={({ navigation }) => ({
          title: "",
          headerStyle: {
            backgroundColor: colors.bottomBackGround,
            shadowColor: colors.seperatorLineColor,
          },
          headerLeft: () => (
            <View style={styles.headerLeftContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("StoryCameraScreen")}
              >
                <FontAwesomeIcon
                  color={colors.secondary}
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
                  color={colors.primary}
                  size={28}
                  style={styles.headerRightImage}
                  icon={faUserCircle}
                />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: (
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={images.solana}
                style={{ width: 200, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          ),
          headerTitleStyle: { alignSelf: "center" },
        })}
      />
      <Stack.Screen name="Story" component={StoryScreen} />
      <Stack.Screen
        name="StoryCamera"
        component={StoryCamera}
        options={{ gestureDirection: "horizontal-inverted" }} //for left to right transition
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
