import React from "react";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
// import DrawerNavigator from './DrawerNavigator';
import DirectMessageScreen from "./home/DirectMessage/DirectMessageScreen";
import StoryScreen from "./home/story/StoryScreen";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../res/colors";
import images from "../res/images";

import StoryCamera from "./home/StoryCamera/StoryCamera";
import profileNavigator from "./profile/profileNavigator";
import profileScreen from "./profile/profileScreen";

const MainStack = createStackNavigator();

export default MainNavigator = ({ navigation }) => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="MainScreen"
        component={TabNavigator}
        options={{ title: "", headerShown: false }}
      />
      <MainStack.Screen
        name="StoryCameraScreen"
        component={StoryCamera}
        options={{
          title: "",
          gestureDirection: "horizontal-inverted",
          headerBackTitleVisible: false,
          headerTransparent: true,

          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
              }}
            >
              {/*<TouchableOpacity>
                <Image
                  style={{
                    marginStart: 20,
                    width: 30,
                    height: 30,
                  }}
                  source={images.settings}
                />
              </TouchableOpacity>
              <Image
                style={{
                  marginStart: 130,
                  width: 30,
                  height: 30,
                }}
                source={images.flash}
              />*/}
            </View>
          ),
          /*
          headerRight: () => (
            <View style={{flexDirection: 'row', flex: 1}}>
              <Image
                style={{
                  marginEnd: 20,
                  width: 30,
                  height: 30,
                }}
                source={images.close}
              />
            </View>
          ),*/
        }}
      />
      <MainStack.Screen
        name="StoryScreen"
        component={StoryScreen}
        navigation={navigation}
        options={{
          headerStyle: { backgroundColor: "black", shadowColor: "black" },
          title: "",
          headerLeft: () => <View></View>,
        }}
      />
      <MainStack.Screen
        name="Profile"
        component={profileScreen}
        options={({ navigation }) => ({
          //headerTransparent: true,
          // headerTitle: () => (
          //   <View>
          //     <Text
          //       style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
          //     >
          //       Profile
          //     </Text>
          //   </View>
          // ),
          // headerBackTitleVisible: false,
          title: "",
          headerStyle: {
            backgroundColor: colors.bottomBackGround,
            shadowColor: colors.seperatorLineColor,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
              <Image
                source={images.close}
                style={{ width: 20, height: 20, marginStart: 10 }}
              />
            </TouchableOpacity>
          ),
          ...TransitionPresets.ModalTransition,
        })}
      />
      {/* <MainStack.Screen
        name="DrawerScreen"
        component={DrawerNavigator}
        options={{ title: "", headerShown: false }}
      /> */}
    </MainStack.Navigator>
  );
};
