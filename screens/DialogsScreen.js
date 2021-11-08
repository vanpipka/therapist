import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import Colors from '../constants/Colors';
import { ListItem, Avatar } from 'react-native-elements'
import { GetDateView, ConvertStringToDate } from '../components/WebAPI';

export default class Dialogs extends React.Component {

  constructor(props) {
    super(props);
    this._LoadDataAsync_1 = this._LoadDataAsync_1.bind(this);
    console.log("DialogsScreen ");
    console.log(props);
    this.state = {
      user: props.route.params,
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
    console.log('_LoadDataAsync_2');
    let getAllMessages = database.ref('dialogs').orderByKey().equalTo(this.state.user.id);
    getAllMessages.on('value', (snapshot) => {

      let dialogsArray = [];
      const data = snapshot.val();
      for (var key in data) {

        let dialogs = data[key].dialogs;

        for (var key in dialogs) {

          let createdAt = ConvertStringToDate(dialogs[key].createdAt);

          dialogsArray.push(
            { id: key,
              text: dialogs[key].text,
              createdAt: createdAt,
              createdAtStr: GetDateView(createdAt),
              user: {
                id: dialogs[key].recipient.id,
                name: dialogs[key].recipient.name,
                avatar: dialogs[key].recipient.avatar,
              },
            },
          )
        }
      }

      dialogsArray.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);

      this.setState({dialogs: dialogsArray, loading: false})

    });

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
                onPress = {() => this.props.navigation.navigate('Chat', {user: this.state.user, id: l.id, recipient: l.user})}>
                <Avatar rounded source={{uri: l.user.avatar}} />
                <ListItem.Content>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <ListItem.Title style={{width: '80%'}}>
                          {l.user.name}
                      </ListItem.Title>
                      <View style={{marginTop: 8, width: '20%'}}>
                        <Text style={{fontSize: 10}}>{l.createdAtStr}</Text>
                      </View>
                  </View>
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
