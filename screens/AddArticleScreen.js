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
import { GetDateView, ConvertStringToDate, ConvertDateToString } from '../components/WebAPI';
import { v4 as uuidv4 } from 'uuid';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';

export default class Article extends React.PureComponent {

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

      this.state=this.props.route.params;
      this.state['comments'] = [];
      this.state['message'] = '';
      this.state['refreshdata'] = true;
  }

  _setNavigationParams() {
    this.props.navigation.setParams({title: 'Новая заметка'});
  }

  componentDidMount(){
    this._setNavigationParams();
    //this._loadDataAsync();
  }

  _sendMessageAsync = async (props) => {

    if (this.state.message == '') {
        return
    }
    console.log("_sendMessageAsync");

    let database  = firebase.firestore();
    let data      = {
            author: this.state.user,
            date: ConvertDateToString(new Date()),
            link: this.state.id,
            text: this.state.message,
            verified: false
      }


    database.collection("comments").doc(''+uuidv4()).set(data).then(() => {
          data['createdAt'] = GetDateView(ConvertStringToDate(data.date))
          this.state.comments.push(data);
          this.setState({message: ''});
      })
      .catch((error) => {
          Alert.alert("Ошибка", "Не удалось добавить комментарий");
      });
  }

  render() {

      return(
        <View style={styles.container}>
          <Text>блаблабла</Text>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  greySection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#e2e3e5',
    borderTopWidth: 0.5,
    borderTopColor: '#d6d8db',
    height: 56,
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 8,
  },
  textInput: {
    backgroundColor: 'white',
    height: 40,
    borderColor: '#d6d8db',
    borderWidth: 0.5,
    paddingLeft: 8,
    width: '90%',
  },
});
