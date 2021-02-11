import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
//import { GetQueryResult } from '../components/WebAPI';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
//import Urls from '../constants/Urls';
import { Icon } from 'react-native-elements'
import Main from '../screens/MainScreen';


/*const AuthLoginStack = createStackNavigator({
  Settings: LoginScreen,
},{headerMode: 'none'});

AuthLoginStack.navigationOptions = {
  tabBarLabel: 'Мои заказы',
  tabBarIcon: ({ focused }) => (
    <Icon
      name='star'
      color='grey' />
  ),
};

const AllDishesStack = createStackNavigator({
  Settings: AllDishes,
},{headerMode: 'none'});

AllDishesStack.navigationOptions = {
  tabBarLabel: 'Все блюда',
  tabBarIcon: ({ focused }) => (
    <Icon
      name='view-list'
      color='grey' />
  ),
};


const AllCooksStack = createStackNavigator({
  Settings: AllCooks,
},{headerMode: 'none'});

AllCooksStack.navigationOptions = {
  tabBarLabel: 'Повара',
  tabBarIcon: ({ focused }) => (
    <Icon
      name='people'
      color='grey' />
  ),
};

export default createBottomTabNavigator({
      AuthLoginStack,
      AllDishesStack,
      AllCooksStack,
    },{
      headerMode: 'none',
      tabBarOptions: {
        activeTintColor: 'black',
        style: {backgroundColor: 'white', сolor: 'blue'}
      }
    },);
*/

const MainStack = createStackNavigator({
  LoginScreen: Main,
},{headerMode: 'none'});

MainStack.navigationOptions = {
  tabBarLabel: 'Настройки',
  //tabBarIcon: ({ focused }) => (
  //  <TabBarIcon
  //    tintColor={'red'}
  //    focused={focused}
  //    name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
  //  />
  //),
};

export default createStackNavigator({
      MainStack,
    },{
      headerMode: 'none',
      tabBarOptions: {
        activeTintColor: '#D21C44',
        style: {backgroundColor: '#575759', borderTopColor: 'black', сolor: 'blue'}
      }
    },);
