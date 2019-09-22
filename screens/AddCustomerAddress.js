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

// import MyTextInput from "./screens/MyTextInput";
import { SERVER_URL } from "../Constants";

import { TextField } from "react-native-material-textfield";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { AsyncStorage } from "react-native";

export default class AddCustomerAddress extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Update Address",
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
    this.state = {
      customermobile: null,
      customername: null,
      customeraddress: null,
      customeraddresslineone: null,
      customeraddresslinetwo: null,
      landmark: null,
      city: null,
      cityError: null,
      customeraddresslineoneerror: null,
    };
  }


  // _storeShopDetails = async (
  //   shopname,
  //   shopaddress,
  //   shopmobile,
  //   alternatemobile,
  //   city
  // ) => {
  //   await AsyncStorage.setItem("shopname", shopname);
  //   await AsyncStorage.setItem("shopaddress", shopaddress);
  //   await AsyncStorage.setItem("shopmobile", shopmobile);
  //   await AsyncStorage.setItem("alternatemobile", alternatemobile);
  //   await AsyncStorage.setItem("shopcity", city);
  // };

  addCustomerAddress = (customerid, customermobile) =>{
    console.log('customeraddresslineone: '+this.state.customeraddresslineone)
    console.log('city: '+this.state.city)

    if (this.state.customeraddresslineone == null || this.state.customeraddresslineone.trim() === "") {
      this.setState(() => ({ customeraddresslineoneerror: "Customer address required."}));
      return;
    } else {
      this.setState(() => ({ customeraddresslineoneerror: null}));
    }

    if (this.state.city == null || this.state.city.trim() === "") {
      this.setState(() => ({ cityError: "City name required."}));
      return;
    } else {
      this.setState(() => ({ cityError: null}));
    }

    var customerAddress = ''
    const addAddressQueryData = {
      customerid: customerid,
      customermobile: customermobile,
      customeraddresslineone: this.state.customeraddresslineone,
      customeraddresslinetwo: this.state.customeraddresslinetwo,
      landmark: this.state.landmark,
      city: this.state.city
    };

    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/addOrUpdateCustomerAddress",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: addAddressQueryData
    })
      .then(result => {
        // console.log("Resp Data: " + JSON.stringify(result.data));
        // console.log('result.data.length: '+result.data.length);
        // console.log('result.data.ordersummary: '+ result.data.ordersummary.totalcostofneworder)
        var count = Object.keys(result.data).length; 
        console.log('count: '+count)
        if(count > 0){
          this.setState({
            
            isLoading:false,
          });
        }else{
          console.log('I am in else')
          this.setState({isLoading:false,}) 
        }
        
        this.props.navigation.navigate("CustomerOrdersDetails", {
          from: 'addcustomeraddress',
          customeraddresslineone: this.state.customeraddresslineone,
          customeraddresslinetwo: this.state.customeraddresslinetwo,
          landmark: this.state.landmark,
          city: this.state.city,
              });  

      })
      .catch(error => {
        console.error(error);
        this.setState({isLoading:false,}) 
      });

  }

  render() {
    const { navigation } = this.props;
    const customerid = navigation.getParam("customerid");
    const customerMobile = navigation.getParam("customerMobile");
    const customerName = navigation.getParam("customerName");
    // var from = navigation.getParam("customerorderdetails");
    var customeraddresslineonex = navigation.getParam("customeraddresslineone");
    var customeraddresslinetwox= navigation.getParam("customeraddresslinetwo");
    if(customeraddresslinetwox === null){
      customeraddresslinetwox=''
    }
    var landmarkx= navigation.getParam("landmark");
    if(landmarkx === null){
      landmarkx = ''
    }
    var cityx= navigation.getParam("city");
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView>
          <View
            style={{
              marginTop: 30,
              alignItems: "center",
              justifyContent: "space-evenly"
              //backgroundColor: "blue"
            }}
          >
            <View style={{ marginTop: 10 }}>
              {/* <MyTextInput  plachoneholder="Mobile Number" keyboardType="number-pad" /> */}
              <TextField
                label="Customer Name"
                fontSize={14}
                value={customerName}
                // onChangeText={city => this.setState({ customername: customerName })}
                returnKeyType="next"
                autoCorrect={false}
                editable={false}
                enablesReturnKeyAutomatically={true}
              />
              <TextField
                label="Mobile"
                fontSize={14}
                value={customerMobile}
                // onChangeText={city => this.setState({ customermobile: customerMobile })}
                returnKeyType="next"
                autoCorrect={false}
                editable={false}
                enablesReturnKeyAutomatically={true}
              />
              <TextField
                label="House No, Building Name"
                fontSize={14}
                multiline={true}
                // value={customeraddresslineonex}
                onChangeText={customeraddresslineone => this.setState({ customeraddresslineone: customeraddresslineone })}
                returnKeyType="next"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                error={this.state.customeraddresslineoneerror}
              />
              <TextField 
                label="Road Name, Area, Colony"
                fontSize={14}
                multiline={true}
                // value={customeraddresslinetwox}
                onChangeText={customeraddresslinetwo =>
                  this.setState({ customeraddresslinetwo: customeraddresslinetwo })
                }
                returnKeyType="next"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
              /> 
              

              <TextField
                label="Landmark"
                fontSize={14}
                // value={landmarkx}
                onChangeText={landmark => this.setState({ landmark: landmark })}
                returnKeyType="next"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
              />

              <TextField
                label="City"
                fontSize={14}
                // value={cityx}
                onChangeText={city => this.setState({ city: city })}
                returnKeyType="next"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                error={this.state.cityError}
              />

              <TouchableOpacity onPress={() => this.addCustomerAddress(customerid, customerMobile)}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>UPDATE</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

// export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    marginTop: 40,
    justifyContent: "center",
    alignContent: "center"
  },
  image: {
    width: 60,
    height: 60
  },
  textInput: {
    color: "#989899",
    marginTop: 50,
    // flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: "center",
    fontSize: 14
  },
  button: {
    width: 325,
    borderColor: "#129793",
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderRadius: 24,
    marginTop: 90,
    backgroundColor: "#129793",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#129793",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 5,
    shadowOpacity: 0.8
  },
  buttonText: {
    color: "white",
    fontSize: 12
  },
  mobileContainer: {
    width: 325,
    borderColor: "#CFD0D1",
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    backgroundColor: "#F5F6F7"
  },
  textInput: {
    color: "#989899",
    // flex:1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14
  }
});
