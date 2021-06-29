import React from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import { Card, ListItem, Button, Avatar, Icon } from 'react-native-elements';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';


export default class TestsScreen extends React.PureComponent {

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

      console.log('TEST SCREEN CONSTRUCTOR');

      this.state={
          user: props.route.params,
          loading: true,
          data: [],
      };

  }

  _setNavigationParams() {
    let title       = 'Тесты';

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

    const snapshot  = await database.collection('testGroups').get();

    snapshot.forEach((doc) => {
            let data          = doc.data();
            data['id']        = doc.id;
            data['haveGroup'] = (typeof data['subGroups'] !== "undefined");
            dataArray.push(data);
    });

    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].haveGroup !== true) {
            dataArray[i]['subGroups'] = [];
            const snapshot = await database.collection('tests').where('group', '==', dataArray[i].id).get();
            snapshot.forEach((doc) => {
              let data = doc.data();
              data['id']      = doc.id;
              data['itsTest'] = true;
              dataArray[i]['subGroups'].push(data);
            });
        }
    }

    this.setState({data: dataArray, loading: false})

  }

  _onPressItem = (props) => {

    console.log('=======================================');
    console.log(props);

    if (props.itsTest == true) {
      //console.log('true');
      this.props.navigation.navigate("Test", props)
    }else{
      //console.log('false');
      this.props.navigation.navigate("TestsList", props)
    }

      /*props.data['user'] = this.state.user;

      if (props.data['id'] == "get_new_item" ) {
        this.props.navigation.navigate("AddArticle", props.data);
      }else{
        this.props.navigation.navigate("Article", props.data);
      }*/
  };

  render() {

    let width = Dimensions.get("window").width/3;
    let data  = this.state.data;

      if (this.state.loading == true) {
          return(
            <View style={styles.container}>
                <ActivityIndicator  size="large" color={Colors.colors.mainGreen} />
            </View>
          )
      }else{
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 8}}>
            <ScrollView style={{padding: 8, width: '100%'}}>
              {
                data.map((l, i) => (
                  <View key = {i} style={{width: '100%', marginBottom: 8}}>
                    <Text style={{color: '#009789', fontWeight: 'bold', marginBottom: 8}}>{l.name}</Text>

                    <ScrollView horizontal={true} style={{paddingBottom: 8}}>
                    {
                      l.subGroups.map((l, i) => (
                        <TouchableOpacity key={i} onPress={() => this._onPressItem(l)}>
                          <Card containerStyle={[styles.card, {width: width}]}>
                              <View style={{height: 100, borderRadius: 25, padding: 8}}>
                                <ImageBackground source={{uri: l.image_url}} style={styles.image} imageStyle={{borderRadius: 17}}>
                                </ImageBackground>
                              </View>
                              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{padding: 8}}>{l.name}</Text>
                              </View>
                          </Card>
                        </TouchableOpacity>
                      ))
                    }
                    </ScrollView>


                  </View>
                  ))
              }
            </ScrollView>
          </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#f9fafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card:{
    marginRight: 8,
    padding: 0,
    borderRadius:25,
    paddingBottom: 8,
    borderColor: '#fff',
    borderWidth: 2,
    margin: 0,
    marginRight: 8
  },
  image:{
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center"
  }
});
