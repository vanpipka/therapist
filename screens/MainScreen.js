import React, { useState, useEffect } from 'react';
import { Platform, Alert, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { AssetExample, Login, GetSessionInfo, GetOrders } from '../components/WebAPI';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Swiper from 'react-native-swiper'

class Main extends React.PureComponent {

  constructor(props) {
      super(props);

      const { navigation } = this.props;

      this.state={};

  }

  componentDidMount(){
  }


  render() {
      return (
        <View style={styles.container}>
          <Swiper style={styles.wrapper} showsButtons={true}>
            <View style={styles.slide1}>
              <Text style={styles.text}>Hello Swiper</Text>
            </View>
            <View style={styles.slide2}>
              <Text style={styles.text}>Beautiful</Text>
            </View>
            <View style={styles.slide3}>
              <Text style={styles.text}>And simple</Text>
            </View>
          </Swiper>
          <View>
          </View>
        </View>
      );
  };

}

const AppStack = createStackNavigator({ Main: Main});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: Main,
    App: AppStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0073A8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
