import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import MyTextInput from "../../uiComponent/MyTextInput";
import { ScrollView } from "react-native-gesture-handler";
// import { Sae } from 'react-native-textinput-effects';

const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";

export default class Login extends Component {

  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Login",
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
  constructor(props) {
    super(props);
    this.state = {
      shopmobile: null
    };
  }

  goToOTPScreen = () => {

    if (this.state.shopmobile == null || this.state.shopmobile.trim() === "") {
      this.setState(() => ({ shopmobileError: "Mobile number required."}));
      return;
    } else if(this.state.shopmobile.length < 10){
      this.setState(() => ({ shopmobileError: "Mobile number is not valid."}));
      return;
    }else{
      this.setState(() => ({ shopmobileError: null}));
    }
    
    if(this.state.shopmobile !== null || this.state.shopmobile !== undefined){
      let mobileLength = this.state.shopmobile.length;
      if (mobileLength === 10) {
        console.log("hi");
        this.props.navigation.navigate("OTPScreen", {
          shopmobile: this.state.shopmobile
        });
      }
    }
   
  };

  saveMobile = shopmobile => {
    //console.log(shopmobile);
    this.setState({ shopmobile: shopmobile });
  };

  render() {
    return (
      
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
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
            {/* <MaterialIcons style={{marginLeft:10, marginTop:7}} name="search" size={20} /> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <TextInput
                placeholder="+91 "
                placeholderTextColor="#757575"
                keyboardType="number-pad"
                editable={false}
                multiline={false}
                style={{ fontSize: 18, color: "#000" }}
              />
              <MyTextInput
                placeholder="Mobile Number"
                keyboardType="number-pad"
                onChangeText={text => this.saveMobile(text)}
                maxLength={10}
                multiline={false}
              />
            </View>
            <TouchableOpacity onPress={() => this.goToOTPScreen()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>NEXT</Text>
              </View>
            </TouchableOpacity>
          
        </View>
      </View>
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
    marginTop: 20,
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
