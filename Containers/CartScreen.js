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
      totalItems: 0
    };
  }

  componentDidMount() {
    this.calculateTotalCost();
  }

  sendOrder = async (
    customerMobile,
    customerName,
    deliveryaddress,
    cartData
  ) => {
    console.log("cartItems: " + JSON.stringify(this.props.cartItems));
    var shopmobile = await AsyncStorage.getItem("shopmobile");
    var shopname = await AsyncStorage.getItem("shopname");
    var shopaddress = await AsyncStorage.getItem("shopaddress");
    var shopid = "vichishop";
    var deliverystatus = "new";
    var paymentstatus = "pending";
    var paymentmode = "NA";
    var customerid = "0001";
    console.log("customerMobile: " + customerMobile);
    // const requestBody = {
    //   query: `
    //         mutation{
    //           createOrder(orderInput: {shopid: "${shopid}", shopname:"${shopname}", customerid:"${customerid}", customername:"${customername}", customermobile:"${customermobile}",
    //           deliveryaddress:"${deliveryaddress}", totalcost:"${this.state.totalCost}" , dilevirystatus:"${dilevirystatus}" , paymentstatus:"${paymentstatus}" , paymentmode:"${paymentmode}"}){
    //               shopid
    //            }
    //         }
    //         `
    // };

    const requestBody = {
      shopid: shopid,
      shopname: shopname,
      customerid: customerid,
      customername: customerName,
      customermobile: customerMobile,
      deliveryaddress: deliveryaddress,
      products: this.props.cartItems,
      totalcost: this.state.totalCost,
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
      // store shop details in local
      this._storeShopDetails(
        shopname,
        shopaddress,
        shopmobile,
        alternatemobile,
        city
      );
      this.props.navigation.navigate("MainTabNavigator", {
        shopmobile: "shopmobile"
      });
    });
  };

  calculateTotalCost = () => {
    console.log("bar");
    console.log("calculateTotalCost");
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
    // console.log("CartScreen: "+ JSON.stringify(this.props.cartItems));
    cartData = this.props.cartItems;
    const { navigation } = this.props;
    var customerMobile = navigation.getParam("customerMobile");
    console.log("customerMobile: " + customerMobile);
    var customerName = navigation.getParam("customerName");
    var deliveryaddress = navigation.getParam("deliveryaddress");

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
            backgroundColor: "rgba(255,69,0, 0.9)",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 1
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#fff" }}>
              Items: {this.state.totalItems}
            </Text>
            <Text style={{ marginLeft: 15, marginRight: 15, color: "#fff" }}>
              |
            </Text>
            <Text style={{ color: "#fff" }}>
              Total Amount: Rs.{this.state.totalCost}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            this.sendOrder(
              customerMobile,
              customerName,
              deliveryaddress,
              cartData
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
            <Text style={{ color: "#ffffff" }}>SEND ORDER</Text>
          </View>
        </TouchableOpacity>
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
      })
  };
};
//make this component available to the app
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartScreen);
