import React from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Image, AsyncStorage} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Icon, Text } from 'react-native-elements'
import Swiper from 'react-native-swiper';
import * as firebase from 'firebase';
import Colors from '../constants/Colors';
import Const from '../constants/Const';

export default class Begin extends React.PureComponent {

  constructor(props) {
      super(props);

      const { navigation } = this.props;

      this.state={loading: true};

  }

  componentDidMount(){
    this._checkLogin();
  }

  _saveUser = async (user) => {
    try {

      await AsyncStorage.setItem('user_id', user.id);
      await AsyncStorage.setItem('user_name', user.name);
      await AsyncStorage.setItem('user_avatar', user.avatar);

      this.props.navigation.replace('Main', {user: user});

    } catch (error) {

    }
  };

  _checkLogin = async () => {

    if (!firebase.apps.length) {
      let FIREBASECONFIG = Const.FIREBASECONFIG;
      firebase.initializeApp(FIREBASECONFIG);
    }

    let email = await AsyncStorage.getItem('user_email');
    let password = await AsyncStorage.getItem('user_psw');

    if (email != undefined) {

      firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
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

    } else {
      this.setState({loading: false})
    }
  }

  render() {
    if (this.state.loading == true) {
        return(
          <View style={styles.container}>
              <ActivityIndicator  size="large" color={Colors.colors.mainGreen} />
          </View>
        )
    }else{
      return (
        <View style={styles.container}>
          <View style={{alignItems: 'center', height: 40}}>
            <Image source={require('../assets/img/logo_mini.png')} style={{resizeMode: "stretch",
              justifyContent: "center",
              alignItems: "center",
              width: 47,
              height: 30}}/>
          </View>
          <Swiper style={styles.wrapper}
            activeDotColor={Colors.colors.mainGreen}>
            <View style={styles.slide1}>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text h4 style={{color: Colors.colors.mainGreen}}>Обрети гармонию</Text>
                <Image source={require('../assets/img/step1.png')} style={styles.image}/>

              </View>
            </View>
            <View style={styles.slide2}>
              <Text h4 style={{color: Colors.colors.mainGreen}}>Делись эмоциями</Text>
              <Image source={require('../assets/img/step2.png')} style={styles.image}/>
            </View>
            <View style={styles.slide3}>
              <Text h4 style={{color: Colors.colors.mainGreen}}>Узнай себя</Text>
              <Image source={require('../assets/img/step3.png')} style={styles.image}/>
            </View>
          </Swiper>
          <View style={{height: 100, marginTop: 8}}>
            <Button
              title="Начать"
              buttonStyle={{backgroundColor: Colors.colors.mainGreen}}
              onPress={() => this.props.navigation.replace('Register')}
              />
              <TouchableOpacity
                style={{flexDirection: 'row', marginTop: 16, justifyContent: 'center'}}
                onPress = {()=>{this.props.navigation.replace('Login')}}>
                <Text style={{color: 'grey'}}>Уже зарегистрированы?</Text>
                <Text style={{fontWeight: '700', color: Colors.colors.mainGreen}}> Войти</Text>
              </TouchableOpacity>
          </View>
        </View>
      );
    };
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f9fafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {

  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.colors.mainGreen,
    fontSize: 30,
    fontWeight: 'bold'
  },
  image: {
    resizeMode: "stretch",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 270,
  },
});
