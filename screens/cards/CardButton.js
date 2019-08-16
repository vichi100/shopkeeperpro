import React, {Component} from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';
import { Touchable } from './src';

export default class CardButton extends Component {
  render() {
    //const newStyle = this.props.style || {};
    let directionStyle = this.props.inColumn===true ? styles.CardButtonInColumn : styles.CardButtonInRow;
    return (
      <Touchable style={[directionStyle, height=30, width=30]} onPress={()=>{this.props.onPress()}}>
        <Text style={this.props.color!==undefined ? [styles.buttonText, {color: '#29E7CD'}] : styles.buttonText}>{this.props.title.toUpperCase()}</Text>
      </Touchable>      
    );
  }
}

const styles = StyleSheet.create({
  CardButtonInRow: {
    height: 15,
    marginLeft: 5,
    marginTop: 1,
    marginBottom: 1,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  CardButtonInColumn: {
    height: 10,
    marginLeft: 8,
    marginTop: 2,
    marginBottom: 2,
    paddingLeft: 5,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 2
  },
  buttonText: {
    fontWeight: '400', 
    fontSize: 14,
    //marginTop:25,
  }
});