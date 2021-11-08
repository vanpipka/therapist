
import { registerRootComponent } from 'expo';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { GetTagsInfo } from './components/WebAPI';
import Begin from './screens/BeginScreen';
import Login from './screens/LoginScreen';
import Register from './screens/RegisterScreen';
import TestsList from './screens/TestsScreen';
import Test from './screens/TestScreen';
import Main from './screens/MainScreen';
import Chat from './screens/ChatScreen';
import User from './screens/UserScreen';
import VideoCall from './screens/VideoCallScreen';
import Article from './screens/ArticleScreen';
import AddArticle from './screens/AddArticleScreen';
import HealthConditions from './screens/HealthConditionsScreen';

//import VideoCall from './screens/VideoCallScreen';

const Stack = createStackNavigator();

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <NavigationContainer>
            <Stack.Navigator
            initialRouteName="Begin">
              <Stack.Screen
                name="Begin"
                component={Begin}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TestsList"
                component={TestsList}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Test"
                component={Test}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Main"
                component={Main}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Chat"
                component={Chat}
                options={({ route }) => ({ title: route.params.recipient.name})}
              />
              <Stack.Screen
                name="Article"
                component={Article}
                options={({ route }) => ({ title: "Статья"})}
              />
              <Stack.Screen
                name="AddArticle"
                component={AddArticle}
                options={{}}
              />
              <Stack.Screen
                name="User"
                component={User}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="HealthConditions"
                component={HealthConditions}
                options={{headerShown: true}}
              />
              <Stack.Screen
                name="VideoCall"
                component={VideoCall}
                options={{}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {

    return Promise.all([
      Asset.loadAsync([
        require('./assets/icon.png'),
      ]),
      //GetTagsInfo(),
      //Font.loadAsync({
        // This is the font that we are using for our tab bar
      //  ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        //'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      //}),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
