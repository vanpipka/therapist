import React from 'react';
import { Button, ScrollView, View, StyleSheet, AsyncStorage, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import Colors from '../constants/Colors';
import { Text, ListItem, Avatar, Card, Icon, Divider, Badge } from 'react-native-elements'
import { GetDateView, ConvertStringToDate } from '../components/WebAPI';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import ErrorPage from '../screens/ErrorPage';

export default class User extends React.Component {

  constructor(props) {
    super(props);

    let params = props.route.params || {};
    params['loading'] = true;
    params['userInfo'] = {};
    params['error'] = {value: false, text: ''};
    this.state = params;

  };

  componentDidMount() {
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

    if (this.state.id == '') {
      this.setState({error: {value: true, text: 'mistake'}, loading: false})
      return;
    }

    const docRef = await database.collection('userInfo').doc(this.state.id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            let data    = doc.data();
            data['id']  = this.state.id;
            if (data['tags'] == undefined) {
                data['tags'] = []
            }
            this.setState({userInfo: data, loading: false})
        } else {
            console.log("no user information!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  }

  _onPressVideo = async () => {

    this.props.navigation.navigate('VideoCall');

  }

  _onPressChat = async () => {

    let currentUser = await AsyncStorage.getItem("user_id");
    let recipient   = {name: this.state.userInfo.name,
                       id: this.state.userInfo.id,
                       avatar: this.state.userInfo.avatar};

    this.props.navigation.navigate('Chat', {user: {id: currentUser,}, id: null, recipient: recipient});

  }

  _onCloseError = (props) => {
    //console.log('[eq]');
    this.props.navigation.goBack();
  };

  render() {

    if (this.state.loading == true) {
        return(
          <View>
            <SafeAreaInsetsContext.Consumer>
              {insets => <View style={{ paddingTop: insets.top }} />}
            </SafeAreaInsetsContext.Consumer>
            <View style={{flex: 1}}>
                <ActivityIndicator size="large" color={Colors.colors.mainGreen} />
            </View>
          </View>
        )
    } else if (this.state.error.value == true){
      return(
        <ErrorPage
          errorText={this.state.error.text}
          onClose={this._onCloseError}/>
      )
    }else{

      let {userInfo} = this.state;
      let healthConditionsBlock = null;
      let myStoryBlock = null;

      if (userInfo.tags.length == 0) {
          healthConditionsBlock =
                    <ListItem key="3" bottomDivider>
                        <View style={{flexDirection: "row", alignItems: 'center', marginTop: -12}}>
                          <View style={{width: '50%'}}>
                            <Text style={{fontWeight:'bold'}}>Состояние здоровья</Text>
                            <Text style={{color: "grey"}}>
                              Этот пользователь еще не указал данных о своем здоровье
                            </Text>
                          </View>
                          <View style={{height: 130, width: '50%'}}>
                            <ImageBackground source={require('../assets/img/nothing.png')} style={styles.image}>
                            </ImageBackground>
                          </View>
                        </View>
                      </ListItem>
      }else{
          healthConditionsBlock =
                      <ListItem key="3" bottomDivider>
                        <View>
                          <Text style={{fontWeight:'bold', marginBottom: 4}}>Состояние здоровья</Text>
                          <ScrollView horizontal={true}>
                            {
                              userInfo.tags.map((l, i) => (
                                <View id = {i} style={{marginRight: 8, padding: 4, color: 'white', borderColor: '#8154b9', borderWidth: 2, borderRadius: 25, alignItems: "center"}}>
                                  <Text style={{color: '#8154b9'}}>{l}</Text>
                                </View>
                                ))
                            }
                          </ScrollView>
                        </View>
                      </ListItem>
      }

      if (userInfo.text == '' || userInfo.text == undefined){
          myStoryBlock = <ListItem key="2" bottomDivider>
            <View style={{flexDirection: "row", alignItems: 'center', marginTop: -12}}>
              <View style={{width: '50%'}}>
                <Text style={{fontWeight:'bold'}}>История</Text>
                <Text style={{color: "grey"}}>
                  Этот пользователь еще не добавил свою историю
                </Text>
              </View>
              <View style={{height: 130, width: '50%'}}>
                <ImageBackground source={require('../assets/img/nothing.png')} style={styles.image}>
                </ImageBackground>
              </View>
            </View>
          </ListItem>
      }else{
        myStoryBlock =
          <ListItem key="2" bottomDivider>
            <View style={{ marginTop: -12}}>
                <Text style={{fontWeight:'bold'}}>История</Text>
                <Text style={{color: "grey"}}>
                  {userInfo.text}
                </Text>
            </View>
          </ListItem>
      }

      return (
        <View style = {{flex:1}}>
          <SafeAreaInsetsContext.Consumer>
            {insets => <View style={{ paddingTop: insets.top }} />}
          </SafeAreaInsetsContext.Consumer>
          <View>
            <View style={{height: 200}}>
              <ImageBackground source={require('../assets/img/blur_fone.jpg')} style={styles.image}>
                <TouchableOpacity
                  style={{position: 'absolute', left: 8, top: 8, backgroundColor: "white", borderRadius: 50}}
                  onPress={()=>{this.props.navigation.goBack()}}>
                  <Icon
                    name='arrow-back'
                    color='grey'
                    />
                </TouchableOpacity>
                <Avatar containerStyle={{borderWidth: 4, borderColor: "white"}} size="xlarge" rounded source = {{uri:userInfo.avatar}}/>
                <Text style={{color: "white", fontSize: 20}}>{userInfo.name}</Text>
              </ImageBackground>
            </View>
          </View>
              <ListItem key="1" bottomDivider>
                <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
                  <TouchableOpacity
                        onPress={this._onPressChat}
                        style ={{
                            height: 40,
                            width: '49%',
                            borderRadius:25,
                            borderWidth: 2,
                            borderColor: '#009789',
                            backgroundColor : "white",
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                    <Text style={{color: '#009789',}}>Написать</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                        onPress={this._onPressChat}
                        style ={{
                            height: 40,
                            width: '49%',
                            borderRadius:25,
                            borderWidth: 2,
                            borderColor: '#ED0011',
                            backgroundColor : "white",
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: "row"
                        }}>
                    <Icon
                          name='volunteer-activism'
                          type='material-icons'
                          color='#ED0011'
                          size={16}
                        />
                    <Text style={{color: '#ED0011',}}> Обнять</Text>
                  </TouchableOpacity>
                </View>
              </ListItem>
              <ScrollView>
                <ListItem key="2" bottomDivider>
                  <View style={{flexDirection: "row", alignItems: 'center', marginTop: -12}}>
                    <View style={{width: '50%'}}>
                      <Text style={{fontWeight:'bold'}}>Важные события</Text>
                      <Text style={{color: "grey"}}>
                        Этот пользователь еще не добавил важных событий
                      </Text>
                    </View>
                    <View style={{height: 130, width: '50%'}}>
                      <ImageBackground source={require('../assets/img/nothing.png')} style={styles.image}>
                      </ImageBackground>
                    </View>
                  </View>
                </ListItem>
                {healthConditionsBlock}
                {myStoryBlock}
              </ScrollView>
        </View >
      );
    };
  }
}

/*Object {
  "adress": "Спб",
  "avatar": "https://pngicon.ru/file/uploads/gory.png",
  "birthday": "19880917010101",
  "email": "vanpipka@gmail.com",
  "geolocation": Object {
    "latitude": 59.9458384,
    "longitude": 30.3841883,
  },
  "id": "7agyFyMHWhZ332h7uexet1OhabG2",
  "name": "Андрей",
  "showEmail": true,
  "tags": Array [
    "Anxiety",
  ],
  "text": "Здесь моя история",
}
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0"
  }
});
