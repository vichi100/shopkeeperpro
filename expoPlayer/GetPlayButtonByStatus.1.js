import React from 'react';
import {
  Button, 
  Icon,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Slider,
  TouchableHighlight,
  Dimensions
} from "react-native";

const buttonStyle = {
  width: 64,
  height: 64,
  alignSelf: 'center',
  // display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const ICON_SIZE = 40;

const GetPlayButtonByStatus = (props) => {
  if (props.recordStatus === 'RECORDING') {
    
  } else {
    if (
      props.playStatus === 'BUFFERING' ||
      props.playStatus === 'LOADING' ||
      props.playStatus === 'NO_SOUND_FILE_AVAILABLE'
    ) {
      return (
        <Button title="ME" style={[buttonStyle]} onPress={() => {}}>
          {/* <Icon
            type="FontAwesome"
            name="hourglass"
            color="white"
            style={{ fontSize: ICON_SIZE - 6 }}
          /> */}
        </Button>
      );
    } else if (props.playStatus === 'PAUSED') {
      return (
        <Button
          title="Play"
          style={[buttonStyle]}
          onPress={props.onPlayPress}
        >
          {/* <Icon
            type="FontAwesome"
            name="play"
            color="white"
            style={{ fontSize: ICON_SIZE }}
          /> */}
        </Button>
      );
    } else if (props.playStatus === 'STOPPED') {
      return (
        <Button
          title="play"
          style={[buttonStyle]}
          onPress={props.onPlayPress}
        >
          {/* <Icon
            type="FontAwesome"
            name="play"
            color="white"
            style={{ fontSize: ICON_SIZE  }}
          /> */}
        </Button>
      );
    } else if (props.playStatus === 'PLAYING') {
      return (
        <Button title="pause" style={buttonStyle} onPress={props.onPausePress}>
          {/* <Icon
            type="FontAwesome"
            name="pause"
            color="white"
            style={{ fontSize: ICON_SIZE - 6 }}
          /> */}
        </Button>
      );
    } else if (props.playStatus === 'ERROR') {
      return (
        <Button title="exclamation-triangle" style={buttonStyle} onPress={() => {}}>
          {/* <Icon
            type="FontAwesome"
            name="exclamation-triangle"
            color="white"
            style={{ fontSize: ICON_SIZE - 10}}
          /> */}
        </Button>
      );
    } else {
      console.warn(
        `GetPlayButtonByStatus: unknown playStatus ${props.playStatus}`
      );
      return (
        <Button title="question-circle" style={buttonStyle} onPress={() => {}}>
          {/* <Icon
            type="FontAwesome"
            name="question-circle"
            color="white"
            style={{ fontSize: ICON_SIZE }}
          /> */}
        </Button>
      );
    }
  }
};

export default GetPlayButtonByStatus;
