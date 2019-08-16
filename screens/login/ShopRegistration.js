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
import axios from 'axios';
import { ScrollView } from "react-native-gesture-handler";
import { AsyncStorage } from "react-native";

export default class ShopRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
       shopmobile: null,
       shopname: null,
       shopaddress: null,
       alternatemobile: null,
       landmark: null,
       city: null,
       shopnameError: null,
       shopaddressError: null,
       cityError: null
    }
  }
 
  registerShop = (shopmobile) => {
    const shopaddress = this.state.shopaddress+' , '+this.state.landmark;
    //console.log('shopaddress '+shopaddress) 
    const shopname = this.state.shopname;
    const city = this.state.city;
    const alternatemobile = this.state.alternatemobile

    if (shopname == null || shopname.trim() === "") {
      this.setState(() => ({ shopnameError: "Shop name required."}));
      return;
    } else {
      this.setState(() => ({ shopnameError: null}));
    }

    if (this.state.shopaddress == null || this.state.shopaddress.trim() === "") {
      this.setState(() => ({ shopaddressError: "Shop address required."}));
      return;
    } else {
      this.setState(() => ({ shopaddressError: null}));
    }

    if (city == null || city.trim() === "") {
      this.setState(() => ({ cityError: "City required."}));
      return; 
    } else {
      this.setState(() => ({ cityError: null}));
    }

    const requestBody = { 
      query: `
            mutation{
               createShop(shopInput: {city: "${city}", shopname:"${shopname}", shopaddress:"${shopaddress}", shopmobile:"${shopmobile}", alternatemobile:"${alternatemobile}"}){
                shopid
               }
            }
            `
    };
    console.log('registerShop')
    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL+"/graphql",
      method: "POST",
      data: requestBody
    }).then(result => {
      console.log("Resp Data: "+JSON.stringify(result.data));
      // store shop details in local
      this._storeShopDetails(shopname, shopaddress, shopmobile, alternatemobile, city)
      this.props.navigation.navigate("MainTabNavigator", {
        shopmobile: "shopmobile"
      });
    }); 

    ///http://localhost:3000/graphql
    // return fetch('http://192.168.43.64:3000/graphql', {
    //   method: 'POST',
    //   body: JSON.stringify(requestBody),
    //   headers:{
    //     'Content-Type': 'application/json'
    //   }
    // }).then(res => {
    //   console.log(JSON.stringify(res))
    // }).catch(err =>{
    //   console.log(err)
    // })
  };

  _storeShopDetails = async (shopname, shopaddress, shopmobile, alternatemobile, city) =>{
    await AsyncStorage.setItem("shopname", shopname);
    await AsyncStorage.setItem("shopaddress", shopaddress);
    await AsyncStorage.setItem("shopmobile", shopmobile);
    await AsyncStorage.setItem("alternatemobile", alternatemobile);
    await AsyncStorage.setItem("shopcity", city);
  }


  render() {
    const { navigation } = this.props;
    const shopmobile = navigation.getParam("shopmobile");
    
    return (
      <KeyboardAvoidingView style = {{flex: 1,}}behavior="padding" enabled keyboardVerticalOffset={100}>
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
            //value={phone}
            onChangeText={ (shopname) => this.setState({ shopname: shopname }) }
            returnKeyType='next'
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            error={this.state.shopnameError}
          />
          <TextField
            label="Alternate Mobile"
            fontSize={14}
            //value={phone}
            onChangeText={ (alternatemobile) => this.setState({ alternatemobile: alternatemobile }) }
            returnKeyType='next'
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            error={this.state.shopnameError}
            keyboardType="number-pad"
          />
          <TextField
            label="Shop Address"
            multiline={true}
            fontSize={14}
            //value={phone}
            onChangeText={ (shopaddress) => this.setState({ shopaddress: shopaddress }) }
            returnKeyType='next'
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            error={this.state.shopaddressError}
          />

          <TextField
            label="Landmark"
            fontSize={14}
            //value={phone}
            onChangeText={ (landmark) => this.setState({ landmark: landmark }) }
            returnKeyType='next'
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
          />

          <TextField
            label="City"
            fontSize={14}
            //value={phone}
            onChangeText={ (city) => this.setState({ city: city }) }
            returnKeyType='next'
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            error={this.state.cityError}
          />

          <TouchableOpacity onPress={() => this.registerShop(shopmobile)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>NEXT</Text>
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
