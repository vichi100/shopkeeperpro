import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Navigator,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Button,
  Dimensions
} from "react-native";
import Collapsible from "react-native-collapsible";

const window = Dimensions.get("window");

export default class HelpScreen extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Help?",
    headerBackTitle: null,
    headerStyle: {
      //backgroundColor: "#263238"
      //Background Color of Navigation Bar
    },
    headerTitleStyle: {
      justifyContent: "center",
      color: "#757575",
      textAlign: "left",
      flex: 1
    }
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.toggleExpanded(item.orderid)}
          delayLongPress={1000}
        >
          <Text>How to create order</Text>
        </TouchableOpacity>
        <Collapsible
          collapsed={!(activeSections && activeSections.includes(item.orderid))}
          align="center"
        >
          <Text>1. Touch on customer which is at bottom</Text>
          <Image
            source={{ uri: rowData.picture.thumbnail }}
            style={{ height: 30, width: window }}
          />
          <Text>
            2. Now Customers list screen will open, touch on customer name for
            which you want to create order.
          </Text>
          <Image
            source={{ uri: rowData.picture.thumbnail }}
            style={{ height: 30, width: window }}
          />
          <Text>
            3. Now Customer details screen will open, touch on button "CREATE
            NEW ORDER" to create order.
          </Text>
          <Image
            source={{ uri: rowData.picture.thumbnail }}
            style={{ height: 30, width: window }}
          />
          <Text>
            4. Now add item from list to bucket by touching "ADD" button. You
            can also search items by typing in "Search Here" place in search box
            at top.
          </Text>
          <Image
            source={{ uri: rowData.picture.thumbnail }}
            style={{ height: 30, width: window }}
          />
          <Text>
            5. When finished adding items to bucket, touch bucket icon at top
            right hand corner.
          </Text>
          <Image
            source={{ uri: rowData.picture.thumbnail }}
            style={{ height: 30, width: window }}
          />
          <Text>
            6. Now order basket will open, touch on "SHARE ORDER WITH CUSTOMER"
            button at bottom of screen.
          </Text>
          <Image
            source={{ uri: rowData.picture.thumbnail }}
            style={{ height: 30, width: window }}
          />
        </Collapsible>
      </View>
    );
  }
}
