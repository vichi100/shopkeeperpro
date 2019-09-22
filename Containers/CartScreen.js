//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import Products from "../components/Products";
import { connect } from "react-redux";
import { SERVER_URL } from "../Constants";
import { AsyncStorage } from "react-native";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Dialog from "react-native-dialog";


import withPreventDoubleClick from '../withPreventDoubleClick';

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

const window = Dimensions.get("window"); 
var cartData;

let w = window.Width;
// create a component
class CartScreen extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Orders Basket",
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
      cartData: null,
      totalCost: 0,
      totalItems: 0,
      dialogVisible : false,
    };
  }

  componentDidMount() {
    this.calculateTotalCost();
  }

  sendOrder = async (
    customerid,
    customerMobile,
    customerName,
    deliveryaddress,
    cartData,
    totalcost
  ) => {
    console.log("cartItems: " + JSON.stringify(this.props.cartItems)); 
    var shopmobile = await AsyncStorage.getItem("shopmobile");
    var shopname = await AsyncStorage.getItem("shopname");
    var shopaddress = await AsyncStorage.getItem("shopaddress");
    var shopid = await AsyncStorage.getItem("shopid");;
    var deliverystatus = "new";
    var paymentstatus = "pending";
    var paymentmode = "NA";
    var customerid = customerid;
    console.log("customerMobile: " + customerMobile);
    console.log("customerid: " + customerid);
    

    const requestBody = {
      shopid: shopid,
      shopname: shopname,
      customerid: customerid,
      customername: customerName,
      customermobile: customerMobile,
      deliveryaddress: deliveryaddress,
      products: this.props.cartItems,
      totalcost: totalcost,
      deliverystatus: deliverystatus,
      paymentstatus: paymentstatus,
      paymentmode: paymentmode,
      iscancel:'no'
    };

    console.log("sendOrder");
    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/insertOrder",
      method: "POST",
      data: requestBody
    }).then(result => {
      console.log("Resp Data: " + JSON.stringify(result.data));

      this.setState({ dialogVisible: true });
      

      // showMessage({
      //   message: "My message title",
      //   description: "My message description",
      //   type: "success",
      //   hideOnPress:true,
      //   position: "center",
      //   duration: 30000,
      //   onPress: () => {
      //     /* THIS FUNC/CB WILL BE CALLED AFTER MESSAGE PRESS */
      //     this.props.navigation.navigate("MainTabNavigator", {
      //       shopmobile: "shopmobile"
      //     });
      //   },
        
      // });

      // this.props.navigation.navigate("MainTabNavigator", {
      //   shopmobile: "shopmobile"
      // });
      
      
    }).catch(function (error) {
      console.log("error : "+JSON.stringify(error));
      
  })
  };

  handleOk = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    this.setState({ dialogVisible: false });
    this.props.navigation.navigate("MainTabNavigator", {
        shopmobile: "shopmobile"
    });
    this.props.emptyCart()
  };

  _dataFetched = () => ({
    type: "CLEAR_COMPLETED",
      payload:[]
  })

  // clearCompleted = () => {
  //   return{
  //     type: CLEAR_COMPLETED
  //   }
  // }
  
  

  calculateTotalCost = () => {
    // console.log("calculateTotalCost");
    console.log("calculateTotalCost called");
    var totalcost = 0;
    var itemCount = 0;
    // console.log("cartData before filter: "+JSON.stringify(this.props.cartItems))

    console.log("cartData: " + JSON.stringify(cartData));
    Object.keys(cartData).map((keyName, keyIndex) => {
      // use keyName to get current key's name

      var qty = cartData[keyName].qty;
      console.log(" qty: " + qty);
      if (qty == undefined) {
        // console.log(' I m in qty qty qty: '+qty)
        qty = 1;
      }
      itemCount = parseFloat(itemCount) + parseFloat(qty);

      var price = cartData[keyName].price;
      // total cost of single item
      console.log("parseFloat(price): " + parseFloat(price));
      var singleItemCost = parseFloat(price) * parseFloat(qty);
      console.log("singleItemCost: " + singleItemCost);
      // totalcost = parseFloat(totalcost) + parseFloat(price)
      totalcost = totalcost + singleItemCost;
      console.log("totalcost: " + totalcost);

      // console.log("data : " + response[keyName].type);
      // and a[keyName] to get its value
    });
    this.setState({
      totalCost: totalcost,
      totalItems: itemCount
    });
  };

  render() {
    console.log("CartScreen: "+ JSON.stringify(this.props.cartItems));
    this.props.cartItems=[];
    //console.log("CartScreen empty: "+ JSON.stringify(this.props.cartItems)); 
    cartData = this.props.cartItems;
    const { navigation } = this.props;
    var customerMobile = navigation.getParam("customerMobile");
    console.log("customerMobile: " + customerMobile);
    var customerName = navigation.getParam("customerName");
    var customerName = navigation.getParam("customerName");
    var deliveryaddress = navigation.getParam("deliveryaddress");
    var customerid = navigation.getParam("customerid");
    console.log("customerid: " + customerid);
    // CALCULATE TOTAL COST LOGIC START
    var totalcost = 0;
    var itemCount = 0;
    Object.keys(cartData).map((keyName, keyIndex) => {
      // use keyName to get current key's name

      var qty = cartData[keyName].qty;
      console.log(" qty: " + qty);
      if (qty == undefined) {
        // console.log(' I m in qty qty qty: '+qty)
        qty = 1;
      }
      itemCount = parseFloat(itemCount) + parseFloat(qty);

      var price = cartData[keyName].price;
      // total cost of single item
      console.log("parseFloat(price): " + parseFloat(price));
      var singleItemCost = parseFloat(price) * parseFloat(qty);
      console.log("singleItemCost: " + singleItemCost);
      // totalcost = parseFloat(totalcost) + parseFloat(price)
      totalcost = totalcost + singleItemCost;
      console.log("totalcost: " + totalcost);

      // console.log("data : " + response[keyName].type);
      // and a[keyName] to get its value
    });

    //CALCULATE TOTAL COST LOGIC: END
    if(cartData.length === 0 ){
      return (
        <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
        <MaterialCommunityIcons
              style={styles.iconPersone}
              name="cart-outline"
              size={30}
            />
          <Text style={{marginTop: 10}}>NO ITEM IN YOUR CART</Text>
          
          
        </View>
        ) 
    }


    return (
      <View style={styles.container}>
        {cartData.length > 0 ? (
          <Products
            onPress={this.props.removeItem}
            products={cartData}
            parentMethod={this.calculateTotalCost}
          />
        ) : (
          <Text>NO ITEM IN YOUR CART</Text>
        )}
        
        <View
          style={{
            backgroundColor: "rgba(63, 191, 127, 0.7)",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 1
          }}
        >   
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#fff",  fontFamily: "sans-serif", }}>
              ITEMS: {itemCount}
            </Text>
            <Text style={{ marginLeft: 15, marginRight: 15, color: "#fff", fontFamily: "sans-serif", }}>
              |
            </Text>
            <Text style={{ color: "#fff", fontFamily: "sans-serif", }}>
              TOTAL AMOUNT: {totalcost} Rs.
            </Text>
          </View>
        </View>
        <TouchableOpacityEx
          onPress={() =>
            this.sendOrder(
              customerid,
              customerMobile,
              customerName,
              deliveryaddress,
              cartData,
              totalcost
            )
          }
          style={{
            height: 50,
            width: w,
            backgroundColor: "#263238"
            //borderRadius:10,

            // marginLeft :50,
            // marginRight:50,
            // marginTop :20
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2196f3"
            }}
          >
            <Text style={{ color: "#ffffff" , fontSize:14}}>SHARE ORDER WITH CUSTOMER</Text>
          </View>
        </TouchableOpacityEx>

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

  // componentWillReceiveProps(nextProps) {
  //   //Did not get triggered
  //   console.log(nextProps);
  // }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log("prevProps: " + prevProps);
  //   // if (prevProps.specificProperty !== this.props.specificProperty) {
  //   //     // Do whatever you want
  //   // }
  // }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   console.log("getSnapshotBeforeUpdate");
  // }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
    // justifyContent: "center",
    // alignItems: "center"
    //backgroundColor: '#2c3e50',
  }
});

const mapStateToProps = state => {
  console.log("state in cartscreen: " + JSON.stringify(state));
  return {
    cartItems: state
  };
};
const mapDispatchToProps = dispatch => {
  return {
    removeItem: product =>
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: product
      }),
      emptyCart: () => dispatch({
      type: "EMPTY_CART",
      payload:[]
    })
  };
};
//make this component available to the app
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartScreen);
