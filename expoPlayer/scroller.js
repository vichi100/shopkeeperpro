import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Slider,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Player from "./Player";


 
const randomHsl = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
const cards = Array(20).fill(0);

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class Scroller extends Component {
  async componentWillMount() {
    this.setState({
      loading: false,
      textInput: [],
      inputData: []
    });
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
          style={{
            height: 40,
            width: "55%",
            borderColor: "black",
            borderWidth: 1,
            margin: 1,
            paddingLeft: 5
          }}
          onChangeText={text => this.addItemName(text, index)}
        />
        <TextInput
          placeholder="Weight"
          style={{
            height: 40,
            width: "20%",
            borderColor: "black",
            borderWidth: 1,
            margin: 1,
            paddingLeft: 5
          }}
          onChangeText={text => this.addItemWeight(text, index)}
        />
        <TextInput
          placeholder="Price"
          style={{
            height: 40,
            width: "25%",
            borderColor: "black",
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

  //function to console the output
  getValues = () => {
    console.log("Data", this.state.inputData);
  };

  render() {
    return (
      // <SafeAreaView style={{ flex: 1, backgroundColor: '#6f6f6f' }}>
      //pluscircleo minuscircleo

      <KeyboardAwareScrollView
        ref="ScrollView"
        keyboardShouldPersistTaps={"always"}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* <ScrollView style={styles.scroll}> */}
        <View style={{ marginTop: 50, marginBottom: 50 }}>
        <Player
                  style={{ flex: 1, marginTop: 100 }}
                  // onComplete={this.playerComplete.bind(this)}
                  completeButtonText={"Return Home"}
                  uri={'AUDIO_CLIP_URL'}
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
        <ScrollView >
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
        <View style={styles.row}>
          <View style={{ margin: 10 }}>
            <TouchableOpacity
              onPress={() => this.removeTextInput()}
            >
              <AntDesign
                style={{ marginRight: 10, marginTop: 7 }}
                name="minuscircleo"
                size={30}
              />
            </TouchableOpacity>
          </View>
          <Text style={{ margin: 10 }}>ADD/REMOVE ITEMS</Text>
          <View style={{ margin: 10 }}>
            <TouchableOpacity  onPress={() => this.addTextInput(this.state.textInput.length)} >
              <AntDesign
                style={{ marginRight: 10, marginTop: 7, color: 'blue' }}
                name="pluscircleo"
                size={30}
                
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={{ margin: 10 }}>
            <TouchableOpacity
              onPress={() => this.addTextInput(this.state.textInput.length)}
            >
              <Text>CANCEL</Text>
            </TouchableOpacity>
          </View>

          <View style={{ margin: 10 }}>
            <TouchableOpacity onPress={() => this.removeTextInput()}>
              <Text>DONE</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </ScrollView> */}
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
      // </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    height: "80%",
    marginTop: 50
    // marginBottom: 50
  },
  card: {
    height: "100%",
    width: 200
  },
  buttonView: {
    flexDirection: "row"
  },
  textInputItemName: {
    height: 40,
    width: "60%",
    borderColor: "black",
    borderWidth: 1,
    margin: 3
  },
  textInput: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    margin: 3
  },
  row: {
    flexDirection: "row",
    justifyContent: "center"
  }
});

export default Scroller;
