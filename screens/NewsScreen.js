import React, { useState, useEffect } from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Avatar, Icon } from 'react-native-elements';
import { _setTagsInfoFromAsyncStorage } from '../components/WebAPI';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
import { Input } from 'react-native-elements';
import { GetDateView, ConvertStringToDate } from '../components/WebAPI';
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

      console.log('NEWS SCREEN CONSTRUCTOR');

      this.state={
          user: props.route.params,
          loading: true,
          refreshdata: true,
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
    //this._loadTagsInfo();
    this._loadDataAsync();
  }

  /*_loadTagsInfo = async () => {
    console.log('before _setTagsInfoFromAsyncStorage');
    let res = await _getTagsInfoFromAsyncStorage();
    try {
      let tagsData = JSON.parse(res);
      console.log(tagsData);
    } catch (e) {

    } finally {

    }

  }*/

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
    const snapshot = await database.collection('news').orderBy('date', 'desc').limit(10).get();
    console.log('_LoadDataAsync_1');
    let dataArray = [];

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
                  }
                );

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
                            tags:   tags,
                            author: {
                                id: data.author['id'],
                                name: data.author['name'],
                                avatar: data.author['avatar']
                            }
                          }
                        );

    });

    this.setState({data: dataArray, loading: false, refreshdata: !this.state.refreshdata})

  }

  _onPressItem = (props) => {

      props.data['user'] = this.state.user;

      if (props.data['id'] == "get_new_item" ) {
        this.props.navigation.navigate("AddArticle", props.data);
      }else{
        this.props.navigation.navigate("Article", props.data);
      }
  };

  _onPressLike = (props) => {

      let array = this.state.data;

      for (var i = 0; i < array.length; i++) {

        if (array[i].id == props.data.id) {
          console.log(array[0].id);
          if (array[i].heartsCount==1) {
            array[i].heartsCount = 0
          }else{
            array[i].heartsCount = 1
          }
          console.log(array[i].heartsCount);
        }
      }

      this.setState({data: array, refreshdata: !this.state.refreshdata})

      //Overlay
  };

  _renderItem = ({item}) => (
      <MyListItem
        key = {item.id}
        onPressItem={this._onPressItem}
        onPressLike={this._onPressLike}
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 8}}>
            <FlatList
              data={this.state.data}
              extraData={this.state.refreshdata}
              keyExtractor={(item, index) => {return item.id;}}
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

  _onPressLike = () => {
    this.props.onPressLike(this.props);
  };

  render() {

    console.log('MyListItem render');

    let TextComponent = null;
    let text  = this.props.data.text;
    let textJSON  = {};

    try {
        textJSON  = JSON.parse(text);
        TextArray = [];
        for (var i = 0; i < textJSON.data.length; i++) {

          let text = textJSON.data[i].text;

          console.log(i);
          if (i == 1) {
            text = text + "...";
            TextArray.push(<Text key ={i} style={textJSON.data[i].style}>{text}</Text>);
            break;
          }else{
            TextArray.push(<Text key ={i} style={textJSON.data[i].style}>{text}</Text>);
          }

        };

        TextComponent = <ScrollView>
                          {TextArray}
                        </ScrollView>

    } catch (e) {

        if (text.length > 150) {
          text = text.substr(0, 147)+"..."
        }

        TextComponent = <Text style = {{color: "grey", fontSize: 12}}>{text}</Text>
    };

      if (this.props.data.id == 'get_new_item') {
        return(
          <TouchableOpacity onPress={this._onPress}>
            <Card containerStyle={{borderRadius: 8, margin: 8, backgroundColor: '#97EBFF'}}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Avatar size="small" source={require('../assets/img/add_item.png')}/>
                  <View>
                    <Text style={{marginLeft: 8, color: 'grey', fontWeight:'700'}}>Что в твоей голове?</Text>
                    <Text style={{marginLeft: 8, color: '#009789'}}>Вдохновляй других, получай поддержку</Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )
      }else{
        return(
          <TouchableOpacity onPress={this._onPress}>
              <Card containerStyle={{borderRadius: 8, margin: 8}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar size="small" rounded source = {{uri:this.props.data.author.avatar}}/>
                    <Text style={{marginLeft: 8}}>{this.props.data.author.name}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{marginLeft: 8, fontSize: 8}}>{this.props.data.date}</Text>
                  </View>
                </View>
                <View style={{marginTop: 8}}>
                  <Text style={{fontWeight:'700'}}>{this.props.data.title}</Text>
                  {TextComponent}
                </View>
                <View style={{marginTop: 8, marginBottom: 6}}>
                  <Text style={{color: '#8154b9', fontSize: 12, }}>{this.props.data.tags.join(' ,')}</Text>
                </View>

                <Card.Divider/>

                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{alignItems: 'flex-start'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon
                        name='chat-bubble'
                        type='material-icons'
                        size={16}
                        color={this.props.data.commentsCount == 0 ? 'grey' : '#009789' }
                      />
                      {this.props.data.commentsCount == 0 ? null : <Text style={{color: '#009789', fontSize: 12}}>{this.props.data.commentsCount}</Text> }
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Icon
                      name='volunteer-activism'
                      type='material-icons'
                      color='grey'
                      size={16}
                    />
                    <TouchableOpacity onPress = {this._onPressLike}>
                      <Icon
                        name='favorite'
                        type='material-icons'
                        color='grey'
                        containerStyle = {{marginLeft: 8}}
                        size={16}
                        color={this.props.data.heartsCount == 0 ? 'grey' : 'red' }
                      />
                    </TouchableOpacity>
                  </View>
                </View>

              </Card>
          </TouchableOpacity>
        )
      }
  }
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
