import React, { useState, useEffect } from 'react';
import { Platform, Alert, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Avatar, Icon } from 'react-native-elements'
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
import { Input } from 'react-native-elements';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';

export default class News extends React.PureComponent {

  static navigationOptions = ({navigation, screenProps}) => {

    console.log(navigation.state.params);
    const params = navigation.state.params || {};

    return {
      title:  params.title,
      headerLeft:  null,
      //headerRight: () => params.headerRight,
      headerStyle: {
        backgroundColor: '#D30068',
      },
    }
  }

  constructor(props) {
      super(props);
      const { navigation } = this.props;

      console.log('HOME');
      console.log(this.props);

      this.state={
          loading: true,
      };

  }

  _setNavigationParams() {
    let title       = 'Все предложения';

    this.props.navigation.setParams({
      title,
    });
  }

  componentDidMount(){
    this._setNavigationParams();
    this._loadDataAsync();
  }

  _loadDataAsync = async () => {

    if (!firebase.apps.length) {
      let FIREBASECONFIG = Const.FIREBASECONFIG;
      firebase.initializeApp(FIREBASECONFIG);
    }

    firebase.auth().signInAnonymously()
      .then(() => {
        this._LoadDataAsync_1();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.message);
        //Показать ошибку
      });

  }

  _LoadDataAsync_1 = async () => {
    let database  = firebase.firestore();
    let iter      = 0;
    const snapshot = await database.collection('news').get();
    console.log('_LoadDataAsync_1');
    await setTimeout(()=>{

        let dataArray = [];
        snapshot.forEach((doc) => {
            let data = doc.data();
            dataArray.push({date:   data.date,
                            img:    data.img,
                            text:   data.text,
                            title:  data.title,
                            type:   data.type,
                          })
        });

        this.setState({data: dataArray, loading: false})

    }, 1000);

  }

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (props) => {

      console.log('set item---------------------->');
      console.log(props);
      //this.props.navigation.navigate("Dish", {});
      //this.setState({dish_card_visible: true, current_item: props})
      //Overlay
  };

  _renderItem = ({item}) => (
      <MyListItem
        key = {item.id}
        onPressItem={this._onPressItem}
        data={item}
      />
  );

  render() {
      if (this.state.loading == true) {
          return(
            <View style={styles.container}>
                <ActivityIndicator  size="large" color={Colors.colors.mainGreen} />
            </View>
          )
      }else{
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FlatList
              data={this.state.data}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.loading}
                  onRefresh={this._loadAsync}
                />
              }
            />
          </View>
      );
    }
  };
}

class MyListItem extends React.PureComponent {

  _onPress = () => {
    this.props.onPressItem(this.props);
  };

  render() {

    return (
      <TouchableOpacity onPress={this._onPress}>
          <Card containerStyle={{borderRadius: 8}}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Avatar size="small" rounded source = {{uri:this.props.data.img}}/>
                <Text style={{marginLeft: 8}}>Michael</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{marginLeft: 8}}>11:22</Text>
              </View>
            </View>
            <View style={{marginTop: 8}}>
              <Text style={{fontWeight:'700'}}>{this.props.data.title}</Text>
              <Text style={{marginTop: 8, fontSize: 12, color: 'grey'}}>{this.props.data.text}</Text>
            </View>
            <View style={{marginTop: 8, marginBottom: 6}}>
              <Text style={{color: '#5A00C4', fontSize: 12, }}>tag_1, tag_2</Text>
            </View>

            <Card.Divider/>

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{alignItems: 'flex-start'}}>
                <Icon
                  name='chat-bubble'
                  type='material-icons'
                  color='grey'
                  size={16}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <Icon
                  name='volunteer-activism'
                  type='material-icons'
                  color='grey'
                  size={16}
                />
                <Icon
                  name='favorite'
                  type='material-icons'
                  color='grey'
                  containerStyle = {{marginLeft: 8}}
                  size={16}
                />
              </View>
            </View>

          </Card>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
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
