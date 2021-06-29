import React from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import { Card, ListItem, Button, Avatar, Icon } from 'react-native-elements';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';


export default class TestsList extends React.PureComponent {

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

      console.log(props.route.params);
      this.state={
          data: props.route.params,
          loading: true
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
    let dataArray   = [];

    const snapshot = await database.collection('tests').where('group', '==', this.state.data.id).get();

    snapshot.forEach((doc) => {
              let data = doc.data();
              data['id'] = doc.id;
              dataArray.push(data);
            });
    console.log(dataArray);
    this.setState({testList: dataArray, loading: false})

  }

  render() {

    let width = Dimensions.get("window").width-8;
    let data  = this.state.data;

      if (this.state.loading == true) {
          return(
            <View style={styles.container}>
                <ActivityIndicator  size="large" color={Colors.colors.mainGreen} />
            </View>
          )
      }else{
        return (
          <View style = {{flex:1}}>
            <SafeAreaInsetsContext.Consumer>
              {insets => <View style={{ paddingTop: insets.top }} />}
            </SafeAreaInsetsContext.Consumer>
            <View>
              <View style={{height: 200, backgroundColor: 'red'}}>
                <ImageBackground source={{uri: data.image_url}} style={styles.image}>
                  <TouchableOpacity
                    style={{position: 'absolute', left: 8, top: 8, backgroundColor: "white", borderRadius: 50}}
                    onPress={()=>{this.props.navigation.goBack()}}>
                    <Icon
                      name='arrow-back'
                      color='grey'
                      />
                  </TouchableOpacity>
                  <View style={{borderRadius: 50, backgroundColor: 'white', paddingLeft: 8,
                      paddingRight: 8, alignItems: 'center', opacity: 0.8, justifyContent: 'center', position: 'absolute', left: 8, bottom: 8}}>
                    <Text style={{color: "#009789", fontSize: 20}}>{data.name}</Text>
                  </View>
                </ImageBackground>
              </View>
            </View>
            <ScrollView style={{margin: 8}}>
            {
              this.state.testList.map((l, i) => (
                <TouchableOpacity key={i} style={{width: width, marginBottom: 8}} onPress={()=>{this.props.navigation.navigate("Test", l)}}>
                  <Card containerStyle={[styles.card]}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{height: 100, borderRadius: 10, padding: 8}}>
                        <ImageBackground source={{uri: l.image_url}} style={{width: 100, height: '100%'}} imageStyle={{borderRadius: 7}}>
                        </ImageBackground>
                      </View>
                      <View style={{paddingRight: 20}}>
                        <Text style={{padding: 8, fontWeight: 'bold', color: '#009789'}}>{l.name}</Text>
                        <Text style={{padding: 8, color: 'grey'}}>{l.description.substring(0, 50)+'...'}</Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
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
    borderRadius:10,
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
