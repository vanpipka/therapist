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
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';

export default class Register extends React.PureComponent {

  constructor(props) {
      super(props);
      const { navigation } = this.props;

      this.state={
        email: 'vanpipka@gmail.com',
        password: 'knidasew',
        confirmPassword: 'knidasew',
        errors: "",
        loading: false,
      };

  }

  componentDidMount(){

  }

  onRegisterPress(props) {
      if (this.state.password !== this.state.confirmPassword) {
        alert("Passwords don't match.")
        return
      };

      if (!firebase.apps.length) {
        let FIREBASECONFIG = Const.FIREBASECONFIG;
        firebase.initializeApp(FIREBASECONFIG);
      }

      firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((response) => {
              const uid = response.user.uid
              const data = {
                  id: uid,
                  email: this.state.email,
                  name: '',
                  avatar: '',
              };
              const usersRef = firebase.firestore().collection('users')
              usersRef
                  .doc(uid)
                  .set(data)
                  .then(() => {
                      console.log(data);
                      this.props.navigation.navigate('Main', {user: data})
                  })
                  .catch((error) => {
                      alert(error)
                  });
          })
          .catch((error) => {
              alert(error)
      });

  }

  render() {
      return (
        <View style={styles.container}>
          <KeyboardAwareScrollView
              style={{width: '100%'}}
              keyboardShouldPersistTaps="always">
              <Icon
                name='people'
                color={Colors.colors.mainGreen} />
            <Input
               placeholder="8 (999) 900 90 90"
               label="Номер телефона"
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

            <Input
                placeholder="*********"
                secureTextEntry={true}
                label="Подтверждение пароля"
                value={this.state.confirmPassword}
                onChangeText={value => this.setState({ confirmPassword: value })}
            />

            <Button
              title="Зарегистрироваться"
              buttonStyle={{backgroundColor: Colors.colors.mainGreen}}
              onPress={() => this.onRegisterPress()}
            />

            <TouchableOpacity
              style={{flexDirection: 'row', marginTop: 16, alignItems: 'center', justifyContent: 'center'}}
                onPress = {()=>{this.props.navigation.navigate('Login')}}>
              <Text style={{color: 'grey'}}>Уже зарегистрированы?</Text>
              <Text style={{fontWeight: '700', color: Colors.colors.mainGreen}}> Войти</Text>
            </TouchableOpacity>

          </KeyboardAwareScrollView>

      </View>
    );
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
