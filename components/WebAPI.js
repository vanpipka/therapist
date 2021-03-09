import * as React from 'react';
import { Platform, Alert, AsyncStorage } from 'react-native';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import * as firebase from 'firebase';

export function AssetExample(props) {
  return 'Привет всем присутствующим!';
}

_getTagsInfoFromAsyncStorage = async () => {
  let tags = await AsyncStorage.getItem('tags');
  if (tags == null) {
      tags = await _getTagsInfo();
      await AsyncStorage.setItem("tags", tags);
  }

  return tags

};

_getTagsInfo = async (props) => {

    console.log("_getTagsInfo");

    if (!firebase.apps.length) {
      let FIREBASECONFIG = Const.FIREBASECONFIG;
      firebase.initializeApp(FIREBASECONFIG);
    };

    let database    = firebase.firestore();
    const snapshot  = await database.collection('tags').get();
    let dataArray   = [];

    snapshot.forEach((doc) => {
          let data = doc.data();
          dataArray.push({id: doc.id, date: data.name});
          console.log(dataArray);
    });

    let tagsString = JSON.stringify({data: dataArray});

    return tagsString;

}

export function ConvertDateToString(date){

  let getFullYear = date.getFullYear(); //2019
  let getMonth = "00"+date.getMonth(); // 10
  let getDate = "00"+date.getDate(); // 11
  let getHours = "00"+date.getHours(); // 10
  let getMinutes = "00"+date.getMinutes(); // 0
  let getSeconds = "00"+date.getSeconds(); // 0

  let convertdate = ""+date.getFullYear()+
                    getMonth.slice(-2)+
                    getDate.slice(-2)+
                    getHours.slice(-2)+
                    getMinutes.slice(-2)+
                    getSeconds.slice(-2);

  return convertdate;

}

export function ConvertStringToDate(stringDate){

  console.log('stringDate');
  console.log(stringDate);

  if (stringDate == undefined) {
      return new Date()
  }
  let date = ""+stringDate;
  let convertdate = new Date(date.substr(0, 4),
                              date.substr(4, 2),
                              date.substr(6, 2),
                              date.substr(8, 2),
                              date.substr(10, 2),
                              date.substr(12, 2));

  return convertdate;

}

export function GetDateView(date){

  let today = new Date();
  let d = new Date(date);
  let convertdate = "";

  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  let getFullYear = date.getFullYear(); //2019
  let getMonth = "00"+date.getMonth(); // 10
  let getDate = "00"+date.getDate(); // 11
  let getHours = "00"+date.getHours(); // 10
  let getMinutes = "00"+date.getMinutes(); // 0
  let getSeconds = "00"+date.getSeconds(); // 0

  if(d >= today){
    convertdate = getHours.slice(-2)+':'+
                      getMinutes.slice(-2);
  }else{
    convertdate = getDate.slice(-2)+'.'+
                      getMonth.slice(-2)+'.'+
                      date.getFullYear();
  }
  
  return convertdate;

}
