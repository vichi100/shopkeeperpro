import React, { useState } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  YellowBox
} from "react-native";
// import { AppLoading, Asset, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import ErrorBoundary from "./ErrorBoundary";
import AppIntroSlider from "react-native-app-intro-slider";

import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
// import React, { useState } from 'react';
// import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { SafeAreaView } from "react-navigation";
import { Dimensions } from "react-native";

import { Permissions, Notifications } from "expo";
import { AsyncStorage } from "react-native";
import OfflineNotice from "./screens/OfflineNotice";

import { StackActions, NavigationActions } from 'react-navigation';
// import { Constants, Location } from 'expo';
// import { Ionicons } from '@expo/vector-icons';
import {Provider} from "react-redux"
import store from "./store/index";


YellowBox.ignoreWarnings(["Warning", "Setting a timer"]);



const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

if (Platform.OS === "android") {
  // removes extra space at top of header on android
  SafeAreaView.setStatusBarHeight(0);
}

class App extends React.Component {
  state = {
    isLoadingComplete: false,
    showRealApp: false,
    token: null,
    notification: null
  };

  async componentDidMount() {
    //await AsyncStorage.clear();//COMMENT THIS BEFORE BUILD
    // start : this._getLocationAsync();
    // const [isLoadingComplete, setLoadingComplete] = useState(false); 
    ///end
    await this.init();
    setTimeout(() => {}, 200);
  }

  async init() {
    var expoToken = await AsyncStorage.getItem("expoToken");
    if (expoToken == null) {
      this.registerForPushNotifications();
    }
    var showRealApp = await AsyncStorage.getItem("showRealApp");
    console.log("showRealApp: " + JSON.stringify(showRealApp));
    if (showRealApp == null) {
      this.setState({ showRealApp: false });
    } else {
      this.setState({ showRealApp: true });
    }
  }

  _onDone = () => {
    // After user finished the intro slides. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
    this._storeDataShowRealAppp();
  };
  _onSkip = () => {
    // After user skip the intro slides. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
    this._storeDataShowRealAppp();
  };

  _storeDataShowRealAppp = async () => {
    try {
      await AsyncStorage.setItem("showRealApp", "false");
      console.log("store _storeDataShowRealAppp");
      setTimeout(() => {}, 200);
    } catch (error) {
      console.log("error in storeDataShowRealAppp" + error);
    }
  };

  async registerForPushNotifications() {
    console.log("registerForPushNotifications");
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== "granted") {
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync(); //'vichi34552466'//
    await AsyncStorage.setItem("expoToken", token);

    this.subscription = Notifications.addListener(this.handleNotification);
    
    this.setState({ token: token });
  }

  removeSpecialChars = (str) => {
    return str.replace(/(?!\w|\s)./g, '')
      .replace(/\s+/g, ' ')
      .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
  }

  handleNotification = notification => {
    //console.log("notification recived"+ JSON.stringify(notification));
    //console.log("notification recived clubid: "+ JSON.stringify(notification.data.clubid));
    var clubid = '1000002';//notification.data.clubid
    if(clubid != null){
      // this.navigator && this.navigator.dispatch({ type: 'Navigate', routeName, params });
      //this.navigator && this.navigator.dispatch({ type: 'Navigate', routeName:'EventsOfOneClub', params:{ clubid: clubid }});
      // this.props.navigation.navigate("EventsOfOneClub", { clubid: clubid });
      this.props.navigator && this.props.navigator.dispatch(NavigationActions.navigate({routeName: 'EventsOfOneClub'})) //{friend: chatInfo}
    
    
//       const resetAction = NavigationActions.reset({
//         index: 0,
//         actions: [ 
//             NavigationActions.navigate({ 
//                 routeName: 'EventsOfOneClub',      // name of the screen you want to navigate
//                 params: {
//                   clubid: clubid   // this second parameter is for sending the params
//                 } 
//             })
//         ],
// });
// this.props.navigation.dispatch(resetAction);
    
    
    
    
    
    }
    this.setState({
      notification:notification
    });
  };

  render() {
    
    if (this.state.showRealApp) {
      if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
        return (
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onError={this._handleLoadingError}
            onFinish={this._handleFinishLoading}
          />
        );
      } else {
        if (Platform.OS === "ios") {
          return (
            <Provider store={store} >
            <ErrorBoundary>
              <SafeAreaView
                style={{ flex: 1, backgroundColor: "#fff" ,  }}
                forceInset={{ top: "never" }}
              >
                <View style={styles.container}>
                  <OfflineNotice />
                  {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                  <AppNavigator />
                </View>
              </SafeAreaView>
            </ErrorBoundary>
            </Provider>
          );
        } else {
          return (
            <ErrorBoundary>
              <SafeAreaView
                style={{ flex: 1, backgroundColor: "#fff" }}
                forceInset={{ top: "never" }}
              >
                <View style={styles.container}>
                  <OfflineNotice />
                  {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                  <AppNavigator />
                </View>
              </SafeAreaView>
            </ErrorBoundary>
          );
        }
      }
    } else {
      return (
        <AppIntroSlider
          slides={slides}
          //comming from the JsonArray below
          onDone={this._onDone}
          //Handler for the done On last slide
          showSkipButton={true}
          onSkip={this._onSkip}
        />
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/images/robot-dev.png"),
        require("./assets/images/robot-prod.png")
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        // "sans-serif": require("./assets/fonts/sansserif.ttf"),
        // "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: 25,
    backgroundColor: "#ffffff"
  },
  image: {
    resizeMode: "contain",
    width: width,
    height: 300
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight:'500',
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "transparent",
    textAlign: "center",
    marginTop: 16,
    fontFamily: "sans-serif",
  }
});

const slides = [
  {
    key: "s1",
    text: "RETAIN CUSTOMERS",
    title: "SIMPLY",
    titleStyle: styles.title,
    textStyle: styles.text,
    image: require("./assets/images/retaincustomer1.png"),
    imageStyle: styles.image,
    backgroundColor: "#febe29"
  },
  {
    key: "s2",
    text: "RECEIVE ONLINE ORDERS",
    title: "SIMPLY",
    titleStyle: styles.title,
    textStyle: styles.text,
    image: require("./assets/images/onlineorder1.png"),
    imageStyle: styles.image,
    backgroundColor: "#22bcb5"
  },
  {
    key: "s3",
    title: "SIMPLY",
    titleStyle: styles.title,
    text: "ANALYSE SALES",
    textStyle: styles.text,
    image: require("./assets/images/chart.png"),
    imageStyle: styles.image,
    backgroundColor: "#3395ff"
  },
  // {
  //   key: "s4",
  //   title: "BEST CLUBS ",
  //   titleStyle: styles.title,
  //   text: "CRAZY WILD PARTIES ",
  //   textStyle: styles.text,
  //   image: require("./assets/images/location.png"),
  //   imageStyle: styles.image,
  //   backgroundColor: "#febe29"
  // }
  // {
  //   key: 's5',
  //   title: 'Bus Booking',
  //   titleStyle: styles.title,
  //   text: 'Enjoy Travelling on Bus with flat 100% off',
  //   image: {
  //     uri:
  //       'http://aboutreact.com/wp-content/uploads/2018/08/bus_ticket_booking.png',
  //   },
  //   imageStyle: styles.image,
  //   backgroundColor: '#f6437b',
  // },
  // {
  //   key: 's6',
  //   title: 'Train Booking',
  //   titleStyle: styles.title,
  //   text: ' 10% off on first Train booking',
  //   image: {
  //     uri:
  //       'http://aboutreact.com/wp-content/uploads/2018/08/train_ticket_booking.png',
  //   },
  //   imageStyle: styles.image,
  //   backgroundColor: '#febe29',
  // },
];



export default App;