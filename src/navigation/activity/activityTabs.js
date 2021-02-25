import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../../res/colors";
import activityCards from './activityCards';

const Tab = createMaterialTopTabNavigator();

export default activityTabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "white",
        inactiveTintColor: colors.textFaded2,
        indicatorStyle: {
          backgroundColor: colors.primary,
        },
        labelStyle: {
          fontFamily: "Cerebri Sans",
        },
        style: {
          backgroundColor: colors.bottomBackGround,
          borderTopColor: colors.seperatorLineColor,
        },
      }}
    >
      <Tab.Screen name="All" component={activityCards} />
      <Tab.Screen name="Paid" component={activityCards} />
      <Tab.Screen name="Received" component={activityCards} />
      <Tab.Screen name="Pending" component={activityCards} />
    </Tab.Navigator>
  );
};
