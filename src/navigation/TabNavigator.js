import React from "react";
import { Image } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import homeNavigator from './home/homeNavigator';
import activityNavigator from './activity/activityNavigator';
import paymentNavigator from './payment/paymentNavigator';
import addPostNavigator from './addPost/addPostNavigator';
import profileNavigator from './profile/profileNavigator';
import searchNavigator from './search/searchNavigator';
import images from "../res/images";
import colors from '../res/colors';
import palette from '../res/palette';

const Tab = createBottomTabNavigator();

export default TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        showIcon: true,
        // activeBackgroundColor: colors.primary,
        // inactiveBackgroundColor: colors.bottomBackGround,
        style: {
          backgroundColor: colors.bottomBackGround,
          borderTopColor: colors.seperatorLineColor,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          const colour =  focused ? colors.primary : "white";
          if (route.name === "Home") {
            iconName = focused ? images.home_selected : images.home;
        //   } else if (route.name === "Search") {
        //     iconName = focused ? images.people_selected :images.people;
          } else if (route.name === "Payment") {
            iconName = focused ? images.payment_selected : images.payment;
          } else if (route.name === "Activity") {
            iconName = focused ? images.notification_selected : images.notification;
          }
        //   } else if (route.name === "Profile") {
        //     iconName = focused ? images.profile_selected : images.profile;
        //   }

          return <Image style={{...palette.header.image, tintColor: colour}} source={iconName} />;
        // return <FontAwesomeIcon color={colour} size={26} icon={iconName} />
        },
      })}
    >
      <Tab.Screen name="Home" component={homeNavigator} />
      {/* <Tab.Screen name="Search" component={searchNavigator} /> */}
      {/* <Tab.Screen name="AddPost" component={addPostNavigator} /> */}
      <Tab.Screen name="Payment" component={paymentNavigator} />
      <Tab.Screen name="Activity" component={activityNavigator} />
      {/* <Tab.Screen name="Profile" component={profileNavigator} /> */}
    </Tab.Navigator>
  );
}
