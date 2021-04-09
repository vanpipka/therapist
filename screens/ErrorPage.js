import * as React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

export default class ErrorPage extends React.PureComponent {

  _onPress = () => {
    this.props.onClose();
  };

  render() {

    return (
      <View style={styles.container}>
        <SafeAreaInsetsContext.Consumer>
          {insets => <View style={{ paddingTop: insets.top }} />}
        </SafeAreaInsetsContext.Consumer>
        <View style={{justifyContent: 'flex-end', flexDirection: 'column', width: '100%'}}>
            <Icon
              name='close'
              color='white'
              containerStyle={{marginTop: 16, marginRight: 16, alignSelf: 'flex-end', backgroundColor: '#009789', borderRadius:50}}
              onPress={this._onPress}/>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../assets/img/nothing.png')} style={styles.image}/>
          <Text style={{color: '#ED0011'}}>{this.props.errorText}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    resizeMode: "stretch",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
  },
});
