import React from "react";
import { View, Button } from "react-native";

import { showMessage, hideMessage } from "react-native-flash-message";
// import console = require("console");
import FlashMessage from "react-native-flash-message";



export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 , margin:100}}>
        <Button
          onPress={() => {
            /* HERE WE GONE SHOW OUR FIRST MESSAGE */
            console.log('hi')
            showMessage({
              message: "Simple message",
              type: "info",
            });
          }}
          title="Request Details"
          color="#841584"
        />
        <FlashMessage ref="myLocalFlashMessage" />   
      </View>
    );
  }
}
