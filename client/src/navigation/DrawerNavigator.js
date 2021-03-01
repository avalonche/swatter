import * as React from "react";
import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from './TabNavigator';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.navigate("Notifications")}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
        
      {/* <Drawer.Screen name="Home" component={HomeScreen} /> */}
      {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}
      <Drawer.Screen
        name="MainScreen"
        component={TabNavigator}
        options={{ title: "", headerShown: false }}
      />
    </Drawer.Navigator>
  );
};
