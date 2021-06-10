import React, { useState, useEffect } from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Avatar, Icon, Input } from 'react-native-elements';
import { _setTagsInfoFromAsyncStorage } from '../components/WebAPI';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
import { GetDateView, ConvertStringToDate, ConvertDateToString } from '../components/WebAPI';
import { v4 as uuidv4 } from 'uuid';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';

export default class Article extends React.PureComponent {

  static navigationOptions = ({navigation, screenProps}) => {

    console.log('navigationOptions');
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
      //this.refreshtags = this.refreshtags.bind(this);
      const { navigation } = this.props;

      this.state = {user: this.props.route.params['user'],
                    headline: "",
                    text: "",
                    errorText: "",
                    tags: []};

  }

  _setNavigationParams() {
    this.props.navigation.setParams({title: 'Новая заметка'});
  }

  componentDidMount(){
    this._setNavigationParams();
    //this._loadDataAsync();
  }

  refreshtags(props) {
    console.log('refresh');
    console.log(props);
    let arr = [];
    props.forEach(function(item, i) {
      arr.push(item.id)
    });
    this.setState({tags: arr})
  }

  _sendMessageAsync = async (props) => {

    if (this.state.text == '') {
        this.setState({errorText: 'Это поле обязательно для заполнения'});
        return
    }
    let database  = firebase.firestore();
    let text      = JSON.stringify({data: [
                		{
                			text: this.state.text,
                			type: "text",
                			style: {
                				color: "black",
                				fontSize: 12
                			}
                		}
                	]
                });

    let tags = [];
    this.state.tags.forEach(function(item, i) {
      tags.push(database.doc('tags/'+item))
    });

    let data      = {
            author: this.state.user,
            date: ConvertDateToString(new Date()),
            text: this.state.text,
            commentsCount: 0,
            heartsCount: 0,
            original: "",
            tags: tags,
            title: this.state.headline,
            text: text,
      }


    database.collection("news").doc(''+uuidv4()).set(data).then(() => {
        /*  data['createdAt'] = GetDateView(ConvertStringToDate(data.date))
          this.state.comments.push(data);*/
          this.setState({text: '', headline: ''});
      })
      .catch((error) => {
          Alert.alert("Ошибка", "Не удалось добавить заметку");
      });
  }

  render() {

    let tags = this.state.tags.map((item)=>(<View style={styles.tag}>
                                              <Text style={{color: "#5A00C4"}}>{item}</Text>
                                            </View>))

      return(
        <View style={styles.container}>
            <View style={{backgroundColor: 'white', width: '100%', flex: 1, borderRadius: 10, marginBottom: 8, padding: 8, borderWidth: 2, borderColor: '#d6d8db',}}>

                <Input
                    style={{width: '100%',  fontWeight: 'bold'}}
                    onChangeText={text => this.setState({headline: text})}
                    value={this.state.headline}
                    placeholder="Введите заголовок"
                  />
                <Input
                  style={{width: '100%'}}
                  multiline
                  numberOfLines={8}
                  onChangeText={text => this.setState({text: text, errorText: ""})}
                  value={this.state.text}
                  placeholder="Введите текст заметки"
                  errorMessage={this.state.errorText}
                />
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Text style={{paddingLeft: 8}}>Состояние здоровья</Text>
                  <TouchableOpacity
                      style = {{margin: 8, fontSize: 12, alignItems: 'center',
                        justifyContent: 'center', backgroundColor: '#5A00C4', height: 40,
                        borderRadius: 50, width: 40}}
                      onPress = {() => this.props.navigation.navigate("HealthConditions",
                                                        {tags: this.state.tags, onGoBack: this.refreshtags.bind(this)})}>
                      <Text style = {{color: 'white', fontWeight: 'bold'}}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={{paddingLeft: 8, flexWrap: 'wrap', flexDirection: 'row'}}>
                  {tags}
                </View>
            </View>
          <View style = {styles.redSection}>
            <TouchableOpacity
              onPress={this._sendMessageAsync}>
              <Text style = {{color: 'white', fontWeight: 'bold'}}>Опубликовать</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e2e3e5",
    borderTopWidth: 0.5,
    borderTopColor: '#d6d8db',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
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
    backgroundColor: '#009789',
    borderWidth: 2,
    borderColor: '#009184',
    width: '100%',
    height: 50,
    borderRadius: 10
  },
  tag:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#5A00C4',
    borderRadius: 50,
    padding: 4,
    marginRight: 8,
    marginBottom: 8
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
