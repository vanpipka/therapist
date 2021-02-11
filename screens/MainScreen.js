import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import Swiper from 'react-native-swiper'

export default class Main extends React.PureComponent {

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
          <View style={{alignItems: 'center', height: 40}}>
            <Icon
              name='people'
              color='#90ee90' />
          </View>
          <Swiper style={styles.wrapper}
            activeDotColor='#90ee90'>
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
              buttonStyle={{backgroundColor:'#90ee90'}}
              onPress={() => this.props.navigation.navigate('Login')}
              />
            <View style={{flexDirection: 'row', marginTop: 16}}>
              <Text style={{color: 'grey'}}>Уже зарегистрированы?</Text>
              <Text style={{fontWeight: '700', color: '#90ee90'}}> Войти</Text>
            </View>
          </View>
        </View>
      );
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
    color: '#90ee90',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
