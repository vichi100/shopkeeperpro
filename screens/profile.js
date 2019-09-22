import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Navigator,
  Platform,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

//import TopBar from './topBar';
//import TabProfile from './tabProfile';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

//import OfficeLocationDisplay from "../screens/gmap/OfficeLocationDisplay";
//import { OpenMapDirections } from "../screens/gmap/GMapDirectionDrive";
import Dialog from "react-native-dialog";
import { AsyncStorage } from "react-native";
// import SnackBar from 'react-native-snackbar-component'
//
var signin = false;

export default class Profile extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "My Shop",
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

  static defaultProps = {
    backgroundColor: "#ffffff",
    marginTop: 1,
    //width: 150,
    //height: 150,
    shadowColor: "rgb(50,50,50)",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      mobile: null,
      name: null,
      photoUrl: null,
      dialogVisible: false,
      newMobile: null,
      userid: null,
      alternatemobile: null,
    };
  }

  componentDidMount() {
    this._retrieveData();
    this.props.navigation.addListener('didFocus', this.onScreenFocus)

  }

  onScreenFocus = () => {
    // Screen was focused, our on focus logic goes here
    // this.reloadHomePage()
    console.log("profile screen")
    this._retrieveData();
  }


  _callShowDirections = () => {
    //"latlong":19.074103, 72.869604

    const endPoint = {
      longitude: 72.869604,
      latitude: 19.074103
    };

    const transportPlan = "d";

    OpenMapDirections(null, endPoint, transportPlan).then(res => {
      console.log(res);
    });
  };

  //fetch data from AsyncStorage
  _retrieveData = async () => {
    if (!this.state.dialogVisible) {
      console.log("in profile retrieveData");
      try {
        var shopname = await AsyncStorage.getItem("shopname");
        var shopmobile = await AsyncStorage.getItem("shopmobile");
        var shopaddress = await AsyncStorage.getItem("shopaddress");
        var shopid = await AsyncStorage.getItem("shopid");
        var alternatemobile = await AsyncStorage.getItem("alternatemobile");
        
        console.log("get shopmobile: " + shopmobile);
        console.log("get shopname: " + shopname);
        console.log("get shopid: " + shopid);
        if (shopmobile !== null && shopid != null && shopname != null) {
          // We have data!!
          signin = true;
          this.setState({
            mobile: shopmobile,
            name: shopname,
            shopaddress: shopaddress,
            alternatemobile: alternatemobile,
            // isLoading: false,
          });
        }

        this.setState({isLoading: false})
      } catch (error) {
        // Error retrieving data
        console.log("Error retrieving data " + error);
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  setMobile = text => {
    console.log(text);
    var myMob = text;
    console.log("myMob : " + myMob);
    this.setState({ newMobile: myMob });
  };

  editMobile = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleOk = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    console.log("new mobile in OK : " + this.state.newMobile);
    this.setState({ dialogVisible: false });
    if (this.state.newMobile.length >= 10) {
      this._storeDataMobile(this.state.newMobile);
      this.setState({ mobile: this.state.newMobile });
    } else {
      console.log("snackbar button clicked!");
    }

    console.log("new mobile in OK : " + this.state.newMobile);
    setTimeout(() => {}, 200);
  };

  _storeDataMobile = async mobile => {
    try {
      await AsyncStorage.setItem("mobile", mobile);
      console.log("store mobile" + mobile);
      setTimeout(() => {}, 200);
    } catch (error) {
      console.log("eroor in store mobile" + mobile);
    }
  };

  login = async() => {
    console.log("in login function");
    var shopname = await AsyncStorage.getItem("shopname");
    var shopmobile = await AsyncStorage.getItem("shopmobile");
    var shopid = await AsyncStorage.getItem("shopid");
    if(shopid === null || shopmobile === null || shopname === null){
      this.props.navigation.navigate("LoginScreen");
    }else{
      this.props.navigation.navigate("UpdateLogin");
    }
    
  };

  openHelp = () => {
    console.log('help')
    this.props.navigation.navigate("HelpScreen");
  }

  render() {
    setTimeout(() => {}, 200);

    console.log("in profile");

    if (this.state.isLoading) {
      console.log('isLoading: '+this.state.isLoading) 
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20, justifyContent:'center', alignItems:'center' }}>
          <ActivityIndicator 
            color = '#ea80fc'
            size = "large"
 
          />
        </View>
      );
    }

    if (signin == true) {
      return (
        <View>
          {/* <TopBar title={meUsername}/> */}

          <ScrollView
            automaticallyAdjustContentInsets={false}
            style={styles.scrollView}
          >
            <View style={styles.headerContainer}>
              <View style={styles.headerColumn}>
                
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 50,
                      marginBottom: 50
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={require("../assets/images/icologo.png")}
                      resizeMode={"contain"}
                    />
                    <View>
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
                  </View>
              </View>
            </View>

            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <Entypo style={styles.icons} name="shop" size={20} />
                <Text style={{ fontSize: 14, color: "#4caf50" }}>
                  {this.state.name}
                </Text>
                <View style={{position: 'absolute', top: 0, right: 0}}>
                <TouchableOpacity onPress={() => this.login()}>
                <MaterialCommunityIcons style={styles.icons} name="account-edit" size={20} />
                </TouchableOpacity>
                </View> 
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    backgroundColor: this.props.backgroundColor,
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-between",

                    marginTop: 5,
                    marginBottom: 5,
                    marginLeft: 10,
                    marginRight: 10
                  }}
                >
                  <Text style={{ color: "#9e9e9e" }}>
                    Mobile: {this.state.mobile}
                  </Text>
                  <Text style={{ color: "#9e9e9e" }}>
                    Alternate Mobile: {this.state.alternatemobile}
                  </Text>
                  <Text style={{ color: "#9e9e9e" }}>
                    Address: {this.state.shopaddress}
                  </Text>
                </View>
              </View>
            </View>

            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <MaterialCommunityIcons
                  style={{
                    color: "#0091ea"
                  }}
                  name="help-rhombus-outline"
                  size={20}
                />
                <Text
                  style={{ fontSize: 14, color: "#4caf50", marginLeft: 10 }}
                >
                  Help
                </Text>
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    // backgroundColor: this.props.backgroundColor,
                    backgroundColor: '#e3f2fd',
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
              <TouchableOpacity onPress={() => this.openHelp()}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 5,
                    marginBottom: 5,
                    marginLeft: 10,
                    marginRight: 10,
                    
                  }}
                >
                  <Text style={{ color: "#9e9e9e" }}>
                    Tap here for help regarding create new order, cancel order or
                    any other help
                  </Text>
                </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <Foundation
                  style={styles.icons}
                  name="social-instagram"
                  size={20}
                />
                <Text style={{ fontSize: 14, color: "#4caf50" }}>
                  Follow us @ Instagram
                </Text>
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    backgroundColor: this.props.backgroundColor,
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
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
                  <Text style={{ color: "#9e9e9e" }}>@yoguestlist</Text>
                </View>
              </View>
            </View>

            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <MaterialIcons
                  style={styles.icons}
                  name="contact-phone"
                  size={20}
                />
                <Text style={{ fontSize: 14, color: "#4caf50" }}>
                  Call & Chat with us
                </Text>
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    backgroundColor: this.props.backgroundColor,
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
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
                  <Text style={{ color: "#9e9e9e" }}>+91 986714466</Text>
                </View>
              </View>
            </View>

            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <MaterialIcons
                  style={styles.icons}
                  name="location-on"
                  size={20}
                />
                <Text style={{ fontSize: 14, color: "#4caf50" }}>Find us</Text>
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    backgroundColor: this.props.backgroundColor,
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
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
                  <Text style={{ color: "#9e9e9e" }}>
                    GuestList {"\n"}
                    91springboard, Kagalwala House{"\n"}
                    Bandra Kurla Complex, Mumbai 400098
                  </Text>
                </View>
              </View>
            </View>

            {/* <TouchableOpacity onPress={() => this._callShowDirections()}>
              <OfficeLocationDisplay />
            </TouchableOpacity> */}
          </ScrollView>

          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Enter Mobile Number</Dialog.Title>
            {/* <Dialog.Description>
              Mobile number is required by bank and payment getway.
            </Dialog.Description> */}

            <Dialog.Input
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              onChangeText={text => this.setMobile(text)}
              keyboardType="phone-pad"
              maxLength={10}
              autoCorrect={false}
              //value={changeText}
              textAlign={"center"}
              autoFocus={true}
            />
            <Dialog.Button
              style={{ fontFamily: "sans-serif" }}
              label="Cancel"
              onPress={this.handleCancel}
            />
            <Dialog.Button
              style={{ fontFamily: "sans-serif" }}
              label="OK"
              onPress={() => this.handleOk()}
            />
          </Dialog.Container>
        </View>
      );
    } else {
      return (
        <View>
          {/* <TopBar title={meUsername}/> */}

          <ScrollView
            automaticallyAdjustContentInsets={false}
            style={styles.scrollView}
          >
            <View style={styles.headerContainer}>
              <View style={styles.headerColumn}>
                <TouchableOpacity onPress={() => this.login()}>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 50,
                      marginBottom: 50
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={require("../assets/images/icologo.png")}
                      resizeMode={"contain"}
                    />
                    <View>
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
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Log in</Text>
                      </View>
                      {/* <Button
                        //onPress={this.onPressLearnMore}
                        title="Log in"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                      /> */}

                      {/* <Text style={{paddingLeft:40, color: '#757575'}}>Log in</Text> */}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <MaterialCommunityIcons
                  style={styles.icons}
                  name="untappd"
                  size={20}
                />
                <Text style={{ fontSize: 14, color: "#4caf50" }}>
                  Our Philosophy
                </Text>
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    backgroundColor: this.props.backgroundColor,
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
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
                  <Text style={{ color: "#9e9e9e" }}>
                    EMPOWERING LOCAL STORES WITH POWER OF ONLINE ORDERING {"\n"}
                    {"\n"}You should be able to receive online order from the
                    customers. You will be able to track sales, manage credit
                    effectively.
                  </Text>
                </View>
              </View>
            </View>


            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <MaterialCommunityIcons
                  style={{
                    color: "#0091ea"
                  }}
                  name="help-rhombus-outline"
                  size={20}
                />
                <Text
                  style={{ fontSize: 14, color: "#4caf50", marginLeft: 10 }}
                >
                  Help
                </Text>
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    backgroundColor: this.props.backgroundColor,
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
              <TouchableOpacity onPress={() => this.openHelp()}>
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
                  <Text style={{ color: "#9e9e9e" }}>
                    Tap here to help regarding create new order, cancel order or
                    any other help
                  </Text>
                </View>
                </TouchableOpacity>
              </View>
            </View>

          

            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <Foundation
                  style={styles.icons}
                  name="social-instagram"
                  size={20}
                />
                <Text style={{ fontSize: 14, color: "#4caf50" }}>
                  Follow us @ Instagram
                </Text>
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    backgroundColor: this.props.backgroundColor,
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
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
                  <Text style={{ color: "#9e9e9e" }}>@yoguestlist</Text>
                </View>
              </View>
            </View>

            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <MaterialIcons
                  style={styles.icons}
                  name="contact-phone"
                  size={20}
                />
                <Text style={{ fontSize: 14, color: "#4caf50" }}>
                  Call & Chat with us
                </Text>
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    backgroundColor: this.props.backgroundColor,
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
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
                  <Text style={{ color: "#9e9e9e" }}>+91 986714466</Text>
                </View>
              </View>
            </View>

            <View
              //outer GuestList
              style={[
                styles.cardView,
                {
                  backgroundColor: this.props.backgroundColor,
                  marginTop: this.props.marginTop,
                  width: this.props.width,
                  height: this.props.height,
                  //margin: 5,
                  ...Platform.select({
                    ios: {
                      shadowColor: this.props.shadowColor,
                      shadowOpacity: this.props.shadowOpacity,
                      shadowRadius: this.props.shadowRadius,
                      shadowOffset: {
                        height: -1,
                        width: 0
                      }
                    },
                    android: {
                      elevation: this.props.elevation
                    }
                  })
                }
              ]}
            >
              <View style={{ flexDirection: "row", margin: 10 }}>
                <MaterialIcons
                  style={styles.icons}
                  name="location-on"
                  size={20}
                />
                <Text style={{ fontSize: 14, color: "#4caf50" }}>Find us</Text>
              </View>

              <View
                //Girls Section

                style={[
                  styles.cardView,
                  {
                    backgroundColor: this.props.backgroundColor,
                    marginTop: this.props.marginTop,
                    width: this.props.width,
                    height: this.props.height,
                    margin: 5,
                    ...Platform.select({
                      ios: {
                        shadowColor: this.props.shadowColor,
                        shadowOpacity: this.props.shadowOpacity,
                        shadowRadius: this.props.shadowRadius,
                        shadowOffset: {
                          height: -1,
                          width: 0
                        }
                      },
                      android: {
                        elevation: this.props.elevation
                      }
                    })
                  }
                ]}
              >
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
                  <Text style={{ color: "#9e9e9e" }}>
                    GuestList {"\n"}
                    91springboard, Kagalwala House{"\n"}
                    Bandra Kurla Complex, Mumbai 400098
                  </Text>
                </View>
              </View>
            </View>

            {/* <TouchableOpacity onPress={() => this._callShowDirections()}>
              <OfficeLocationDisplay />
            </TouchableOpacity> */}
          </ScrollView>

          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Enter Mobile Number</Dialog.Title>
            {/* <Dialog.Description>
              Mobile number is required by bank and payment getway.
            </Dialog.Description> */}

            <Dialog.Input
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              onChangeText={text => this.setMobile(text)}
              keyboardType="phone-pad"
              maxLength={10}
              autoCorrect={false}
              //value={changeText}
              textAlign={"center"}
              autoFocus={true}
            />
            <Dialog.Button
              style={{ fontFamily: "sans-serif" }}
              label="Cancel"
              onPress={this.handleCancel}
            />
            <Dialog.Button
              style={{ fontFamily: "sans-serif" }}
              label="OK"
              onPress={() => this.handleOk()}
            />
          </Dialog.Container>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff"
    //marginBottom:110
  },

  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  heartwhite: {
    margin: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    color: "#ffffff"
  },

  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 35
  },

  headerContainer: {},
  headerColumn: {
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        alignItems: "center",
        elevation: 1,
        marginTop: -1
      },
      android: {
        alignItems: "center"
      }
    })
  },

  userImage: {
    borderColor: "#01C89E",
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170
  },

  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    //color: "#616161",
    marginBottom: 15
  },
  mePic: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  meInfoWrap: {
    paddingTop: 5,

    flexDirection: "row"
  },
  meData: {
    flex: 2,
    paddingTop: 20,
    flexDirection: "row"
  },
  image: {
    width: 60,
    height: 60
  },
  meInfo: {
    alignItems: "center",
    padding: 15
  },
  meName: {
    fontWeight: "bold",
    fontSize: 12,
    paddingTop: 10
  },
  data: {
    flex: 1,

    alignItems: "center"
  },
  edit: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
    alignItems: "center",
    margin: 15,
    padding: 2
  },
  icons: {
    width: 30,
    height: 30,
    color: "#0091ea"
    //borderRadius: 30,
    //borderWidth: 2,
    //borderColor: 'rgb(170, 207, 202)'
  },
  instructions: {
    color: "#e0e0e0"
  },
  userNameText: {
    color: "#000000",
    fontSize: 20,
    //fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: "center"
  },

  userMobileText: {
    color: "#FFF",
    fontSize: 14,
    //fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: "center"
  },
  button: {
    width: 60,
    borderColor: "#eeeeee",
    borderWidth: 1,
    height: 10,
    padding: 10,
    borderRadius: 24,
    marginTop: 5,
    marginLeft: 20,
    backgroundColor: "#eeeeee",
    //flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#eeeeee",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 5,
    shadowOpacity: 0.8
  },
  buttonText: {
    color: "#9e9e9e",
    fontSize: 12
  }
});
