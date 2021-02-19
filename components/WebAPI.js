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
