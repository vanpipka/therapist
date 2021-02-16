import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
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
    this.checkLogin();
  }

  checkLogin() {

    if (!firebase.apps.length) {
      let FIREBASECONFIG = Const.FIREBASECONFIG;
      firebase.initializeApp(FIREBASECONFIG);
    }

    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          usersRef
            .doc(user.uid)
            .get()
            .then((document) => {
              const userData = document.data()
              console.log('----------------------------------------->>>>');
              console.log(userData);
              this.setState({loading: false})
              if (userData != undefined){
                this.props.navigation.navigate('Main')
              }
            })
            .catch((error) => {
              this.setState({loading: false})
            });
        } else {
          this.setState({loading: false})
        }
      });
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
            <Icon
              name='people'
              color={Colors.colors.mainGreen} />
          </View>
          <Swiper style={styles.wrapper}
            activeDotColor={Colors.colors.mainGreen}>
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
          <View style={{height: 100, marginTop: 8}}>
            <Button
              title="Начать"
              buttonStyle={{backgroundColor: Colors.colors.mainGreen}}
              onPress={() => this.props.navigation.navigate('Register')}
              />
              <TouchableOpacity
                style={{flexDirection: 'row', marginTop: 16, justifyContent: 'center'}}
                onPress = {()=>{this.props.navigation.navigate('Login')}}>
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
    backgroundColor: 'white',
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
  }
});
