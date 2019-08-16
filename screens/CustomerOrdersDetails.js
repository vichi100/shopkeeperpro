import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from "react-native";
import Card from "./cards/Card";
import { MaterialIcons } from "@expo/vector-icons";
import { AsyncStorage } from "react-native";

const window = Dimensions.get("window");

var email;
var mobile;

let w = window.Width;

// get perticular customer's orders details order by date
export default class CustomerOrdersDetails extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Customer Details",
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
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: true,
      dataSource: []
    };
  }

  async componentDidMount() {
    // var city = global.city;
    // var clubsDetailsURL = SERVER_URL + "customerOrders?customerMobile=" + customerMobile;
    // return await axios
    //   .get(clubsDetailsURL)
    //   .then(response => {
    //     console.log("clubs list data : " + JSON.stringify(response.data));
    //     this.setState({ dataSource: response.data, isLoading: false });
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
  }

  _createNewOrder = async (customerDetails, deliveryaddress) => {
    var shopmobile = await AsyncStorage.getItem("shopmobile");
    var shopname = await AsyncStorage.getItem("shopname");
    var shopaddress = await AsyncStorage.getItem("shopaddress");
    // console.log('shopmobile: '+ shopmobile);
    // console.log('shopname: '+ shopname);
    // console.log('shopaddress: '+ shopaddress);
    if (shopmobile == null || shopname == null || shopaddress == null) {
      //console.log("I am in Google signInx");
      this.props.navigation.navigate("LoginScreen", {
        LogingSceenData: "eventDataFromBookingScreen"
      });
    } else {
      //console.log("customer name: " + customerDetails.name);
      this.props.navigation.navigate("Grocery", {
        customerMobile: customerDetails.mobile,
        customerName: customerDetails.name,
        deliveryaddress: deliveryaddress
      });
    }
  };

  addAddress = (customerDetails, deliveryaddress) => {
    this.props.navigation.navigate("AddCustomerAddress", {
      customerMobile: customerDetails.mobile,
      customerName: customerDetails.name,
      deliveryaddress: deliveryaddress
    });
  };

  render() {
    const { navigation } = this.props;
    var customerDetails = navigation.getParam("customerDetails");
    // var customerMobile = navigation.getParam("customerMobile");
    // var customerName = navigation.getParam("customerName");
    var deliveryaddress = navigation.getParam("deliveryaddress");
    console.log("customerDetails: " + JSON.stringify(customerDetails));

    // if (this.state.isLoading) {
    //   return (
    //     <View style={{ flex: 1, justifyContent: "center" }}>
    //       <ActivityIndicator />
    //     </View>
    //   );
    // }

    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: "rgba(255,255,0,0.5)" }}>
          <Text
            style={{
              fontSize: 18,
              color: "#000",
              fontWeight: "600",
              padding: 10
            }}
          >
            {customerDetails.name}
          </Text>

          <View
            style={{ flexDirection: "row", marginLeft: 10, marginRight: 10 }}
          >
            <MaterialIcons style={styles.iconMobile} name="phone" size={20} />
            <Text style={{ fontSize: 14, color: "#000" }}>
              {customerDetails.mobile}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", marginLeft: 10, marginRight: 10 }}
          >
            <MaterialIcons
              style={styles.iconMobile}
              name="location-on"
              size={20}
            />

            {deliveryaddress ? (
              <Text style={{ fontSize: 14, color: "#000", paddingBottom: 7 }}>
                {" "}
                {deliveryaddress}{" "}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.addAddress(customerDetails, deliveryaddress)
                }
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#000",
                    paddingBottom: 7,
                    fontWeight: "500",
                    fontFamily: "sans-serif"
                  }}
                >
                  Add Address
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={{
            backgroundColor: "rgba(255,69,0, 0.7)",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 1
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#fff" }}>Orders: 10000</Text>
            <Text style={{ marginLeft: 15, marginRight: 15, color: "#fff" }}>
              |
            </Text>
            <Text style={{ color: "#fff" }}>Amount: Rs.50000000</Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "rgba(0,0,128, 0.4)",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 1
          }}
        >
          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#fff" }}>Orders Pending Amount: 10000</Text>
            {/* <Text style={{ marginLeft: 15, marginRight: 15, color: "#fff" }}>
              |
            </Text> */}
            <Text style={{ color: "#fff" }}>Pending Amount : Rs.50000000</Text>
          </View>
        </View>

        <View style={{ width: w }}>
          <TouchableOpacity
            onPress={() => this._createNewOrder(customerDetails)}
            style={{
              height: 50
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2196f3"
              }}
            >
              <Text style={{ color: "#ffffff" }}>CREATE NEW ORDER</Text>
            </View>
          </TouchableOpacity>
          {/* <Button
            onPress={this.buttonClickListener}
            title="BOOK"
            color="#263238" 
            height="40"
          /> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 2
  },
  touchButton: {
    alignSelf: "center",
    backgroundColor: "#2980b9",
    paddingVertical: 25,
    width: 295,
    margin: 15
  },
  touchButtonText: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold"
  },

  rowContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    //height: 100,
    //padding: 10,
    marginRight: 10,
    paddingLeft: 5,
    //marginLeft: 10,
    //marginTop: 5,
    //borderRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#ffffff"
    // shadowOpacity: 1.0,
    // shadowRadius: 1
  },
  dateContainer: {
    //marginLeft: 10,
    marginRight: 10
  },

  near_me: {
    margin: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    color: "#60B2E5"
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
  totalAmountStyle: {
    justifyContent: "space-between",
    flexDirection: "row",
    //flex: 1,
    flexWrap: "wrap",
    alignSelf: "baseline",
    marginTop: 10
    //padding: 16,
  }
});
