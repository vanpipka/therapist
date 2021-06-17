import React from 'react';
import { Button, ScrollView, View, StyleSheet, AsyncStorage, ActivityIndicator, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import * as firebase from 'firebase';
import Colors from '../constants/Colors';
import { Text, ListItem, Avatar, Card, Icon, Divider, Badge } from 'react-native-elements'
import { GetDateView, ConvertStringToDate, _getUserIDFromAsyncStorage } from '../components/WebAPI';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import ArticleItem from '../components/ArticleItem';
import ErrorPage from '../screens/ErrorPage';

export default class User extends React.Component {

  constructor(props) {
    super(props);

    console.log("dddddddddddddddddddddddddddddd");
    console.log(props.route.params);
    console.log("dddddddddddddddddddddddddddddd");

    let params = props.route.params || {};
    params['loading'] = true;
    params['activityloading'] = true;
    params['articles'] = [];
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
        this._LoadActivityAsync_1();
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

    const docRef = await database.collection('userInfo').doc(this.state.userInfo.id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            let data    = doc.data();
            data['id']  = doc.id;
            if (data['tags'] == undefined) {
                data['tags'] = []
            }
            this.setState({userInfo: data, loading: false})
        } else {
            console.log("No user information!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  }

  _LoadActivityAsync_1 = async () => {

    let database      = firebase.firestore();
    let articlesArray  = [];

    if (this.state.id == '') {
      this.setState({error: {value: true, text: 'mistake'}, loading: false})
      return;
    }

    /*const query = await database.collection("/userInfo/"+this.state.user.id+"/likes").get();

    query.forEach((doc) => {
            let data = doc.data();
            likesArray.push(doc.id);
    });*/

    console.log(this.state);

    const query = await database.collection('news').where('author.id', '==', this.state.userInfo.id).get();

    query.forEach((doc) => {
            let data = doc.data();
            let tags = [];

            for (var i = 0; i < data.tags.length; i++) {
                tags.push(data.tags[i].id);
            };

            data['date'] = GetDateView(ConvertStringToDate(data.date));
            data['tags'] = tags,
            articlesArray.push(data);
    });

    this.setState({articles: articlesArray, activityloading: false})

  }
  _onPressVideo = async () => {

    this.props.navigation.navigate('VideoCall');

  }

  _onPressChat = async () => {

    let currentUser = await AsyncStorage.getItem("user_id");
    let recipient   = {name: this.state.userInfo.name,
                       id: this.state.userInfo.id,
                       avatar: this.state.userInfo.avatar};

    let data = {user: {id: currentUser,}, id: null, recipient: recipient};

    console.log(this.state.userInfo);

    this.props.navigation.navigate('Chat', data);

  }

  _onCloseError = (props) => {
    this.props.navigation.goBack();
  };

  _onPressItem = (props) => {

      props.data['user'] = this.state.user;
      this.props.navigation.navigate("Article", props.data);

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
          <View style = {{flex:1}}>
            <SafeAreaInsetsContext.Consumer>
              {insets => <View style={{ paddingTop: insets.top }} />}
            </SafeAreaInsetsContext.Consumer>
            <View style={styles.container}>
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
      let myArticleBlock = null;

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
          myStoryBlock = <ListItem key="5" bottomDivider>
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
          <ListItem key="5" bottomDivider>
            <View style={{ marginTop: -12}}>
                <Text style={{fontWeight:'bold'}}>История</Text>
                <Text style={{color: "grey"}}>
                  {userInfo.text}
                </Text>
            </View>
          </ListItem>
      }

      if (this.state.activityloading){
          myArticleBlock = <ListItem key="4" bottomDivider>
            <View style={{ marginTop: -12, flex: 1}}>
                <Text style={{fontWeight:'bold'}}>Записи</Text>
                <View style={{alignItems: 'center', width: '100%'}}>
                  <ActivityIndicator size="small" color={Colors.colors.mainGreen} />
                </View>
            </View>
          </ListItem>
      }else{
        if (this.state.articles.length == 0) {
          myArticleBlock =
            <ListItem key="4" bottomDivider>
              <View style={{ marginTop: -12}}>
                  <Text style={{fontWeight:'bold'}}>Записи</Text>
                  <Text style={{color: "grey"}}>
                    "Этот пользователь еще ничего не публиковал"
                  </Text>
              </View>
            </ListItem>
        }else{
          myArticleBlock =
            <ListItem key="4" bottomDivider>
              <View style={{ marginTop: -12}}>
                  <Text style={{fontWeight:'bold'}}>Записи: {this.state.articles.length}</Text>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 8}}>
                    <FlatList
                      style={{marginRight: -8, marginLeft: -8}}
                      data={this.state.articles}
                      extraData={this.props.uniqueValue}
                      keyExtractor={(item, index) => item.id}
                      renderItem={this._renderItem}
                    />
                  </View>
              </View>
            </ListItem>
        }

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
                {myArticleBlock}
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
    padding: 0,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
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
