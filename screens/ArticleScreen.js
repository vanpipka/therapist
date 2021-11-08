import React from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Avatar, Icon } from 'react-native-elements';
import ArticleItem from '../components/ArticleItem';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
import { Input } from 'react-native-elements';
import AutoExpandingInputSection from '../components/AutoExpandingInputSection';
import { GetDateView, ConvertStringToDate, ConvertDateToString } from '../components/WebAPI';
import { v4 as uuidv4 } from 'uuid';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';

export default class Article extends React.PureComponent {

  //static navigationOptions = ({ navigation }) => {
  //    const { params } = navigation.state;
  //    return params;
  //}

  constructor(props) {
      super(props);
      const { navigation } = this.props;

      this.state=this.props.route.params;
      this.state['comments'] = [];
      this.state['message'] = '';
      this.state['refreshdata'] = true;
  }

  _setNavigationParams() {
    let title       = 'Запись';
  }

  componentDidMount(){
    this._setNavigationParams();
    this._loadDataAsync();
  }

  _loadDataAsync = async (props) => {

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

  _LoadDataAsync_1 = async (props) => {
    let database  = firebase.firestore();
    const snapshot = await database.collection('comments').where('link', '==', this.state.id).get();

    //

    let dataArray = [];
    snapshot.forEach((doc) => {

        let data = doc.data();
        data['createdAt'] = GetDateView(ConvertStringToDate(data.date))
        dataArray.push(data);
    });

    dataArray.sort((a, b) => a.date > b.date ? 1 : -1);

    this.setState({comments: dataArray})

  }

  _sendMessageAsync = async (props) => {

    if (props.text == '') {
        return
    }
    console.log("_sendMessageAsync");

    let database  = firebase.firestore();
    let data      = {
            author: this.state.user,
            date: ConvertDateToString(new Date()),
            link: this.state.id,
            text: props.text,
            verified: false
      }


    database.collection("comments").doc(''+uuidv4()).set(data).then(() => {
          data['createdAt'] = GetDateView(ConvertStringToDate(data.date))

          let comArray = this.state.comments;
          comArray.push(data);
          this.setState({message: '', comments: comArray});
      })
      .catch((error) => {
          Alert.alert("Ошибка", "Не удалось добавить комментарий");
      });
  }

  _onPressItem = (props) => {
      this.props.navigation.navigate("User", {user: {id: this.state.user.id,
                                                    name: this.state.user.name,
                                                    avatar: this.state.user.avatar},
                                            userInfo: props.data.author});
  };

  render() {

      let TextComponent = null;
      let text = this.state.text;
      let item = this.state;
      //console.log(this.state);
      let textJSON  = {};

        return (
          <View style={styles.container}>
            <ScrollView style={{width: '100%'}}>
              <ArticleItem
                    key = {item.id}
                    onPressItem={this._onPressItem}
                    shortCard={false}
                    data={item}
                    user={this.state.user}
              />
              <Card containerStyle={{borderRadius: 8, margin: 8}}>
                {this.state.commentsCount == 0 ?
                    <Text style={{margin: 8, color: '#009789', fontSize: 12, fontWeight: '700'}}>Комментариев еще нет</Text> :
                    <Text style={{margin: 8, color: '#009789', fontSize: 12, fontWeight: '700'}}>{this.state.commentsCount} комментариев</Text> }
                {this.state.comments.map((l, i) => (
                          <ListItem key={i} bottomDivider
                            onPress = {() => this.props.navigation.navigate("User", l.author)}>
                            <Avatar rounded source={{uri: l.author.avatar}} />
                            <ListItem.Content>
                              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                  <ListItem.Title style={{width: '75%'}}>
                                      {l.author.name}
                                  </ListItem.Title>
                                  <View style={{marginTop: 8, width: '25%'}}>
                                    <Text style={{fontSize: 10}}>{l.createdAt}</Text>
                                  </View>
                              </View>
                              <ListItem.Subtitle>{l.text}</ListItem.Subtitle>
                            </ListItem.Content>
                          </ListItem>
                        ))
                      }
              </Card>

            </ScrollView>
            <AutoExpandingInputSection
              onPress={this._sendMessageAsync}/>
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
    marginTop: 8
  },
  textInput: {
    backgroundColor: 'white',
    height: 40,
    borderColor: '#d6d8db',
    borderWidth: 0.5,
    paddingLeft: 8,
    width: '90%',
    maxHeight: 80
  },
});
