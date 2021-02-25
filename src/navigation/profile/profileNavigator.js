import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import profileScreen from './profileScreen';
import {Text, View, Image, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../res/colors';
import images from '../../res/images';

export default function profileNavigator() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={profileScreen}
        options={{
          headerTitle: (
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
                Profile 
              </Text>
            </TouchableOpacity>
          ),
          headerTitleStyle: {alignSelf: 'center'},
          headerStyle: {
            backgroundColor: colors.bottomBackGround,
            shadowColor: colors.seperatorLineColor,
          },
          headerLeft: () => (
            <>
            </>
          ),
        }}
      />
    </Stack.Navigator>
  );
}


