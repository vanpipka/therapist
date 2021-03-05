import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import { ConvertDateToString, ConvertStringToDate } from '../components/WebAPI';

export default class Chat extends React.Component {

  constructor(props) {
    super(props);
    this._LoadDataAsync_1 = this._LoadDataAsync_1.bind(this);

    this.state = {

      user: props.route.params.user,
      recipient: props.route.params.recipient,
      dialog: props.route.params.id,
      messages: [],
    }

    console.log(this.state);

  };

  componentDidMount() {
    this._loadDataAsync();
  /*  firebaseSvc.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );*/
  }

  componentWillUnmount() {
    firebase.database().ref('messages').off();
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
    //console.log('_LoadDataAsync_1');
    let database = firebase.database();
    let getAllMessages = database.ref('messages').orderByChild("dialog").equalTo(this.state.dialog);

    getAllMessages.on('value', (snapshot) => {

      let messageArray = [];
      //console.log('getAllMessages.on');

      const data = snapshot.val();

      for (var key in data) {

        //console.log(data[key]);

        messageArray.push(
          {
            _id: key,
            text: data[key]['text'],
            createdAt: ConvertStringToDate(data[key]['createdAt']),
            user: {
              _id: data[key].user.id,
              name: data[key].user.name,
              avatar: data[key].user.avatar,
            },
          },
        )

      }

      //console.log(messageArray);

      messageArray.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);

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

      let messageData = {
        user: this.state.user,
        text: props[0].text,
        createdAt: ConvertDateToString(props[0].createdAt),
        recipient: this.state.recipient,
        dialog: this.state.dialog,
      };

      firebase.database().ref('messages/'+props[0]._id).set(messageData, (error) => {
        if (error) {
          // The write failed...
        } else {

          /*let updates = {};
          updates['dialogs/'+messageData.user.id+'/user'] = messageData.user.id;
          updates['dialogs/'+messageData.recipient.id+'/user'] = messageData.recipient.id;
          firebase.database().ref().update(updates);*/


          //ОБновим данные в диалогах
          firebase.database().ref('dialogs/'+messageData.user.id+'/dialogs/'+this.state.dialog).set(
                          { text: messageData.text,
                            createdAt: messageData.createdAt,
                            recipient: messageData.recipient}
                        );

          firebase.database().ref('dialogs/'+messageData.recipient.id+'/dialogs/'+this.state.dialog).set(
                          { text: messageData.text,
                            createdAt: messageData.createdAt,
                            recipient: messageData.user}
                          );
        }
      });
    /*  Array [
        Object {
          "_id": "b5105435-60f1-49dc-9e8a-a04ba24ec17e",
          "createdAt": 2021-03-01T11:34:25.845Z,
          "text": "Гаоала",
          "user": Object {
            "_id": "7agyFyMHWhZ332h7uexet1OhabG2",
          },
        },
      ]*/

  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.user.id,
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
