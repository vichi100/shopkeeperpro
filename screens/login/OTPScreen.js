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
import axios from "axios";
//import CountdownCircle from "react-native-countdown-circle";
let n = 10;

var shopmobile;

export default class OTPScreen extends React.Component { 

  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Enter OTP ",
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
      showFilter: false,
      startCount: 30,
      shopmobile: null,
      otpNumber: null,
      otpNotMatchError: false,
    };
  }

  async componentDidMount() {
    this._genrateOTP(shopmobile)
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
  gotoNextScreen = (code, shopmobile) =>{
    console.log('you are good to go! code: '+ code)
    console.log('you are good to go! shopmobile: '+ shopmobile)
    console.log('this.state.otpNumber: '+this.state.otpNumber)
    // check here if otp match
    //genrate otp and send it to mobile
    if(this.state.otpNumber.toString().trim() === code.toString().trim()){
      this.props.navigation.navigate("ShopRegistration", {
        shopmobile: shopmobile
      });
    }else{
      this.setState({otpNotMatchError: true})
    }

    
  }

  _genrateOTP = (shopmobile) =>{
    console.log('_genrateOTP: '+shopmobile)
    var otpNumber = Math.floor(100000 + Math.random() * 900000);

    var OTPsms = otpNumber+' is your ShopKeeper verification code'
    return axios.get('https://platform.clickatell.com/messages/http/send?apiKey=x94dg_KoQuGJOts7A4Y8-w==&to='+shopmobile
    +'&content='+OTPsms)
      //.then(response => response.json())   
      .then(response => {
        // response = response.data;
       console.log("Table data from response  : " + JSON.stringify(response));  
        this.setState({ otpNumber: otpNumber});
      })
      .catch(error => { 
        console.error(error); 
      }); 
  }

  reSendOPT = (mobile) => {
    this.setState({startCount:this.state.startCount+n, otpNotMatchError: false, code:''});
    n = n+5;
    this._genrateOTP(mobile);
    console.log('reSendOPT');
    if (this.state.showFilter == true) {
      this.setState({ showFilter: false });
    } else {
      this.setState({ showFilter: true }); 
    }
  }

  render() {
    const { navigation } = this.props;
    shopmobile = navigation.getParam("shopmobile");
    return (
      <View style={styles.container}>
      <Text style={{fontSize: 16, fontWeight:'500', fontFamily: "sans-serif", marginBottom:50 }}>YOUR MOBILE :  {shopmobile}</Text>
        
        <Text style={{fontSize: 14, fontWeight:'500', fontFamily: "sans-serif", marginBottom:10}}>ENTER OTP</Text>

        <OTPInputView
          style={{ width: "80%", height: 40, marginBottom:15 }}  
          pinCount={6}
          // You only need this if you want to inject the code.
          code={this.state.code}
          key={`OTPInputView ${this.state.code}`}
          autoFocusOnLoad={true}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={code => this.gotoNextScreen(code, shopmobile)}
        />

        {this.state.otpNotMatchError === true? 
        <Text style={{color:'red', marginBottom: 10}}>YOU ENTERED WRONG OTP, TRY AGAIN</Text>: null}

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

            <TouchableOpacity onPress={() => this.reSendOPT(shopmobile)}>
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
