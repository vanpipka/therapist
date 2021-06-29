
import React from 'react';
import { Platform, TextInput, StyleSheet } from 'react-native';

export default class AutoExpandingTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        text: '',
        height: 0
    };
  }

  _onContentSizeChange = (props) => {
    this.props.onContentSizeChange(props);
  };

  _onChangeText = (text) => {
    this.setState({text: text});
    this.props.onChangeText(text);
  };

  render() {
    return (
      <TextInput
        {...this.props}
        multiline={true}
        onChangeText={(text) => {
            this._onChangeText(text);
        }}
        onContentSizeChange={(event) => {
            this._onContentSizeChange(event.nativeEvent.contentSize.height);
            this.setState({ height: event.nativeEvent.contentSize.height })
        }}
        style={[styles.default, {height: Math.max(40, this.state.height)}, this.props.styles]}
        value={this.state.text}
      />
    );
  }
}

const styles = StyleSheet.create({});
