import React, { useState, useEffect } from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Avatar, Icon } from 'react-native-elements';
import { _getTagsInfoFromAsyncStorage } from '../components/WebAPI';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import ArticleItem from '../components/ArticleItem';
import * as firebase from 'firebase';
import { Input } from 'react-native-elements';
import { GetDateView, ConvertStringToDate, ConvertDateToString } from '../components/WebAPI';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';

export default class News extends React.PureComponent {

  static navigationOptions = ({navigation, screenProps}) => {

    //console.log(navigation.state.params);
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

      console.log('NEWS SCREEN CONSTRUCTOR');

      this.state={
          user: props.route.params,
          loading: true,
          refreshdata: true,
          uniqueValue: 1,
          data: [],
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
    let database    = firebase.firestore();
    let iter        = 0;
    let likesArray  = [];
    let dataArray   = [];

    const query = await database.collection("/userInfo/"+this.state.user.id+"/likes").get();

    query.forEach((doc) => {
            let data = doc.data();
            likesArray.push(doc.id);
    });

    const snapshot  = await database.collection('news').orderBy('date', 'desc').limit(10).get();

    dataArray.push({
                    id:     'get_new_item',
                    date:   '',
                    img:    '../assets/img/add_item.png',
                    text:   'new item',
                    title:  'new item',
                    type:   2,
                    commentsCount: 0,
                    heartsCount: 0,
                    tags:   [],
                    author: {
                        id: '',
                        name: '',
                        avatar: ''
                    }
                  });

    snapshot.forEach((doc) => {
            let data = doc.data();
            let tags = [];

            for (var i = 0; i < data.tags.length; i++) {
                tags.push(data.tags[i].id);
            };

            dataArray.push({
                            id:     doc.id,
                            date:   GetDateView(ConvertStringToDate(data.date)),
                            img:    data.img,
                            text:   data.text,
                            title:  data.title,
                            type:   data.type,
                            commentsCount: data.commentsCount,
                            heartsCount: data.heartsCount,
                            liked: (likesArray.indexOf(doc.id) != -1),
                            tags:   tags,
                            author: {
                                id: data.author['id'],
                                name: data.author['name'],
                                avatar: data.author['avatar']
                            }
                          }
                        );

    });

    this.setState({data: dataArray, loading: false, refreshdata: !this.state.refreshdata, uniqueValue : this.state.uniqueValue+1})

  }

  _onPressItem = (props) => {

      props.data['user'] = this.state.user;

      if (props.data['id'] == "get_new_item" ) {
        this.props.navigation.navigate("AddArticle", props.data);
      }else{
        this.props.navigation.navigate("Article", props.data);
      }
  };

  _renderItem = ({item}) => (
      <ArticleItem
        key = {item.id}
        onPressItem={this._onPressItem}
        shortCard={true}
        data={item}
        user={this.state.user}
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 8}}>
            <FlatList
              data={this.state.data}
              extraData={this.props.uniqueValue}
              keyExtractor={(item, index) => item.id}
              renderItem={this._renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.loading}
                  onRefresh={this._loadDataAsync}
                />
              }
            />
          </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
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
