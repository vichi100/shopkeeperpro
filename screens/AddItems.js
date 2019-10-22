import React, { Component } from "react";
//import react in our project
import {
  LayoutAnimation,
  Slider,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  FlatList,
  TextInput,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import { AsyncStorage } from "react-native";
import axios from "axios";
import { SERVER_URL } from "../Constants";
import { NavigationActions } from 'react-navigation';
import Dialog from "react-native-dialog";

import withPreventDoubleClick from '../withPreventDoubleClick';


const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);


var totalcost = 0;
// var itemsCount = 0;

export default class AddItems extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Create Order",
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

  constructor() {
    super();
    this.state = {
      textInput: [],
      inputData: [],
      modalerror: null,
      totalcost: 0,
      itemsCount: 0,
      dialogVisible : false,
    };
  }

  //function to add TextInput dynamically
  addTextInput = index => {
    var orderJObj = {};
    console.log("addTextInput");
    let textInput = this.state.textInput;
    let inputData = this.state.inputData;
    inputData.push(orderJObj);
    textInput.push(
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
          width: "95%"
        }}
      >
        <TextInput
          placeholder="Item Name"
          //   placeholderTextColor={"rgba(58, 61, 64, 0.7)"}
          autoCorrect={false}
          style={{
            height: 40,
            width: "55%",
            borderColor: "rgba(58, 61, 64, 0.4)",
            borderWidth: 1,
            margin: 1,
            paddingLeft: 5
          }}
          onChangeText={text => this.addItemName(text, index)}
        />
        <TextInput
          placeholder="Qty"
          keyboardType="numeric"
          //   placeholderTextColor={"rgba(58, 61, 64, 0.7)"}
          style={{
            height: 40,
            width: "10%",
            borderColor: "rgba(58, 61, 64, 0.4)",
            borderWidth: 1,
            margin: 1,
            paddingLeft: 5
          }}
          onChangeText={text => this.addItemQuantity(text, index)}
        />
        <TextInput
          placeholder="Wgt"
          //   placeholderTextColor={"rgba(58, 61, 64, 0.7)"}
          style={{
            height: 40,
            width: "15%",
            borderColor: "rgba(58, 61, 64, 0.4)",
            borderWidth: 1,
            margin: 1,
            paddingLeft: 5
          }}
          onChangeText={text => this.addItemWeight(text, index)}
        />
        <TextInput
          placeholder="Price"
          keyboardType="numeric"
          //   placeholderTextColor={"rgba(58, 61, 64, 0.7)"}
          style={{
            height: 40,
            width: "18%",
            borderColor: "rgba(58, 61, 64, 0.4)",
            borderWidth: 1,
            margin: 1,
            paddingLeft: 5
          }}
          onChangeText={text => this.addItemPrice(text, index)}
        />
      </View>
    );
    // itemsCount = itemsCount +1;
    this.setState({ textInput:textInput, inputData:inputData, itemsCount: textInput.length });

  };

  //function to remove TextInput dynamically
  removeTextInput = () => {
    let textInput = this.state.textInput;
    let inputData = this.state.inputData;

    // settel total cost on remove item
    var price = inputData[inputData.length - 1].price;
    if(price === null || price === undefined){
        price = 0;
    }
    console.log(
      "removeTextInput inputData[inputData.length - 1]: " +
        inputData[inputData.length - 1]
    );
    console.log("removeTextInput price: " + price);
    totalcost = totalcost - Number(price);
    this.setState({ totalcost: totalcost });

    textInput.pop();
    inputData.pop();
    
    this.setState({ textInput:textInput, inputData:inputData,  itemsCount: textInput.length});
  };

  //function to add text from TextInputs into single array
  addItemName = (text, indext) => {
    console.log("addItemQuantity: " + text);
    console.log("addItemQuantity: index  " + indext);
    var orderJObj = this.state.inputData[indext];
    console.log(
      "addItemQuantity: inputData  " + JSON.stringify(this.state.inputData)
    );
    var orderJObj = this.state.inputData[indext];
    orderJObj["productname"] = text;
  };
  addItemQuantity = (text, index) => {
    console.log("addItemQuantity: " + text);
    console.log("addItemQuantity: index  " + index);
    var orderJObj = this.state.inputData[index];
    console.log(
      "addItemQuantity: inputData  " + JSON.stringify(this.state.inputData)
    );
    console.log("addItemQuantity: orderJObj  " + orderJObj);
    if (text === null || text === undefined) {
      text = 1;
    }
    orderJObj["qty"] = text;
  };

  addItemWeight = (text, index) => {
    var orderJObj = this.state.inputData[index];
    orderJObj["weight"] = text;
  };

  addItemPrice = (text, index) => {
    var orderJObj = this.state.inputData[index];
    if (orderJObj.price === null || orderJObj.price === undefined) {
      totalcost = totalcost + Number(text);
    } else {
      totalcost = totalcost - Number(orderJObj.price);
      totalcost = totalcost + Number(text);
    }
    orderJObj["price"] = text;
    this.setState({ totalcost: totalcost });
  };

  uploadTextOrder = async (
    customerid,
    customerMobile,
    customerName,
    customeraddress
  ) => {

    for (let inputOrderData of this.state.inputData) {
        if (
          "productname" in inputOrderData === false ||
          "price" in inputOrderData === false
        ) {
          this.setState({ modalerror: "ITEM NAME OR PRICE IS MISSING" });
          return;
        }
      }
    var shopmobile = await AsyncStorage.getItem("shopmobile");
    var shopname = await AsyncStorage.getItem("shopname");
    var shopaddress = await AsyncStorage.getItem("shopaddress");
    var shopid = await AsyncStorage.getItem("shopid");
    var deliverystatus = "new";
    var paymentstatus = "pending";
    var paymentmode = "NA";
    var customerid = customerid;

    console.log("customerMobile: " + customerMobile);
    console.log("customerid: " + customerid);
    for(let product of this.state.inputData ){
        if(product.qty === null || product.qty === undefined){
            product['qty'] = 1;
        }

    }
    console.log("this.state.inputData: " + this.state.inputData);
    const requestBody = {
      shopid: shopid,
      shopname: shopname,
      shopmobile: shopmobile,
      shopaddress: shopaddress,
      customerid: customerid,
      customername: customerName,
      customermobile: customerMobile,
      customeraddress: customeraddress,
      products: this.state.inputData,
      totalcost: totalcost,
      deliverystatus: deliverystatus,
      paymentstatus: paymentstatus,
      paymentmode: paymentmode,
      iscancel: "no"
    };

    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/insertOrder",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: requestBody
    })
      .then(result => {
        // this.onRefresh();
        this.setState({
          modalVisible: false,
          textInput: [],
          inputData: [],
          modalOrderid: null,
          modalerror: null,
          modalProducts: null
        });
        // this.props.navigation.navigate("MainTabNavigator");
        //https://stackoverflow.com/questions/55400577/react-native-bottomtabs-navigating-to-a-specific-tab
        this.setState({ dialogVisible: true });
        // this.props.navigation.navigate({ 
        //     routeName: 'MainTabNavigator',
        //     action: NavigationActions.navigate({
        //       routeName: 'HomeStack'
        //    })
        //   })
          
      })
      .catch(error => {
        console.error(error);
        this.setState({
          modalVisible: false,
          textInput: [],
          inputData: [],
          modalOrderid: null,
          modalerror: null,
          modalProducts: null
        });
        this.props.navigation.navigate({ 
            routeName: 'MainTabNavigator',
            action: NavigationActions.navigate({
              routeName: 'HomeStack'
           })
          })
      });
  };

  handleOk = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    this.setState({ dialogVisible: false });
    this.props.navigation.navigate({ 
        routeName: 'MainTabNavigator',
        action: NavigationActions.navigate({
          routeName: 'HomeStack'
       })
      })
    
  };

  cancel = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { navigation } = this.props;
    var customerMobile = navigation.getParam("customerMobile");
    console.log("customerMobile: " + customerMobile);
    var customerName = navigation.getParam("customerName");
    // var customerName = navigation.getParam("customerName");
    var customeraddress = navigation.getParam("deliveryaddress");
    var customerid = navigation.getParam("customerid");

    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            // margin: 10,
            // marginTop: 22,
            height: "85%",
            // width: "90%",
            // backgroundColor: "rgba(210, 237, 253, 0.9)",
            // flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View>
            <KeyboardAwareScrollView
              ref="ScrollView"
              keyboardShouldPersistTaps={"always"}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <ScrollView>
                  <View style={{ marginTop: 5, marginBottom: 20 }}>
                    {this.state.textInput.map(value => {
                      return value;
                    })}
                    <View style={styles.row}>
                      {this.state.textInput.length === 0
                        ? this.addTextInput(this.state.textInput.length)
                        : null}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </KeyboardAwareScrollView>
            <Text
              style={{
                justifyContent: "center",
                textAlign: "center",
                margin: 10,
                color: "rgba(40, 36, 36, 0.66)",
                fontFamily: "sans-serif",
                fontWeight: "500"
              }}
            >
              ITEMS: {this.state.itemsCount} | TOTAL COST: {this.state.totalcost}
            </Text>
            <Text
              style={{
                justifyContent: "center",
                textAlign: "center",
                margin: 10,
                color: "red",
                fontFamily: "sans-serif",
                fontWeight: "500"
              }}
            >
              {this.state.modalerror}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <View style={{ margin: 10 }}>
                <TouchableOpacityEx onPress={() => this.removeTextInput()}>
                  <AntDesign
                    style={{
                      marginRight: 10,
                      marginTop: 7,
                      color: "rgba(99, 180, 28, 0.96)"
                    }}
                    name="minuscircleo"
                    size={30}
                  />
                </TouchableOpacityEx>
              </View>
              <Text style={{ margin: 10, marginTop: 5 }}>ADD/REMOVE ITEMS</Text>
              <View style={{ margin: 10 }}>
                <TouchableOpacityEx
                  onPress={() => this.addTextInput(this.state.textInput.length)}
                >
                  <AntDesign
                    style={{
                      marginRight: 10,
                      marginTop: 7,
                      color: "rgba(99, 180, 28, 0.96)"
                    }}
                    name="pluscircleo"
                    size={30}
                  />
                </TouchableOpacityEx>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10
              }}
            >
              <TouchableOpacityEx
                onPress={() => this.cancel()}
                style={{
                  height: 40,
                  width: "40%"
                }}
              >
                <View
                  style={{
                    margin: 10,
                    marginBottom: 5,

                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(228, 43, 5, 0.66)"
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      padding: 10,
                      color: "#ffffff",
                      fontWeight: "500",
                      fontFamily: "sans-serif"
                    }}
                  >
                    CANCEL
                  </Text>
                </View>
              </TouchableOpacityEx>
              <TouchableOpacityEx
                style={{
                  height: 40,
                  width: "40%"
                }}
                onPress={() =>
                  this.uploadTextOrder(
                    customerid,
                    customerMobile,
                    customerName,
                    customeraddress
                  )
                }
              >
                <View
                  style={{
                    margin: 10,
                    // width: "40%",
                    marginBottom: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(5, 139, 228, 0.96)"
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      padding: 10,
                      color: "#ffffff",
                      fontWeight: "500",
                      fontFamily: "sans-serif"
                    }}
                  >
                    DONE
                  </Text>
                </View>
              </TouchableOpacityEx>
            </View>
          </View>
        </View>

        <Dialog.Container
                  visible={this.state.dialogVisible}
                  buttonSeparatorStyle={{ justifyContent: "space-between" }}
                >
                  <Dialog.Title
                    style={{
                      color: "#4caf50",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                  >
                    SUCCESS
                  </Dialog.Title>
                  <Dialog.Description>
                    
                    <Text
                      style={{
                        paddingLeft: 50,
                        justifyContent: "center",
                        textAlign: "center",
                        alignItems: "center"
                      }}
                    >
                      Your order has been booked successfully
                    </Text>
                    
                  </Dialog.Description>
                  <Dialog.Button
                    label="OK"
                    style={{ fontFamily: "sans-serif", marginLeft: 50 }}
                    onPress={() => this.handleOk()}
                  />
                  
                </Dialog.Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // paddingTop: 0
    //backgroundColor: "#F5FCFF"
  }
});
