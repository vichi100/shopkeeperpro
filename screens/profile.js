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
  Button,
} from "react-native";

//import TopBar from './topBar';
//import TabProfile from './tabProfile';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
//import OfficeLocationDisplay from "../screens/gmap/OfficeLocationDisplay";
//import { OpenMapDirections } from "../screens/gmap/GMapDirectionDrive";
import Dialog from "react-native-dialog";
import { AsyncStorage } from "react-native";
// import SnackBar from 'react-native-snackbar-component'

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
      mobile: null,
      name: null,
      photoUrl: null,
      dialogVisible: false,
      newMobile: null,
      userid: null
    };
  }

  componentDidMount() {
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
      console.log("in profile _retrieveData");
      try {
        var email = await AsyncStorage.getItem("email");
        var mobilex = await AsyncStorage.getItem("mobile");
        console.log("get mobile" + mobilex);
        var name = await AsyncStorage.getItem("name");
        var photoUrl = await AsyncStorage.getItem("photoUrl");
        var useid = await AsyncStorage.getItem("customerId");
        console.log("get name" + name);
        if (mobilex !== null && email != null && useid != null) {
          // We have data!!
          signin = true;
          console.log(mobilex);
          this.setState({
            mobile: mobilex,
            name: name,
            photoUrl: photoUrl
          });
        }
      } catch (error) {
        // Error retrieving data
        console.log("Error retrieving data " + error);
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

  login = () => {
    console.log("in login function");
    this.props.navigation.navigate("LoginScreen", {
      bookingData: null,
      me: "profile"
    });
  };

  render() {
    setTimeout(() => {}, 200);

    console.log("in profile");

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
                <Image
                  style={styles.userImage}
                  source={{
                    // uri: "http://199.180.133.121:3030"+'/images/club/tipplingstreetjuhu/tipplingstreetjuhu.jpg',
                    uri: this.state.photoUrl
                  }}
                />
                <MaterialCommunityIcons
                  onPress={() => this.editMobile()}
                  style={styles.heartwhite}
                  name="account-edit"
                  size={30}
                />

                <Text style={styles.userNameText}>{this.state.name}</Text>
                <Text style={styles.userMobileText}>
                  +91 {this.state.mobile}
                </Text>
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
  },
});
