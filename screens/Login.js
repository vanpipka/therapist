import React, { useState, useEffect } from 'react';
import { Platform, Alert, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { AssetExample, Login, GetSessionInfo, GetOrders } from '../components/WebAPI';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import * as firebase from 'firebase';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';

class LoginScreen extends React.PureComponent {

  constructor(props) {
      super(props);

      const { navigation } = this.props;


      /*firebase.auth.currentUser.linkWithCredential(credential)
        .then((usercred) => {
          var user = usercred.user;
          console.log("Anonymous account successfully upgraded", user);
        }).catch((error) => {
          console.log("Error upgrading anonymous account", error);
      });*/

      this.state={
        email:"+79214326729",
        password:"knidasew",
        errors: "",
        session_active: false,
        fio: '',
        loading: false,
      };

  }

  componentDidMount(){

        if (!firebase.apps.length) {
          let FIREBASECONFIG = Const.FIREBASECONFIG;
          firebase.initializeApp(FIREBASECONFIG);
        }

        firebase.auth().signInAnonymously()
          .then(() => {
            console.log('signInAnonymously');
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
    /*auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }

        console.error(error);
      });*/
  }

  _phoneAuth = async () => {

      let database = firebase.database();

      let topUserPostsRef = firebase.database().ref('city').once('value').then((snapshot) => {
        console.log(snapshot.val())
        // ...
      });

    //  setTimeout(function(){console.log(topUserPostsRef);}  , 1000);


      //

      /*console.log('_phoneAuth');

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
          console.log(uid);
          // ...
        } else {
          console.log('User is signed out');
          // ...
        }
      });*/

      //let credential = firebase.auth.PhoneAuthProvider.credential(this.state.email, this.state.password);

      //firebase.auth.PhoneAuthProvider.verifyPhoneNumber(this.state.email);

      /*firebase.auth().PhoneAuthProvider
        .verifyPhoneNumber(this.state.email)
        .then((phoneAuthSnapshot) => {
          console.log(phoneAuthSnapshot);
          // wait / get users code input then:
          // const { verificationId } = phoneAuthSnapshot;
          // const { codeInput } = this.state; // tied to your input box, for example
          // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, codeInput);

          // Do something with your new credential, e.g.:
          // firebase.auth().signInWithCredential(credential);
          // firebase.auth().linkWithCredential(credential);
        })
        .catch((error) => {
          console.log(error);
          console.log(error.verificationId);
        });*/

      /*var provider = new firebase.auth.PhoneAuthProvider();
      provider.verifyPhoneNumber(this.state.email)
          .then(function(verificationId) {
            var verificationCode = window.prompt('Please enter the verification ' +
                'code that was sent to your mobile device.');
            return firebase.auth.PhoneAuthProvider.credential(verificationId,
                verificationCode);
          })
          .then(function(phoneCredential) {
            return firebase.auth().signInWithCredential(phoneCredential);
          });*/

      // 2. Links the credential to the currently signed in user
      // (the anonymous user).
      /*firebase.auth().currentUser.linkWithCredential(credential).then(function(user) {
        console.log("Anonymous account successfully upgraded", user);
      }, function(error) {
        console.log("Error upgrading anonymous account", error);
      });*/

  }

  render() {
      return (
        <View style={styles.container}>
          <Text style={styles.logo}>Fly</Text>
          <View style={styles.inputView} >
            <TextInput
              style={styles.inputText}
              value={this.state.email}
              placeholder="Email..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({email:text})}/>
          </View>
          <View style={styles.inputView} >
            <TextInput
              secureTextEntry
              value={this.state.password}
              style={styles.inputText}
              placeholder="Password..."
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({password:text})}/>
          </View>
          {this.state.loading == true ?
          <ActivityIndicator  size="small" color="white" /> : null
          }
          {this.state.errors != undefined ?
          <Text style={styles.forgot}>{this.state.errors}</Text> : null
          }
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this._phoneAuth}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
      </View>
    );
  };

}

const AppStack = createStackNavigator({ Login: LoginScreen});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: LoginScreen,
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
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  redSection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D21C43',
    width: '100%',
    height: 40,
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});
