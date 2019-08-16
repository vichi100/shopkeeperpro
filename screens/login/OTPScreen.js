import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

//import OTPInputView from '@twotalltotems/react-native-otp-input'

import OTPInputView from "../../uiComponent/OTPInputView";

import CountdownCircle  from '../../uiComponent/CountDown';
//import CountdownCircle from "react-native-countdown-circle";
let n = 5;

export default class OTPScreen extends React.Component { 
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      showFilter: false,
      startCount: 5,
      shopmobile: null
    };
  }

  ShowHideTextComponentView = () => {
    //this.setState({startCount:10})
    if (this.state.showFilter == true) {
      this.setState({ showFilter: false });
    } else {
      this.setState({ showFilter: true });
    }
  };

  // go to registration screen if not registered else order screen 
  gotoNextScreen = (shopmobile) =>{
    console.log('you are good to go!'+ shopmobile)
    this.props.navigation.navigate("ShopRegistration", {
      shopmobile: shopmobile
    });
  }

  reSendOPT = ()=>{
    this.setState({startCount:10+n});
    n = n+5;
    console.log('reSendOPT');
    if (this.state.showFilter == true) {
      this.setState({ showFilter: false });
    } else {
      this.setState({ showFilter: true }); 
    }
  }

  render() {
    const { navigation } = this.props;
    const shopmobile = navigation.getParam("shopmobile");
    return (
      <View style={styles.container}>
      <Text style={{fontSize: 16, fontWeight:'500', fontFamily: "sans-serif", marginBottom:50 }}>YOUR MOBILE :  {shopmobile}</Text>
        
        <Text style={{fontSize: 14, fontWeight:'500', fontFamily: "sans-serif", marginBottom:10}}>ENTER OTP</Text>

        <OTPInputView
          style={{ width: "80%", height: 40, marginBottom:50 }}
          pinCount={6}
          // You only need this if you want to inject the code.
          // code={this.state.code}
          // key={`OTPInputView ${this.state.code}`}
          autoFocusOnLoad={true}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={code => this.gotoNextScreen(shopmobile)}
        />

        <CountdownCircle
          seconds={this.state.startCount}
          radius={30}
          borderWidth={3}
          color="#ff003f"
          bgColor="#fff"
          textStyle={{ fontSize: 20 }}
          onTimeElapsed={() => this.ShowHideTextComponentView()}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "#fafafa"
          }}
        >
          {this.state.showFilter ? (
            <View style={{ flexDirection: "row" }}>

            <TouchableOpacity onPress={() => this.reSendOPT()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>RESEND OTP</Text>
            </View>
          </TouchableOpacity>

              {/* <TouchableOpacity
                style={{ marginTop: 30 }}
                onPress={() => this.reSendOPT()}
              >
                <Text>RESEND OTP</Text>
              </TouchableOpacity> */}
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },

  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6"
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6"
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
});
