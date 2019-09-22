import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

export default class ShopRegistrationWarning extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Registration Help",
    headerBackTitle: null,
    headerStyle: {
      //backgroundColor: '#263238',
      //Background Color of Navigation Bar
    },
    headerTitleStyle: {
      justifyContent: "center",
      color: "#757575",
      textAlign: "left",
      flex: 1
    },
    headerTintColor: "#757575"
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        <Text style={{fontSize:14, fontFamily: "sans-serif"}}>
          Your mobile number already registered under other shop name, please
          call us for any help
        </Text>
        {/* <Text>please call us for any help</Text> */}
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          <MaterialIcons style={{ marginTop: 30 , marginRight: 10 }} name="phone" size={20} />
          <Text style={{ marginTop: 30 }}>+91 9867614466</Text>
        </View>
      </View>
    );
  }
}
