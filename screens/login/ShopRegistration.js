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
import { SERVER_URL } from "../../Constants";

import { TextField } from "react-native-material-textfield";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { AsyncStorage } from "react-native";

var shopmobile;

export default class ShopRegistration extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Shop Registration",
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
      shopid: null,
      shopmobile: null,
      shopname: "",
      shopaddress: "",
      alternatemobile: "",
      landmark: "",
      city: "",
      shopnameError: null,
      shopaddressError: null,
      cityError: null,
      textEditable: true
    };
  }

  async componentDidMount() {
    console.log("fetchShopDetails");
    const shopQueryData = {
      shopmobile: shopmobile
    };

    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/fetchShopDetails",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: shopQueryData
    })
      .then(result => {
        console.log("Resp Data: " + JSON.stringify(result.data));
        // console.log('result.data.ordersummary: '+ result.data.ordersummary.totalcostofneworder)
        var count = Object.keys(result.data).length;
        console.log("count: " + count);
        if (count > 0) {
          this.setState({
            shopid: result.data[0].shopid,
            shopname: result.data[0].shopname,
            shopmobile: shopmobile,
            shopaddress: result.data[0].shopaddress,
            alternatemobile: result.data[0].alternatemobile,
            city: result.data[0].city,
            textEditable: false
          });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({ isLoading: false });
      });
  }

  yesMyShop = async shopmobile => {
    console.log("this.state.shopmobile: " + this.state.shopmobile);
    console.log("shopmobile: " + shopmobile);
    const expotoken = await AsyncStorage.getItem("expotoken");
    console.log("shopmobile: " + expotoken);
    console.log("this.state.shopid: " + this.state.shopid);
    const requestBody = {
      shopmobile: shopmobile,
      expotoken: expotoken
    };

    

    axios({
      url: SERVER_URL + "/updateShopExpoToken",
      method: "POST",
      data: requestBody
    }).then(result => {
      console.log("Resp Data after updateShopExpoToken: " + JSON.stringify(result));
      this._storeShopDetails(
        this.state.shopname,
        this.state.shopaddress,
        this.state.shopmobile,
        this.state.alternatemobile,
        this.state.city,
        this.state.shopid
      );
      this.props.navigation.navigate("MainTabNavigator");
    });
  };

  notMyShop = () => {
    this.props.navigation.navigate("ShopRegistrationWaring");
  };

  registerShop = async shopmobile => {
    const shopaddress = this.state.shopaddress + " , " + this.state.landmark;
    //console.log('shopaddress '+shopaddress)
    const shopname = this.state.shopname;
    const city = this.state.city;
    const alternatemobile = this.state.alternatemobile;
    const expotoken = await AsyncStorage.getItem("expotoken");
    console.log("vichi expotoken: " + expotoken);
    console.log("city: " + city); 

    if (shopname == null || shopname.trim() === "") {
      this.setState(() => ({ shopnameError: "Shop name required." }));
      return;
    } else {
      this.setState(() => ({ shopnameError: null }));
    }

    if (
      this.state.shopaddress == null ||
      this.state.shopaddress.trim() === ""
    ) {
      this.setState(() => ({ shopaddressError: "Shop address required." }));
      return;
    } else {
      this.setState(() => ({ shopaddressError: null }));
    }

    if (city == null || city.trim() === "") {
      this.setState(() => ({ cityError: "City required." }));
      return;
    } else {
      this.setState(() => ({ cityError: null }));
    }

    const requestBody = {
      shopname: shopname,
      shopaddress: shopaddress,
      shopmobile: shopmobile,
      alternatemobile: alternatemobile,
      expotoken: expotoken,
      city: city 
    };
    console.log("registerShop");
    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/registerShop",
      method: "POST",
      data: requestBody
    }).then(result => {
      console.log("Resp Data: " + JSON.stringify(result.data));
      // store shop details in local
      var shopid = result.data.shopid.toString();
      console.log("shopid: " + shopid);
      this._storeShopDetails(
        shopname,
        shopaddress,
        shopmobile,
        alternatemobile,
        city,
        shopid
      );
      this.props.navigation.navigate("MainTabNavigator");
    });
  };

  _storeShopDetails = async (
    shopname,
    shopaddress,
    shopmobile,
    alternatemobile,
    city,
    shopid
  ) => {
    try {
      console.log("_storeShopDetails shopid 1: " + shopid);
      console.log("_storeShopDetails city : " + city);
      await AsyncStorage.setItem("shopid", shopid);
      await AsyncStorage.setItem("shopmobile", shopmobile);
      await AsyncStorage.setItem("shopname", shopname);
      await AsyncStorage.setItem("shopaddress", shopaddress);
      await AsyncStorage.setItem("alternatemobile", alternatemobile);
      await AsyncStorage.setItem("shopcity", city);
      console.log("_storeShopDetails shopid finished: " + shopid);
      
    } catch (error) {
      console.log(' Error in _storeShopDetails: '+error)
    }
  };

  render() {
    const { navigation } = this.props;
    shopmobile = navigation.getParam("shopmobile");

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
              marginTop: 50,
              alignItems: "center",
              justifyContent: "space-evenly"
              //backgroundColor: "blue"
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                style={styles.image}
                source={require("../../assets/images/icologo.png")}
                resizeMode={"contain"}
              />
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                  fontSize: 15,
                  fontWeight: "500",
                  fontFamily: "sans-serif"
                }}
              >
                ShopKeeper Pro
              </Text>
            </View>

            <View style={{ marginTop: 50 }}>
              {/* <MyTextInput  plachoneholder="Mobile Number" keyboardType="number-pad" /> */}
              <TextField
                label="Shop Name"
                fontSize={14}
                value={this.state.shopname}
                onChangeText={shopname => this.setState({ shopname: shopname })}
                returnKeyType="next"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                error={this.state.shopnameError}
                editable={this.state.textEditable}
              />
              <TextField
                label="Alternate Mobile"
                fontSize={14}
                value={this.state.alternatemobile}
                maxLength={10}
                onChangeText={alternatemobile =>
                  this.setState({ alternatemobile: alternatemobile })
                }
                returnKeyType="next"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                //error={this.state.shopnameError}
                keyboardType="number-pad"
                editable={this.state.textEditable}
              />
              <TextField
                label="Shop Address"
                multiline={true}
                fontSize={14}
                value={this.state.shopaddress}
                onChangeText={shopaddress =>
                  this.setState({ shopaddress: shopaddress })
                }
                returnKeyType="next"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                error={this.state.shopaddressError}
                editable={this.state.textEditable}
              />

              <TextField
                label="Landmark"
                fontSize={14}
                value={this.state.landmark}
                onChangeText={landmark => this.setState({ landmark: landmark })}
                returnKeyType="next"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                editable={this.state.textEditable}
              />

              <TextField
                label="City"
                fontSize={14}
                value={this.state.city}
                onChangeText={city => this.setState({ city: city })}
                returnKeyType="next"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                error={this.state.cityError}
                editable={this.state.textEditable}
              />

              {this.state.textEditable === true ? (
                <TouchableOpacity onPress={() => this.registerShop(shopmobile)}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>REGISTER</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text
                    style={{
                      marginTop: 20,
                      color: "#ff1744",
                      fontWeight: "500"
                    }}
                  >
                    IS THIS YOUR SHOP?
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <TouchableOpacity onPress={() => this.notMyShop()}>
                      <View style={styles.subbutton}>
                        <Text style={styles.buttonText}>NO</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.yesMyShop(shopmobile)}
                    >
                      <View style={styles.subbutton}>
                        <Text style={styles.buttonText}>YES</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
  subbutton: {
    width: 130,
    borderColor: "#129793",
    borderWidth: 1,
    height: 30,
    padding: 10,
    borderRadius: 24,
    marginTop: 20,
    marginRight: 20,
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
