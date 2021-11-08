import React from 'react';
import { Platform, Alert, ScrollView, ActivityIndicator, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import { Card, ListItem, Button, Avatar, Icon } from 'react-native-elements';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { ProgressBar, RadioButton, Dialog, Portal, Provider, Paragraph } from 'react-native-paper';
import ProgressCircle from 'react-native-progress-circle'
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
      //console.log(props.route.params);

      this.state={
          currentQuantity: 0,
          quantity: 0,
          data: props.route.params,
          maxScore: 0,
          step: 0,
          answer: -1,
          showQuestion: false
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

    // calculate max score
    let maxScore = 0;
    let data = this.state.data.questions;

    for (var i = 0; i < data.length; i++) {

      let max = 0;

      for (var x = 0; x < data[i]["answers"].length; x++) {
          if (data[i]["answers"][x]["score"] > max) {
              max = data[i]["answers"][x]["score"]
          }
      }

      maxScore += max

    }

    this.setState({maxScore: maxScore})

  }

  _goToNextPage() {

      if (this.state.answer == -1) {
          Alert.alert("Необходимо выбрать один из вариантов ответа.")
      }else{

        let data = this.state.data;
        data.questions[this.state.step-1]["result"] = this.state.currentQuantity;
        this.setState({step: this.state.step+1, data: data, answer: -1})
      }
  }

  _goToPrevPage() {

      //console.log(this.state.step);
      if (this.state.step == 1) {
          this.setState({showQuestion: true})
      }else{
          let result = this.state.data.questions[this.state.step-2]["result"]
          this.setState({step: this.state.step-1, answer: result+1})
      }

  }

  _closeTest() {
    this.setState({showQuestion: true})
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
                <TouchableOpacity style = {styles.redSection}
                  onPress={()=>{this.setState({step: this.state.step+1})}}>
                  <Text style = {{color: 'white', fontWeight: 'bold'}}>Начать тестирование</Text>
                </TouchableOpacity>
            </View>
          </View>
      );
    }else if (this.state.step > 0) {

      let questionsArray = this.state.data.questions;
      let questionId     = this.state.step - 1;
      let progress       = 0;
      let question       = {};

      if (questionsArray.length >= questionId) {
          question = questionsArray[questionId]
          progress = (questionId)*100/questionsArray.length/100;
      };

      if (progress === Infinity || progress > 1) {
          progress = 0;
      }

      if (question != undefined) {
        return (
          <Provider>
            <View style = {{flex:1}}>
              <SafeAreaInsetsContext.Consumer>
                {insets => <View style={{ paddingTop: insets.top, backgroundColor: "#009789" }} />}
              </SafeAreaInsetsContext.Consumer>
              <View style={{height: 50, backgroundColor: "#009789" }}>
                  <TouchableOpacity
                    style={{position: 'absolute', left: 8, top: 8, borderRadius: 50}}
                    onPress={()=>{this._goToPrevPage()}}>
                    <Icon name='arrow-back' color='white' />
                  </TouchableOpacity>

                  <View style={{paddingLeft: 50, paddingRight: 50, paddingTop: 10}}>
                    <View style={{alignItems: "center", marginBottom: 8}}>
                      <Text style={{fontWeight:'bold', color: 'white'}}>{questionId+1}/{questionsArray.length}</Text>
                    </View>
                    <ProgressBar progress={progress} color={'white'}/>
                  </View>

                  <TouchableOpacity
                    style={{position: 'absolute', right: 8, top: 8, borderRadius: 50}}
                    onPress={()=>{this._closeTest()}}>
                    <Icon
                      name='close'
                      color='white'
                      />
                  </TouchableOpacity>
              </View>

              <Text style={{color: "#009789", fontSize: 18, margin: 8}}>{question.name}</Text>
              <ScrollView style={{padding: 8}}>

                {
                  question.answers.map((l, i) => (
                    <View key={i}>
                      <TouchableOpacity style={[{flexDirection: 'row', alignItems: 'center', padding: 8, marginBottom: 8},
                            {backgroundColor: this.state.answer === l.number ? '#a1f0ea' : '#f9fafe'}]}
                        onPress ={() => this.setState({answer: l.number, currentQuantity: l.score})}>
                        <RadioButton
                          color   = 'white'
                          value   = {l.name}
                          status  = {this.state.answer === l.number ? 'checked' : 'unchecked' }
                          onPress ={() => this.setState({answer: l.number, currentQuantity: l.score})}
                        />
                        <Text style={{color: "grey"}}>{l.name}</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                }

              </ScrollView>
              <View style = {{margin: 8}}>
                  <TouchableOpacity style = {styles.redSection}
                    onPress={() => this._goToNextPage()}>
                    <Text style = {{color: 'white', fontWeight: 'bold'}}>Дальше</Text>
                  </TouchableOpacity>
              </View>
            </View>

            <Portal>
              <Dialog visible={this.state.showQuestion} onDismiss={()=>this.setState({showQuestion: false})}>
                <Dialog.Content>
                  <Paragraph>Вы действительно хотите завершить прохождение теста?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <TouchableOpacity
                    style={{margin: 8}}
                    onPress={()=>this.setState({showQuestion: false})}>
                    <Text style = {{color: 'grey', fontWeight: 'bold'}}>Нет</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{margin: 8}}
                    onPress={() => this.props.navigation.goBack()}>
                    <Text style = {{color: '#009789', fontWeight: 'bold'}}>Да</Text>
                  </TouchableOpacity>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </Provider>
        )
      }else{

        let quantity = 0;
        let result = "";
        let arr = this.state.data.questions;
        let arr_result = this.state.data.result;
        for (var i = 0; i < arr.length; i++) {
          quantity += arr[i]["answers"][arr[i]["result"]]["score"]
        }

        for (var i = 0; i < arr_result.length; i++) {
          if (quantity >= arr_result[i]["from"] && quantity<= arr_result[i]["to"]) {
                result = arr_result[i]["text"]
          }
        }

        let persent = quantity * 100 / this.state.maxScore;

        return (
          <View style = {{flex:1}}>
            <SafeAreaInsetsContext.Consumer>
              {insets => <View style={{ paddingTop: insets.top }} />}
            </SafeAreaInsetsContext.Consumer>
            <ScrollView>
              <View key={'1'} style={{padding: 8}}>
                <View style={{marginTop: 8, height: 200, borderColor: "green", borderWidth: 2, borderRadius: 10}}>
                    <Text>{data.name}</Text>
                    <Text>Дата: {new Date().toString()}</Text>
                </View>
                <Text style={{color: "#009789", fontSize: 18, margin: 8}}>Ваш результат</Text>
                <ProgressCircle
                    percent={persent}
                    radius={50}
                    borderWidth={8}
                    color="#3399FF"
                    shadowColor="#999"
                    bgColor="#fff"
                >
                    <Text style={{ fontSize: 18 }}>{quantity}/{this.state.maxScore}</Text>
                </ProgressCircle>
                <Text style={{color: "#009789", fontSize: 18, margin: 8}}>{result}</Text>
              </View>
            </ScrollView>
            <View style = {{margin: 8}}>
                <TouchableOpacity style = {styles.redSection}
                  onPress={() => {this.props.navigation.goBack()}}>
                  <Text style = {{color: 'white', fontWeight: 'bold'}}>Завершить</Text>
                </TouchableOpacity>
            </View>
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
