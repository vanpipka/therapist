import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';

export default class Chat extends React.Component {

  constructor(props) {
    super(props);
    this._LoadDataAsync_1 = this._LoadDataAsync_1.bind(this);

    console.log(props);

    this.state = {
      userid: props.route.params.id,
      messages: [],

    }

  };

  componentDidMount() {
    //this._loadDataAsync();
  /*  firebaseSvc.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );*/
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
    let getAllMessages = database.ref('messages').orderByChild("key/user1").equalTo(this.state.userid);

    getAllMessages.on('value', (snapshot) => {

      let messageArray = [];
      console.log('getAllMessages.on');

      const data = snapshot.val();

      for (var key in data) {
        messageArray.push(
          { _id: key,
            text: key,
            createdAt: new Date(),
            user: {
              _id: data[key]['user'],
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
        )

      }

      //console.log(messageArray);

      this.setState({messages: messageArray})

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

  onLoginPress(props) {

  }
  onSend(props){
      console.log('onSend');
      console.log(props);
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.userid,
        }}
      />
    );
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
