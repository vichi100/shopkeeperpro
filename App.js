import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View , Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {Provider} from "react-redux"
import store from "./store/index";

import {  Notifications } from "expo";
import * as Permissions from 'expo-permissions'
import { AsyncStorage } from "react-native";
import OfflineNotice from "./screens/OfflineNotice";
import AppIntroSlider from "react-native-app-intro-slider";

import AppNavigator from './navigation/AppNavigator';

const width = Dimensions.get("window").width;
console.disableYellowBox = true;
 
export default  function App ( props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  // var showRealApp = await AsyncStorage.getItem("showRealApp");
  init();
  // if(true){
  //   return (
  //     <AppIntroSlider
  //       slides={slides}
  //       //comming from the JsonArray below
  //       onDone={this._onDone}
  //       //Handler for the done On last slide
  //       showSkipButton={true}
  //       onSkip={this._onSkip}
  //     />
  //   );
  // }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <Provider store={store} >
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator/>
      </View>
      </Provider>
    );
  }
}

async function init() {
  var expoToken = await AsyncStorage.getItem("expotoken");
  console.log('expoToken: '+expoToken)
  if (expoToken == null) {
    registerForPushNotifications();
  }
  var showRealApp = await AsyncStorage.getItem("showRealApp");
  console.log("showRealApp: " + JSON.stringify(showRealApp));
  
}

_onDone = async () => {
  // After user finished the intro slides. Show real app through
  // navigation or simply by controlling state
  await AsyncStorage.setItem("showRealApp", "false");
};
_onSkip = async () => {
  // After user skip the intro slides. Show real app through
  // navigation or simply by controlling state
  await AsyncStorage.setItem("showRealApp", "false");
};

async function registerForPushNotifications() {
  console.log("registerForPushNotifications");
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

  if (status !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== "granted") {
      return;
    }
  }

  const token = await Notifications.getExpoPushTokenAsync(); //'vichi34552466'//
  await AsyncStorage.setItem("expotoken", token);
  console.log('expoToken: '+token)

  this.subscription = Notifications.addListener(this.handleNotification);
  
  // this.setState({ token: token });
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
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
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
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
  
];