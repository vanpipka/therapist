
import React from 'react';
import { Platform, TextInput, StyleSheet, TouchableOpacity,  View} from 'react-native';
import { Icon } from 'react-native-elements';
import AutoExpandingTextInput from '../components/AutoExpandingTextInput';

export default class AutoExpandingInputSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        text: '',
        height: 0
    };
  }

  _onContentSizeChange = (props) => {
    this.setState({ height: props+16 })
  }

  _onChangeText = (text) => {
    this.setState({text: text})
  }

  _onPress = () => {
    this.props.onPress(this.state)
  }

  render() {
    return (
      <View
        style={[styles.default, {height: Math.max(56, this.state.height)}]}
        >
        <AutoExpandingTextInput styles={styles.textInput}
          onContentSizeChange = {this._onContentSizeChange}
          onChangeText = {this._onChangeText}/>
        <TouchableOpacity
          style = {{justifyContent: 'flex-end', width: '10%'}}
          onPress = {this._onPress}>
          <Icon
            name='send'
            type='material-icons'
            color='grey'
            size={16}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  default: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#e2e3e5',
    borderTopWidth: 0.5,
    borderTopColor: '#d6d8db',
    height: 56,
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 8,
    marginTop: 8
  },
  textInput: {
    backgroundColor: 'white',
    borderColor: '#d6d8db',
    borderWidth: 0.5,
    paddingLeft: 8,
    width: '90%',
    maxHeight: 400
  },
});
