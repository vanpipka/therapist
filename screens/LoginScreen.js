import React, { useState, useEffect } from 'react';
import { Platform, Alert, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button } from 'react-native-elements'
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
import { Input, Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';

export default class Login extends React.PureComponent {

  constructor(props) {
      super(props);
      const { navigation } = this.props;

      this.state={
        email: '',
        password: '',
        errors: "",
        loading: false,
      };

  }

  componentDidMount(){

      this._getUserInfo();

  }

  _getUserInfo = async () => {

    try {

      let email = await AsyncStorage.getItem('user_email');
      let password = await AsyncStorage.getItem('user_psw');

      this.setState({email: email, password: password})

    } catch (error) {

    }

  };

  _saveUser = async (user) => {
    try {

      console.log(user);
      await AsyncStorage.setItem('user_email', this.state.email);
      await AsyncStorage.setItem('user_psw', this.state.password);
      await AsyncStorage.setItem('user_id', user.id);
      await AsyncStorage.setItem('user_name', user.name);
      await AsyncStorage.setItem('user_avatar', user.avatar);

      this.props.navigation.replace('Main', {user: user});

    } catch (error) {

    }
  };

  onLoginPress(props) {

    if (!firebase.apps.length) {
      let FIREBASECONFIG = Const.FIREBASECONFIG;
      firebase.initializeApp(FIREBASECONFIG);
    }

    firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then((response) => {
              const uid = response.user.uid
              const usersRef = firebase.firestore().collection('users')
              usersRef
                  .doc(uid)
                  .get()
                  .then(firestoreDocument => {
                      if (!firestoreDocument.exists) {
                          alert("User does not exist anymore.")
                          return;
                      }
                      const user = firestoreDocument.data();
                      this._saveUser(user);
                  })
                  .catch(error => {
                      alert(error)
                  });
          })
          .catch(error => {
              alert(error)
          })

  }

  render() {
      return (
        <View style={styles.container}>
          <SafeAreaInsetsContext.Consumer>
            {insets => <View style={{ paddingTop: insets.top }} />}
          </SafeAreaInsetsContext.Consumer>

          <Card containerStyle={{borderRadius:25, width: '100%', backgroundColor: 'white'}}>

            <Card.Title>
              <Icon
                name='people'
                color={Colors.colors.mainGreen} />
            </Card.Title>
            <Card.Divider/>

            <Input
               placeholder="email@google.com"
               label="Email"
               value={this.state.email}
               onChangeText={value => this.setState({ email: value })}
            />

            <Input
                placeholder="*********"
                secureTextEntry={true}
                label="Пароль"
                value={this.state.password}
                onChangeText={value => this.setState({ password: value })}
            />

            <Button
              title="Войти"
              buttonStyle={{backgroundColor: Colors.colors.mainGreen}}
              onPress={() => this.onLoginPress()}
            />

            <TouchableOpacity
              style={{marginTop: 16, justifyContent: 'center', alignItems: 'center'}}
              onPress = {()=>{this.props.navigation.replace('Register')}}>
              <Text style={{color: 'grey'}}>Еще не зарегистрированы?</Text>
              <Text style={{fontWeight: '700', color: Colors.colors.mainGreen}}> Зарегистрироваться</Text>
            </TouchableOpacity>

        </Card>

      </View>
    );
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
