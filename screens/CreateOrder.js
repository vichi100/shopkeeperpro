import React, { Component } from "react";
import * as Contacts from "expo-contacts";
import * as Permissions from "expo-permissions";

import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

import Card from "./cards/Card";
import NumericInput from "../screens/numericInput/NumericInput";

import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { SERVER_URL } from "../Constants";

export default class CreateOrder extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: true,
      text: "",
      contacts: [],
      arrayholder: [],
      dataSource: []
    };
  }

  async componentDidMount() {
    // Ask for permission to query contacts.
    const permission = await Permissions.askAsync(Permissions.CONTACTS);

    if (permission.status !== "granted") {
      // Permission was denied...
      return;
    }
    const contacts = await Contacts.getContactsAsync({
      fields: [
        Contacts.PHONE_NUMBERS
        //Contacts.EMAILS,
      ],
      pageSize: 2000,
      pageOffset: 0
    });
    if (contacts.total > 0) {
      //console.log(contacts )

      for (let i = 0; i < contacts.total; i++) {
        if (contacts.data[i] !== undefined && contacts.data[i].firstName) {
          try {
            var name = contacts.data[i].firstName;
            var lastName = contacts.data[i].lastName;
            var mobile = contacts.data[i].phoneNumbers[0].number;
            // console.log(contacts.data[i].firstName +' '+ lastName)
            // console.log(contacts.data[i].phoneNumbers[0].number);
            var fullName = name;
            if (lastName !== undefined) {
              fullName = name + " " + lastName;
            }

            const obj = { name: fullName, mobile: mobile, address: null };
            this.state.dataSource.push(obj); // Push the object
          } catch (e) {
            console.log("Error");
          }
        }
      }
      //console.log(this.state.arrayholder)

      this.setState({ arrayholder: this.state.dataSource, isLoading: false });
    }
  }

  // we get mobile number from customer phone and add them to shop customer list in background
  insertShopCustomersDetails = () => {
    var postData = {
      userid: this.state.userid,
      mobilenumber: this.state.mobile,
      email: this.state.email,
      name: this.state.name,
      expoToken: this.state.expoToken
    };

    this._storeCustomerData();

    // SEND Customer DETAILS TO SERVER -  START
    // return fetch(SERVER_URL+"insertCustomerDetails",{
    //   method: "POST",
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body:  JSON.stringify(postData)
    // })
    return (
      axios
        .post(SERVER_URL + "insertCustomerDetails", postData, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        // .then(response => response.json())
        .then(response => {
          console.log("data : " + response.data);
          this.setState({ dataSource: response.data, isLoading: false });

          console.log("data send to server");
        })
        .catch(error => {
          console.error(error);
        })
    );
    // SEND Customer DETAILS TO SERVER FINSH -END
  };

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.state.arrayholder.filter(function(item) {
      const query = text.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(query) >= 0 ||
        item.mobile.toLowerCase().indexOf(query) >= 0
      );
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      text: text
    });
  }
  ListViewItemSeparator = () => {
    //Item sparator view
    return (
      <View
        style={{
          height: 0.3,
          width: "90%",
          backgroundColor: "#080808"
        }}
      />
    );
  };

  _renderItem = ({ item }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.viewProductStyle}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <Text style={styles.instructions}>Girls/Free</Text>

          <NumericInput
            initValue={this.state.guestlistgirlcount}
            value={this.state.guestlistgirlcount}
            onChange={guestlistgirlcount =>
              this.pressedIncreaseGuestListGirlCount({
                guestlistgirlcount
              })
            }
            totalWidth={150}
            totalHeight={35}
            minValue={0}
            maxValue={3}
            step={1}
            iconStyle={{ fontSize: 15, color: "#434A5E" }}
            inputStyle={{ fontSize: 18, color: "#ffffff" }}
            valueType="real"
            borderColor="#C7CBD6"
            rightButtonBackgroundColor="#C7CBD6"
            leftButtonBackgroundColor="#C7CBD6"
          />
        </View>

        <Card containerStyle={{ padding: 10 }}>
          <View
            style={{ flexDirection: "row", marginLeft: 10, marginRight: 10 }}
          >
            <MaterialIcons style={styles.iconPersone} name="person" size={20} />
            <Text
              style={{
                fontSize: 14,
                color: "#000",
                fontWeight: "bold",
                fontFamily: "sans-serif"
              }}
            >
              {item.name}
            </Text>
          </View>
          {/* <Text>{item.name}</Text> */}

          <View
            style={{ flexDirection: "row", marginLeft: 10, marginRight: 10 }}
          >
            <MaterialIcons style={styles.iconMobile} name="phone" size={20} />
            <Text style={{ fontSize: 14, color: "#000" }}>{item.mobile}</Text>
          </View>

          {/* <Text>{item.mobile}</Text> */}
        </Card>
      </View>
    );
  };

  _getCustomerOrdersDetails = item => {
    console.log("customer name: " + item.name);
    this.props.navigation.navigate("CustomerOrdersDetails", {
      customerMobile: item.mobile,
      customerName: item.name,
      customerDetails: item
    });
  };

  _keyExtractor = (item, index) => index.toString();

  render() {
    if (this.state.isLoading) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      //ListView to show with textinput used as search bar
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid="transparent"
          placeholder="Search item here"
        />
        <FlatList
          data={this.state.dataSource}
          renderItem={this._renderItem}
          enableEmptySections={true}
          style={{ marginTop: 2 }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    //justifyContent: 'center',
    backgroundColor: "#ffffff", //'#ecf0f1',
    flex: 1
    //marginTop: 10,
    // paddingLeft: 16,
    // paddingRight: 16,
  },

  viewProductStyle: {},
  totalAmountStyle: {
    justifyContent: "space-between",
    flexDirection: "row",
    //flex: 1,

    marginTop: 10
    //padding: 16,
  },
  textStyle: {
    padding: 10
  },
  iconPersone: {
    width: 30,
    height: 30,
    color: "#0091ea"
    //borderRadius: 30,
    //borderWidth: 2,
    //borderColor: 'rgb(170, 207, 202)'
  },

  iconMobile: {
    width: 30,
    height: 30,
    color: "#4caf50"
    //borderRadius: 30,
    //borderWidth: 2,
    //borderColor: 'rgb(170, 207, 202)'
  },
  textInputStyle: {
    height: 40,
    marginTop: 15,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: "#009688",
    backgroundColor: "#FFFFFF"
  }
});
