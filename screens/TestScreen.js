import React from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import { Card, ListItem, Button, Avatar, Icon } from 'react-native-elements';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { ProgressBar, RadioButton } from 'react-native-paper';
import Urls from '../constants/Urls';
import Const from '../constants/Const';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
//import auth from '@react-native-firebase/auth';
//import Urls from '../constants/Urls';
//import { GetQueryResult, AssetExample } from '../components/WebAPI';


export default class Test extends React.PureComponent {

  static navigationOptions = ({navigation, screenProps}) => {

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

      console.log('TEST SCREEN CONSTRUCTOR_'+props.route.params.name);
      console.log(props.route.params);

      this.state={
          data: props.route.params,
          step: 0,
          answer: -1,
      };

  }

  _setNavigationParams() {
    let title       = 'Тесты';

    this.props.navigation.setParams({
      title,
    });
  }

  componentDidMount(){
    this._setNavigationParams();
  }

  _onPressItem = (props) => {

      console.log('start test');
  };

  render() {

    let width = Dimensions.get("window").width;
    let data  = this.state.data;

      if (this.state.loading == true) {
          return(
            <View style={styles.container}>
                <ActivityIndicator  size="large" color={Colors.colors.mainGreen} />
            </View>
          )
      }else if (this.state.step == 0) {
        return (
          <View style = {{flex:1}}>
            <SafeAreaInsetsContext.Consumer>
              {insets => <View style={{ paddingTop: insets.top }} />}
            </SafeAreaInsetsContext.Consumer>
            <ScrollView>
              <View key={'1'}>
                <View style={{height: 200}}>
                  <ImageBackground source={{uri: data.image_url}} style={styles.image}>
                    <TouchableOpacity
                      style={{position: 'absolute', left: 8, top: 8, backgroundColor: "white", borderRadius: 50}}
                      onPress={()=>{this.props.navigation.goBack()}}>
                      <Icon
                        name='arrow-back'
                        color='grey'
                        />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
                <Text style={{color: "#009789", fontSize: 18, margin: 8}}>{data.name}</Text>
                <Text style={{color: "grey", fontSize: 14, marginLeft: 8}}>{data.description}</Text>
              </View>
            </ScrollView>
            <View style = {{margin: 8}}>
              <View style = {styles.redSection}>
                <TouchableOpacity
                  onPress={()=>{this.setState({step: this.state.step+1})}}>
                  <Text style = {{color: 'white', fontWeight: 'bold'}}>Начать тестирование</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      );
    }else if (this.state.step > 0) {

      let questionsArray = this.state.data.questions;
      let questionId     = this.state.step - 1;
      let progress       = 0;
      let question       = {};

      console.log(questionsArray.length);
      console.log(questionId);

      if (questionsArray.length >= questionId) {
          question = questionsArray[questionId]
          console.log(questionsArray.length);
          console.log(questionId);
          progress = (questionId)*100/questionsArray.length/100;
      };

      if (progress === Infinity || progress > 1) {
          progress = 0;
      }

      console.log('=========================================');
      console.log(progress);

      if (question != undefined) {
        return (
          <View style = {{flex:1}}>
            <SafeAreaInsetsContext.Consumer>
              {insets => <View style={{ paddingTop: insets.top }} />}
            </SafeAreaInsetsContext.Consumer>
            <View style={{padding: 8}}>
              <Text style={{fontWeight:'bold', color: '#009789'}}>{questionId+1}/{questionsArray.length}</Text>
              <ProgressBar progress={progress} color={'#009789'}/>
            </View>
            <Text style={{color: "#009789", fontSize: 18, margin: 8}}>{question.name}</Text>
            <ScrollView>
              <View key={"1"}>
              {
                question.answers.map((l, i) => (
                  <RadioButton
                    value   = "hfllllff"
                    status  = {this.state.answer === l.number ? 'checked' : 'unchecked' }
                    onPress ={() => this.setState({answer: l.number})}
                  />
                ))
              }
              </View>
            </ScrollView>
            <View style = {{margin: 8}}>
              <View style = {styles.redSection}>
                <TouchableOpacity
                  onPress={()=>{this.setState({step: this.state.step+1, answers: -1})}}>
                  <Text style = {{color: 'white', fontWeight: 'bold'}}>Дальше</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }else{
        return (
          <View style = {{flex:1}}>
            <SafeAreaInsetsContext.Consumer>
              {insets => <View style={{ paddingTop: insets.top }} />}
            </SafeAreaInsetsContext.Consumer>
            <ScrollView>
              <View key={'1'}>
                <View style={{height: 200}}>
                  <ImageBackground source={{uri: data.image_url}} style={styles.image}>
                    <TouchableOpacity
                      style={{position: 'absolute', left: 8, top: 8, backgroundColor: "white", borderRadius: 50}}
                      onPress={()=>{this.props.navigation.goBack()}}>
                      <Icon
                        name='arrow-back'
                        color='grey'
                        />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
                <Text style={{color: "#009789", fontSize: 18, margin: 8}}>КОНЕЦ</Text>
              </View>
            </ScrollView>
          </View>
        )
      }


  }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#f9fafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card:{
    marginRight: 8,
    padding: 0,
    borderRadius:25,
    borderColor: '#fff',
    borderWidth: 2,
    margin: 0,
    marginRight: 8
  },
  image:{
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center"
  },
    redSection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009789',
    borderWidth: 2,
    borderColor: '#009184',
    width: '100%',
    height: 50,
    borderRadius: 10
  }
});
