import * as React from 'react';
import { Text, View } from 'react-native';
import News from './NewsScreen';
import Dialogs from './DialogsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function Main({route, navigation}) {

  const { user } = route.params;

  return (
      <Tab.Navigator>
        <Tab.Screen
            name="News"
            component={News}
            initialParams={user}
        />
        <Tab.Screen
            name="Dialogs"
            component={Dialogs}
            initialParams={user}
        />
        <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            initialParams={user}
        />
      </Tab.Navigator>
  );
}
