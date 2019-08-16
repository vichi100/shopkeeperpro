import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const BLUE = "#bbdefb";
const LIGHT_GRAY = "#D3D3D3";

import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export default class MyTextInput extends React.Component {
  state = {
    isFocused: false
  };

  handleFocus = event => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = event => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  render() {
    const { isFocused } = this.state;
    const { onFocus, onBlur, ...otherProps } = this.props;
    return (
      <View>
      <TextInput
        selectionColor={BLUE}
        underlineColorAndroid={
          isFocused ? BLUE : LIGHT_GRAY
        }
        placeholder="Email"
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        style={styles.textInput}
        
        {...otherProps}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width:width-180,
    paddingLeft: 10,
    fontSize:   18,
  }
});