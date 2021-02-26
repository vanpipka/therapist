import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import Colors from '../constants/Colors';
import { ListItem, Avatar } from 'react-native-elements'

export default class Dialogs extends React.Component {

  constructor(props) {
    super(props);
    this._LoadDataAsync_1 = this._LoadDataAsync_1.bind(this);
    this.state = {
      userid: props.route.params.id,
      dialogs: [],
      loading: true,
    }

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

    let database = firebase.database();
    console.log('_LoadDataAsync_1');
    let getAllMessages = database.ref('dialogs').orderByChild("user").equalTo(this.state.userid);
    getAllMessages.on('value', (snapshot) => {

      let dialogsArray = [];
      const data = snapshot.val();
      for (var key in data) {
        dialogsArray.push(
          { id: key,
            text: data[key].lastmessage.text,
            createdAt: data[key].lastmessage.createdAt,
            user: {
              id: data[key].recipient.id,
              name: data[key].recipient.name,
              avatar: data[key].recipient.url,
            },
          },
        )
      }

      console.log(dialogsArray);

      this.setState({dialogs: dialogsArray, loading: false})

      //updateStarCount(postElement, data);
    });

    /*database.ref('messages/'+uuidv4()).set({
        text: 'test',
        user: this.state.userid,
        recipient: 'XEJEfGAMw9f022ydrYjrE5wyueT2',
        createdAt : new Date(),
        user: this.state.userid,
      });*/
  }

  render() {
    if (this.state.loading == true) {
        return(
          <View style={styles.container}>
              <ActivityIndicator  size="large" color={Colors.colors.mainGreen} />
          </View>
        )
    }else{
      return (
        <View>
          {
            this.state.dialogs.map((l, i) => (
              <ListItem key={l.id} bottomDivider
                onPress = {() => this.props.navigation.navigate('Chat', {user: this.state.user, id: l.id})}>
                <Avatar rounded source={{uri: l.user.avatar}} />
                <ListItem.Content>
                  <ListItem.Title>{l.user.name}</ListItem.Title>
                  <ListItem.Subtitle>{l.text}</ListItem.Subtitle>
                </ListItem.Content>

              </ListItem>
            ))
          }
        </View>
      );
    };
  }
}


/*// 1.
get uid() {
  return (firebase.auth().currentUser || {}).uid;
}
// 2.
get timestamp() {
  return firebase.database.ServerValue.TIMESTAMP;
}

// 3.
send = messages => {
  for (let i = 0; i < messages.length; i++) {
    const { text, user } = messages[i];
    // 4.
    const message = {
      text,
      user,
      timestamp: this.timestamp,
    };
    this.append(message);
  }
};
// 5.
append = message => this.ref.push(message);*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
