import * as React from 'react';
import { Text, View } from 'react-native';
import News from './NewsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function Main() {
  return (
      <Tab.Navigator>
        <Tab.Screen
            name="News"
            component={News}
        />
        <Tab.Screen
            name="Settings"
            component={SettingsScreen}
        />
      </Tab.Navigator>
  );
}
