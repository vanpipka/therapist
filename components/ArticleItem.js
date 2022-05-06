
import React from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native';
import { Card, ListItem, Button, Avatar, Icon } from 'react-native-elements';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
import { Input } from 'react-native-elements';
import { GetDateView, ConvertStringToDate, ConvertDateToString } from '../components/WebAPI';

export default class ArticleItem extends React.PureComponent {

  constructor(props) {
      super(props);
      this.state={data: this.props.data,
                refresh: false,
                user: this.props.user,
                shortCard: this.props.shortCard};
  }

  _onPress = () => {
    this.props.onPressItem(this.props);
  };

  _onPressLike = () => {

    //console.log(this.state.data.id);

    let database  = firebase.firestore();
    let newData = this.state.data;

    if (newData.liked) {
      database.collection("userInfo").doc(this.state.user.id).collection("likes").doc(this.state.data.id).delete().then(() => {
          database.collection("news").doc(this.state.data.id).collection("likes").doc(this.state.user.id).delete().then(() => {
                newData.liked = !newData.liked;
                this.setState({data: newData, refresh: !this.state.refresh});
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }else{
      database.collection("userInfo").doc(this.state.user.id).collection("likes").doc(this.state.data.id).set({date: ConvertDateToString(new Date())}).then(() => {
          database.collection("news").doc(this.state.data.id).collection("likes").doc(this.state.user.id).set({date: ConvertDateToString(new Date())}).then(() => {
              newData.liked = !newData.liked;
              this.setState({data: newData, refresh: !this.state.refresh});
          }).catch((error) => {
              console.error("Error removing document: ", error);
          });
        })
        .catch((error) => {
            Alert.alert("Ошибка", "Непредвиденная ошибка");
        });
    }


  };

  render() {

    //console.log('MyListItem render');
    let {data} = this.state;

    let TextComponent = null;
    let text  = data.text;
    let textJSON  = {};

    try {
        textJSON  = JSON.parse(text);
        TextArray = [];
        for (var i = 0; i < textJSON.data.length; i++) {

          let text = textJSON.data[i].text;

          if (this.state.shortCard == true) {
            if (i == 1) {
              text = text + "...";
              TextArray.push(<Text key ={i} style={textJSON.data[i].style}>{text}</Text>);
              break;
            }else{
              TextArray.push(<Text key ={i} style={textJSON.data[i].style}>{text}</Text>);
            }
          }else{
            TextArray.push(<Text key ={i} style={textJSON.data[i].style}>{text}</Text>);
          }
        };

        TextComponent = <ScrollView>
                            {TextArray}
                        </ScrollView>
    } catch (e) {
        if (this.state.shortCard) {
          if (text.length > 150) {
            text = text.substr(0, 147)+"..."
          }
        }
        TextComponent = <Text style = {{color: "grey", fontSize: 12}}>{text}</Text>
    };


      if (this.props.data.id == 'get_new_item') {
        return(
          <TouchableOpacity onPress={this._onPress}>
            <Card containerStyle={{borderRadius: 8, margin: 8, backgroundColor: '#97EBFF'}}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Avatar size="small" source={require('../assets/img/add_item.png')}/>
                  <View>
                    <Text style={{marginLeft: 8, color: 'grey', fontWeight:'700'}}>Что в твоей голове?</Text>
                    <Text style={{marginLeft: 8, color: '#009789'}}>Напиши что тебя беспокоит и обязательно получишь поддержку!</Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )
      }else{
        return(
          <TouchableOpacity onPress={this._onPress}>
              <Card containerStyle={{borderRadius: 8, margin: 8}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar size="small" rounded source = {{uri:data.author.avatar}}/>
                    <Text style={{marginLeft: 8}}>{data.author.name}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{marginLeft: 8, fontSize: 8}}>{data.date}</Text>
                  </View>
                </View>
                <View style={{marginTop: 8}}>
                  <Text style={{fontWeight:'700'}}>{data.title}</Text>
                  {TextComponent}
                </View>
                <View style={{marginTop: 8, marginBottom: 6}}>
                  <Text style={{color: '#8154b9', fontSize: 12, }}>{data.tags.join(', ')}</Text>
                </View>

                <Card.Divider/>

                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{alignItems: 'flex-start'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon
                        name='chat-bubble'
                        type='material-icons'
                        size={20}
                        color={data.commentsCount == 0 ? 'grey' : '#009789' }
                      />
                      {data.commentsCount == 0 ? null : <Text style={{color: '#009789', fontSize: 12}}>{data.commentsCount}</Text> }
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress = {this._onPressLike}>
                      <Icon
                        name='favorite'
                        type='material-icons'
                        color='grey'
                        containerStyle = {{marginLeft: 8}}
                        size={20}
                        color={data.liked ? 'red' : 'grey' }
                      />
                    </TouchableOpacity>
                  </View>
                </View>

              </Card>
          </TouchableOpacity>
        )
      }
  }
}
