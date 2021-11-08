import * as React from 'react';
import { Text, View } from 'react-native';
import News from './NewsScreen';
import TestsScreen from './MainTestsScreen';
import Dialogs from './DialogsScreen';
import Colors from '../constants/Colors';
import {  StackActions } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function P_SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const ArticleStack = createStackNavigator();
const DialogStack = createStackNavigator();
const TestStack = createStackNavigator();
const SettingStack = createStackNavigator();

function ArticleScreen({route, navigation}) {

  const user = route.params;

  return (
    <ArticleStack.Navigator initialRouteName="Home">
      <ArticleStack.Screen name="Home" options={{title: "Новости"}} initialParams={user} component={News} />
    </ArticleStack.Navigator>
  );
}

function DialogScreen({route, navigation}) {

  console.log("MainDialogScreen");
  const user = route.params;
  console.log(user);

  return (
    <DialogStack.Navigator initialRouteName="Dialogs">
      <DialogStack.Screen name="Dialogs" options={{title: "Диалоги"}} initialParams={user} component={Dialogs} />
    </DialogStack.Navigator>
  );
}

function TestScreen({route, navigation}) {
  const user = route.params;
  return (
    <TestStack.Navigator initialRouteName="Tests">
      <TestStack.Screen name="Tests" options={{title: "Тесты"}} initialParams={user} component={TestsScreen} />
    </TestStack.Navigator>
  );
}

function SettingsScreen({route, navigation}) {
  const user = route.params;
  return (
    <SettingStack.Navigator initialRouteName="Settings">
      <SettingStack.Screen name="Settings" options={{title: "Настройки"}} initialParams={user} component={P_SettingsScreen} />
    </SettingStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function Main({route, navigation}) {

  const { user } = route.params;

  console.log("export default function Main ");
  console.log(user);

  return (
      <Tab.Navigator tabBarOptions={{
        activeTintColor: Colors.colors.mainGreen,
        inactiveTintColor: 'gray',
      }}>

        <Tab.Screen
            name="News"
            component={ArticleScreen}
            initialParams={user}
            options={{
              tabBarLabel: 'Лента',
              tabBarLabelStyle: {color: "red"},
              tabBarIcon: ({ focused }) => (
                <Icon
                  name='view-list'
                  color= {focused ?  Colors.colors.mainGreen : "grey"} />
              ),
            }}
        />
        <Tab.Screen
            name="Dialogs"
            component={DialogScreen}
            initialParams={user}
            options={{
              tabBarLabel: 'Диалоги',
              tabBarIcon: ({ focused }) => (
                <Icon
                  name='message'
                  color= {focused ?  Colors.colors.mainGreen : "grey"} />
              ),
              tabBarBadge: 3
            }}
        />
        <Tab.Screen
            name="Тесты"
            component={TestScreen}
            initialParams={user}
            options={{
              tabBarLabel: 'Тесты',
              tabBarIcon: ({ focused }) => (
                <Icon
                  name='timeline'
                  color= {focused ?  Colors.colors.mainGreen : "grey"} />
              )
            }}
        />
        <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            initialParams={user}
            options={{
              tabBarLabel: 'Настройки',
              tabBarIcon: ({ focused }) => (
                <Icon
                  name='settings'
                  color= {focused ?  Colors.colors.mainGreen : "grey"} />
              )
            }}
        />
      </Tab.Navigator>
  );
}
