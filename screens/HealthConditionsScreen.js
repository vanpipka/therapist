import React, { useState, useEffect } from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, ListItem, Button, Avatar, Icon, Input, CheckBox } from 'react-native-elements';
import { _setTagsInfoFromAsyncStorage } from '../components/WebAPI';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import {_getTagsInfoFromAsyncStorage} from '../components/WebAPI';
import * as firebase from 'firebase';
import { GetDateView, ConvertStringToDate, ConvertDateToString } from '../components/WebAPI';
import { v4 as uuidv4 } from 'uuid';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';

export default class HealthConditions extends React.PureComponent {

  static navigationOptions = ({navigation, screenProps}) => {

    //console.log('navigationOptions');
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

      this.state = {list: [], refresh: false, loading: true, tags: this.props.route.params.tags};

  }

  _setNavigationParams() {
    //console.log("AddArticle _setNavigationParams");
    this.props.navigation.setParams({title: 'Health Conditions'});
  }

  componentDidMount(){
    this._setNavigationParams();
    this._loadTagsInfo();
  }

  _loadTagsInfo = async () => {
    let tags = this.state.tags;
    let res  = await _getTagsInfoFromAsyncStorage();
    try {
      let tagsData = JSON.parse(res);
      let list = tagsData.data;
      list.forEach(function(item, i, tagsData) {
        if (tags.indexOf(item['id']) >= 0) {
          item['checked'] = true;
        }else{
          item['checked'] = false;
        }
      });

      this.setState({loading: false, list: list})
    } catch (e) {
    } finally {
    }

  }

  _onChangeText = (props) => {

    let data = this.state.list;

    data.forEach(function(item, i) {
      if (item['id'] === props.value.id) {
          item['checked'] = !item['checked'];
      };
    });

    this.setState({list: data, refresh: !this.state.refresh});
  };

  _saveHealthConditions = (props) => {

    let arr = [];

    this.state.list.map((item, index) => {
      if (item.checked === true) {
        arr.push({id: item.id})
      }
    });

    this.props.route.params.onGoBack(arr);
    this.props.navigation.goBack();
  }

  render () {
    //console.log(this.state);
    if (this.state.loading == true){
      return(
        <View style={styles.container}>
            <ActivityIndicator  size="large" color={Colors.colors.mainGreen} />
        </View>
      )
    };

    return (
      <View style={styles.container}>
        <ScrollView style={{width: '100%', padding: 0}}>

          {this.state.list.map((item) => <MyListItem
                                              key = {item.id}
                                              SetBooleanState = {this._onChangeText}
                                              refresh = {this.state.refresh}
                                              value={item}/>)}
        </ScrollView>
        <View style = {styles.redSection}>
          <TouchableOpacity
            onPress={this._saveHealthConditions}>
            <Text style = {{color: 'white', fontWeight: 'bold'}}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

class MyListItem extends React.PureComponent {

  _setBooleanState = () => {
    this.props.SetBooleanState(this.props);
  };

  render() {
    let props = this.props;
    return (
      <CheckBox
        left
        containerStyle={{marginRight: 0, marginLeft: 0}}
        onPress={this._setBooleanState}
        title={props.value.name}
        checked={props.value.checked}
        iconType='material'
        checkedIcon='check'
        uncheckedColor='white'
        checkedColor='#009789'
      />
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e2e3e5",
    borderTopWidth: 0.5,
    borderTopColor: '#d6d8db',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  redSection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009789',
    borderWidth: 2,
    borderColor: '#009184',
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginTop: 8

  }
});
