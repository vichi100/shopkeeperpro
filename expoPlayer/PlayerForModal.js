import React, { Component } from "react";
// import { StyleSheet, View, ScrollView } from 'react-native';
// import { Button, Text } from 'native-base';
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
  Dimensions,
  ScrollView,
  Animated,
  Modal
} from "react-native";
import { Audio } from "expo-av";
import PropTypes from "prop-types";
import PlayTimeStamp from "./PlayTimeStamp";
// import PlaybackSlider from './PlaybackSlider';
import GetPlayButtonByStatus from "./GetPlayButtonByStatus";
import { FontAwesome } from "@expo/vector-icons";
// import Scroller from "./scroller";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import { withNavigation } from 'react-navigation';



import withPreventDoubleClick from "../withPreventDoubleClick";

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

const initialState = {
  isLoaded: false,
  isBuffering: "NOT_STARTED",
  playStatus: "LOADING", // LOADING, BUFFERING, PAUSED, STOPPED, PLAYING

  // legacy items
  isPlaying: false,
  durationMillis: 0,
  playbackMillis: 0,
  maxSliderValue: 0,
  currentSliderValue: 0,
  debugStatements: "debug info will appear here"
};
class Player extends Component {
  constructor(props) {
    super(props);
    this.sound = null;
    this.state = {
      ...initialState,
      modalVisible: false,
      loading: false,
      textInput: [],
      inputData: []
    };
  }

  componentDidMount = () => {
    this.loadSound();
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  //function to add TextInput dynamically
  addTextInput = index => {
    console.log("addTextInput");
    let textInput = this.state.textInput;
    textInput.push(
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
          width: "95%"
        }}
      >
        <TextInput
          placeholder="Item Name"
          placeholderTextColor={"rgba(58, 61, 64, 0.7)"}
          style={{
            height: 40,
            width: "55%",
            borderColor: "rgba(58, 61, 64, 0.4)",
            borderWidth: 1,
            margin: 1,
            paddingLeft: 5
          }}
          onChangeText={text => this.addItemName(text, index)}
        />
        <TextInput
          placeholder="Weight"
          placeholderTextColor={"rgba(58, 61, 64, 0.7)"}
          style={{
            height: 40,
            width: "20%",
            borderColor: "rgba(58, 61, 64, 0.4)",
            borderWidth: 1,
            margin: 1,
            paddingLeft: 5
          }}
          onChangeText={text => this.addItemWeight(text, index)}
        />
        <TextInput
          placeholder="Price"
          placeholderTextColor={"rgba(58, 61, 64, 0.7)"}
          style={{
            height: 40,
            width: "25%",
            borderColor: "rgba(58, 61, 64, 0.4)",
            borderWidth: 1,
            margin: 1,
            paddingLeft: 5
          }}
          onChangeText={text => this.addItemPrice(text, index)}
        />
      </View>
    );
    this.setState({ textInput });
  };

  //function to remove TextInput dynamically
  removeTextInput = () => {
    let textInput = this.state.textInput;
    let inputData = this.state.inputData;
    textInput.pop();
    inputData.pop();
    this.setState({ textInput, inputData });
  };

  //function to add text from TextInputs into single array
  addItemName = (text, index) => {
    let dataArray = this.state.inputData;
    let checkBool = false;
    if (dataArray.length !== 0) {
      dataArray.forEach(element => {
        if (element.index === index) {
          element.text = text;
          checkBool = true;
        }
      });
    }
    if (checkBool) {
      this.setState({
        inputData: dataArray
      });
    } else {
      dataArray.push({ text: text, index: index });
      this.setState({
        inputData: dataArray
      });
    }
  };

  addItemWeight = (text, index) => {
    let dataArray = this.state.inputData;
    let checkBool = false;
    if (dataArray.length !== 0) {
      dataArray.forEach(element => {
        if (element.index === index) {
          element.text = text;
          checkBool = true;
        }
      });
    }
    if (checkBool) {
      this.setState({
        inputData: dataArray
      });
    } else {
      dataArray.push({ text: text, index: index });
      this.setState({
        inputData: dataArray
      });
    }
  };

  addItemPrice = (text, index) => {
    let dataArray = this.state.inputData;
    let checkBool = false;
    if (dataArray.length !== 0) {
      dataArray.forEach(element => {
        if (element.index === index) {
          element.text = text;
          checkBool = true;
        }
      });
    }
    if (checkBool) {
      this.setState({
        inputData: dataArray
      });
    } else {
      dataArray.push({ text: text, index: index });
      this.setState({
        inputData: dataArray
      });
    }
  };

  loadSound = async () => {
    let sound = new Audio.Sound();
    try {
      sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      // console.log("this.props.myname: " + this.props.myname);
      let soundInfo = await sound.loadAsync({ uri: this.props.uri });
      this.setState({
        maxSliderValue: soundInfo.durationMillis,
        durationMillis: soundInfo.durationMillis,
        positionMillis: soundInfo.positionMillis,
        currentSliderValue: soundInfo.positionMillis,
        shouldPlay: soundInfo.shouldPlay,
        isPlaying: soundInfo.isPlaying,
        rate: soundInfo.rate,
        muted: soundInfo.isMuted,
        volume: soundInfo.volume,
        shouldCorrectPitch: soundInfo.shouldCorrectPitch,
        isPlaybackAllowed: true
      });
      this.sound = sound;
    } catch (error) {
      // An error occurred!
      console.warn(`Player.js loadSound error : ${error}`);
    }
  };

  addDebugStatement = statement => {
    this.setState({
      debugStatements: this.state.debugStatements.concat(`- ${statement}\n`)
    });
  };

  componentWillUnmount = () => {
    this.setState({ ...initialState });
    this.sound.setOnPlaybackStatusUpdate(null);
  };
  /*
  Function used to update the UI during playback
  Playback Status Order:
  1. isLoaded: false
  2. isLoaded: true, isBuffering: true, duration 1st available
  3. isloaded: true, isBuffering: false
  */
  onPlaybackStatusUpdate = playbackStatus => {
    let that = this;
    this.setState({
      prevPlaybackStatus: that.state.playbackStatus,
      playbackStatus: playbackStatus
    });

    if (playbackStatus.error) {
      this.setState({ playBackStatus: "ERROR" });
      this.addDebugStatement(
        `Encountered a fatal error during playback: ${playbackStatus.error}
        Please report this error as an issue.  Thank you!`
      );
    }

    if (playbackStatus.isLoaded) {
      // don't care about buffering if state.playStatus is equal to one of the other states
      // state.playStatus can only be equal to one of the other states after buffer
      // has completed, at which point state.playStatus is set to 'STOPPED'
      if (
        this.state.playStatus !== "PLAYING" &&
        this.state.playStatus !== "PAUSED" &&
        this.state.playStatus !== "STOPPED" &&
        this.state.playStatus !== "ERROR"
      ) {
        if (playbackStatus.isLoaded && !this.state.isLoaded) {
          this.setState({ isLoaded: true });
          this.addDebugStatement(`playbackStatus.isLoaded`);
        }
        if (this.state.isLoaded && playbackStatus.isBuffering) {
          this.setState({
            playStatus: "BUFFERING"
          });
          this.addDebugStatement(`playbackStatus.isBuffering IN_PROGRESS`);
        }
        if (
          this.state.isLoaded &&
          !playbackStatus.isBuffering &&
          playbackStatus.hasOwnProperty("durationMillis")
        ) {
          this.setState({
            playStatus: "STOPPED"
          });
          this.addDebugStatement(`playbackStatus.isBuffering COMPLETE`);
        }
      }

      // Update the UI for the loaded state
      if (playbackStatus.isPlaying) {
        this.addDebugStatement(
          `playbackStatus.positionMillis (here): ${playbackStatus.positionMillis}`
        );

        // Update  UI for the playing state
        this.setState({
          positionMillis: playbackStatus.positionMillis,
          currentSliderValue: playbackStatus.positionMillis
        });
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        this.addDebugStatement("playbackStatus is stopped");
        this.setState({
          playStatus: "STOPPED",
          isPlaying: false,
          positionMillis: playbackStatus.durationMillis,
          currentSliderValue: playbackStatus.durationMillis
        });
      }
    }
  };

  onSliderValueChange = value => {
    // set the postion of the actual sound object
    this.addDebugStatement(`onSliderValueChange: ${value}`);
    this.sound.setPositionAsync(value);
  };

  onPausePress = () => {
    console.log("onPausePress");
    if (this.sound != null) {
      this.sound.pauseAsync().then(() => {
        this.setState({ playStatus: "PAUSED" });
      });
    }
  };

  onPlayPress = () => {
    console.log("onPlayPress");
    // console.log("this.props.myname: " + this.props.voicetotext);
    if (this.props.voicetotext === false) {
      this.setModalVisible();
    }
    if (this.sound != null) {
      if (this.state.positionMillis === this.state.durationMillis) {
        this.sound.stopAsync().then(() => {
          this.sound.playAsync().then(() => {
            this.setState({ playStatus: "PLAYING" });
          });
        });
      } else {
        // just play from wherever we are
        this.sound
          .playAsync()
          .then(() => {
            this.setState({ playStatus: "PLAYING" });
          })
          .catch(err => {
            console.warn(`Player.js onPlayPress error: ${err}`);
          });
      }
    }
  };

  render() {
    const screenHeight = Dimensions.get("window").height;

    return (
      <View style={styles.container}>
        {/* <GetPlayButtonByStatus
          playStatus={this.state.playStatus}
          onPlayPress={this.onPlayPress.bind(this)}
          onPausePress={this.onPausePress.bind(this)}
        />  record-voice-over
*/}

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacityEx onPress={() => this.onPlayPress()}>
            <FontAwesome
              style={{
                color: "rgba(28, 144, 246, 0.5)",
                marginTop: 5,
                marginRight: 10
              }}
              name="play"
              size={20}
            />
          </TouchableOpacityEx>

          <Text style={{ marginLeft: 5, marginRight: 5, marginTop: 5 }}>
            VOICE ORDER
          </Text>

          <TouchableOpacityEx onPress={() => this.onPausePress()}>
            <FontAwesome
              style={{
                color: "rgba(28, 144, 246, 0.5)",
                marginLeft: 10,
                marginTop: 5
              }}
              name="pause"
              size={20}
            />
          </TouchableOpacityEx>
        </View>

        {this.props.showPlaybackSlider ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: 5,
              width: "100%"
            }}
          >
            {this.props.playbackSlider({
              maximumValue: this.state.maxSliderValue,
              onValueChange: this.onSliderValueChange,
              value: this.state.currentSliderValue,
              onSlidingComplete: this.onSlidingComplete
            })}
          </View>
        ) : null}

        {/* {this.props.showTimeStamp ? ( 
          <PlayTimeStamp
            playStatus={this.state.playStatus}
            sound={this.sound}
            positionMillis={this.state.positionMillis}
            durationMillis={this.state.durationMillis}
            timeStampStyle={this.props.timeStampStyle}
          />
        ) : null} */}

        {/* <View style={styles.container}> */}
        {/* <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text>Show Modal</Text>
        </TouchableHighlight> */}

        <Modal
          animationType="slide"
          transparent={false}
          presentationStyle="overFullScreen"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View
            style={{
              position: "absolute",
              margin: 10,
              marginTop: 22,
              height: "80%",
              // width: "90%",
              backgroundColor: "rgba(210, 237, 253, 0.9)",
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View>
              <KeyboardAwareScrollView
                ref="ScrollView"
                keyboardShouldPersistTaps={"always"}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View style={{ marginTop: 10, marginBottom: 50 }}>
                  <Player
                    style={{ flex: 1, marginTop: 100 }}
                    // onComplete={this.playerComplete.bind(this)}
                    completeButtonText={"Return Home"}
                    uri={
                      "http://192.168.0.100:6050/fetchVoiceOrder?filename=3000e06b-ab70-4c16-ac60-e5e6088bbedd_1571244701870"
                    }
                    showDebug={true}
                    showBackButton={true}
                    playbackSlider={renderProps => {
                      console.log({
                        "maximumValue: ": renderProps.maximumValue
                      });
                      return (
                        <Slider
                          minimimValue={0}
                          maximumValue={renderProps.maximumValue}
                          onValueChange={renderProps.onSliderValueChange}
                          value={renderProps.value}
                          style={{
                            width: "100%"
                          }}
                        />
                      );
                    }}
                  />
                  <ScrollView>
                    <View style={{ marginTop: 5, marginBottom: 20 }}>
                      {this.state.textInput.map(value => {
                        return value;
                      })}
                      <View style={styles.row}>
                        {this.state.textInput.length === 0
                          ? this.addTextInput(this.state.textInput.length)
                          : null}
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </KeyboardAwareScrollView>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ margin: 10 }}>
                  <TouchableOpacity onPress={() => this.removeTextInput()}>
                    <AntDesign
                      style={{
                        marginRight: 10,
                        marginTop: 7,
                        color: "rgba(99, 180, 28, 0.96)"
                      }}
                      name="minuscircleo"
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={{ margin: 10 }}>ADD/REMOVE ITEMS</Text>
                <View style={{ margin: 10 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.addTextInput(this.state.textInput.length)
                    }
                  >
                    <AntDesign
                      style={{
                        marginRight: 10,
                        marginTop: 7,
                        color: "rgba(99, 180, 28, 0.96)"
                      }}
                      name="pluscircleo"
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => this.setModalVisible(!this.state.modalVisible)}
                  style={{
                    // height: 40,
                    width: "40%",
                  }}
                >
                  <View
                    style={{
                      marginRight:5, 
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(228, 43, 5, 0.66)"
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#ffffff",
                        fontWeight: "500",
                        fontFamily: "sans-serif"
                      }}
                    >
                      CANCEL
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    
                    width: "40%",
                  }}
                  onPress={() => this.removeTextInput()}
                >
                  <View
                    style={{
                      marginLeft:5, 
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(5, 139, 228, 0.96)"
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#ffffff",
                        fontWeight: "500",
                        fontFamily: "sans-serif"
                      }}
                    >
                      DONE
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* </View> */}
      </View>
    );
  }
}

Player.propTypes = {
  onComplete: PropTypes.func,
  completeButtonText: PropTypes.string,
  audioMode: PropTypes.object,
  timeStampStyle: PropTypes.object,
  showTimeStamp: PropTypes.bool,
  showPlaybackSlider: PropTypes.bool,
  showDebug: PropTypes.bool,
  showBackButton: PropTypes.bool,
  sliderProps: PropTypes.shape({
    onSlidingComplete: PropTypes.function,
    onValueChange: PropTypes.function,
    minimumTrackTintColor: PropTypes.string,
    maximumTrackTintColor: PropTypes.string,
    thumbTintColor: PropTypes.string,
    maximumTrackImage: PropTypes.string,
    minimumTrackImage: PropTypes.string,
    thumbImage: PropTypes.string,
    trackImage: PropTypes.string
  })
};

Player.defaultProps = {
  audioMode: {
    allowsRecordingIOS: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    playsInSilentLockedModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    playThroughEarpieceAndroid: false
  },
  completeButtonText: "Finished",
  timeStampStyle: {
    color: "white",
    fontSize: 14
  },
  showTimeStamp: true,
  showPlaybackSlider: true,
  showDebug: false,
  showBackButton: true
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // display: 'flex',
    // justifyContent: 'space-between',
    alignItems: "center"
  },
  buttonStyle: {
    width: 64,
    height: 64,
    alignSelf: "center",
    // display: 'flex',
    justifyContent: "center",
    alignItems: "center"
  },
  containerpopup: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
    // marginTop: 200,
  },
  cover: {
    backgroundColor: "rgba(0,0,0,.5)"
  },
  sheet: {
    // position: "absolute",
    marginTop: 50,
    top: Dimensions.get("window").height,
    // left: 0,
    // right: 0,
    height: "75%",
    // height:700,
    justifyContent: "center"
  },
  popup: {
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80
  }
});

export default withNavigation(Player);

