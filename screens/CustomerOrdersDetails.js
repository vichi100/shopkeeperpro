import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from "react-native";
// import Card from "./cards/Card";
import { MaterialIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { AsyncStorage } from "react-native";
import axios from "axios";
import { SERVER_URL } from "../Constants";

// import RadioGroup from "../radiobutton/RadioGroup";

import { CheckBox } from "react-native-elements";

// import * as Animatable from "react-native-animatable";
//import for the animation of Collapse and Expand
import Collapsible from "react-native-collapsible";
import Dialog from "react-native-dialog";

import SwipeItem from "../swipeable/SwipeItem";
import SwipeButtonsContainer from "../swipeable/SwipeButtonsContainer";

var radiogroup_options = [
  { id: 0, label: "All" },
  { id: 1, label: "New" },
  { id: 2, label: "Packed" },
  { id: 3, label: "Completed" }
];

const leftButton = (
  <SwipeButtonsContainer
    style={{
      alignSelf: "center",
      aspectRatio: 1,
      flexDirection: "column",
      padding: 5
      //backgroundColor:'red'
    }}
  >
    <TouchableOpacity onPress={() => console.log("left button clicked")}>
      <Text
        style={{
          fontWeight: "600",
          fontFamily: "sans-serif",
          color: "#d84315"
        }}
      >
        NA
      </Text>
    </TouchableOpacity>
  </SwipeButtonsContainer>
);

const window = Dimensions.get("window");

var email;
var mobile;

let w = window.Width;
var customerDetails;
// get perticular customer's orders details order by date
export default class CustomerOrdersDetails extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Customer Details",
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
      isLoading: true,
      dataSource: [],
      listDataSource: null, // OREDR DETAILS CUSTOMER
      activeSections: [],
      checkboxes: [],
      payments: [],
      ordercancel: [],
      arrayholder: [],
      multipleSelect: true,
      totalCostOfOrders: 0,
      totalNumberOfOrders: 0,
      totalCostOfPendingAmount: 0,
      totalCostOfReceivedAmount: 0,
    };
  }

  async componentDidMount() {
    console.log("Customer order details componentDidMount");
    // var customerDetails = this.props.getParam("customerDetails");
    var customerMobile = customerDetails.customermobile;
    var customerid = customerDetails.customerid;
    var shopid = await AsyncStorage.getItem("shopid");

    var requestData = {
      shopid: shopid,
      customerMobile: customerMobile,
      customerid: customerid
    };
    var requestBody = JSON.stringify(requestData);
    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/fetchCustomerOrderDetails",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: requestBody
    }).then(result => {
      console.log(
        "Resp Data in customer order details: " + JSON.stringify(result.data)
      );

      this.setState({ listDataSource: result.data.customerorderdata });
      var customerordersummary = result.data.customerordersummary;
      this.setState({
        totalCostOfOrders: customerordersummary.totalCostOfOrders,
        totalNumberOfOrders: customerordersummary.totalNumberOfOrders,
        totalCostOfPendingAmount: customerordersummary.totalCostOfPendingAmount,
        totalCostOfReceivedAmount: customerordersummary.totalCostOfReceivedAmount,
      })

    });
  }

  _createNewOrder = async (customerDetails, deliveryaddress) => {
    var shopmobile = await AsyncStorage.getItem("shopmobile");
    var shopname = await AsyncStorage.getItem("shopname");
    var shopaddress = await AsyncStorage.getItem("shopaddress");
    var customerid = customerDetails.customerid;
    // console.log('shopmobile: '+ shopmobile);
    // console.log('shopname: '+ shopname);
    // console.log('shopaddress: '+ shopaddress);
    if (shopmobile == null || shopname == null || shopaddress == null) {
      //console.log("I am in Google signInx");
      this.props.navigation.navigate("LoginScreen", {
        LogingSceenData: "eventDataFromBookingScreen"
      });
    } else {
      //console.log("customer name: " + customerDetails.name);
      this.props.navigation.navigate("Grocery", {
        customerid: customerid,
        customerMobile: customerDetails.customermobile,
        customerName: customerDetails.customernamebyshop,
        deliveryaddress: deliveryaddress
      });
    }
  };

  addAddress = (customerDetails, deliveryaddress) => {
    this.props.navigation.navigate("AddCustomerAddress", {
      customerMobile: customerDetails.mobile,
      customerName: customerDetails.name,
      deliveryaddress: deliveryaddress
    });
  };

  // CUSTOMER ORDER DETAILS FUNCTIONS FROM ORDERLISTSCREEN - START

  toggleExpanded = id => {
    let activeSections = this.state.activeSections;

    if (activeSections && activeSections.includes(id)) {
      const index = activeSections.indexOf(id);
      activeSections.splice(index, 1);
    } else {
      activeSections = activeSections.concat(id);
    }

    this.setState({ activeSections });
    // console.log("hi");
  };

  toggleCheckboxPacked = (item, id) => {
    let checkboxes = this.state.checkboxes;

    if (checkboxes && checkboxes.includes(id)) {
      const index = checkboxes.indexOf(id);
      checkboxes.splice(index, 1);
    } else {
      checkboxes = checkboxes.concat(id);
      this.updateOrderDetails(item, "packed");
    }

    this.setState({ checkboxes });

    // console.log("MS check a4: " + checkboxes && checkboxes.includes(id));
  };

  toggleCheckboxCompleted = (item, id) => {
    let checkboxes = this.state.checkboxes;

    if (checkboxes && checkboxes.includes(id)) {
      const index = checkboxes.indexOf(id);
      checkboxes.splice(index, 1);
    } else {
      checkboxes = checkboxes.concat(id);
      this.updateOrderDetails(item, "completed");
    }

    this.setState({ checkboxes });
    // console.log("MS check a4: " + checkboxes && checkboxes.includes(id));
  };

  toggleCheckboxOFD = (item, id) => {
    let checkboxes = this.state.checkboxes;

    if (checkboxes && checkboxes.includes(id)) {
      const index = checkboxes.indexOf(id);
      checkboxes.splice(index, 1);
    } else {
      checkboxes = checkboxes.concat(id);
      this.updateOrderDetails(item, "ofd");
    }

    this.setState({ checkboxes });
    // console.log("MS check a4: " + checkboxes && checkboxes.includes(id));
  };

  /*
  Logic for Delivery status update: check if below exit in payment
  1) orderid+Pending
  2) orderid+ofd
  3) orderid+Completed
  if any of above exits for an order then it will be delivery status for that orderid
  */

  toggleCheckboxReceived = (item, id) => {
    let payments = this.state.payments;

    if (payments && payments.includes(id)) {
      const index = payments.indexOf(id);
      payments.splice(index, 1);
    } else {
      payments = payments.concat(id);
      this.updateOrderDetails(item, "received");
    }

    this.setState({ payments });
    // console.log("MS check a4: " + payments && payments.includes(id));
  };

  toggleCheckboxPending = (item, id) => {
    let payments = this.state.payments;

    if (payments && payments.includes(id)) {
      const index = payments.indexOf(id);
      payments.splice(index, 1);
    } else {
      payments = payments.concat(id);
      this.updateOrderDetails(item, "pending");
    }

    this.setState({ payments });
    // console.log("MS check a4: " + payments && payments.includes(id));
  };

  toggleCheckboxCredit = (item, id) => {
    let payments = this.state.payments;

    if (payments && payments.includes(id)) {
      const index = payments.indexOf(id);
      payments.splice(index, 1);
    } else {
      payments = payments.concat(id);
      this.updateOrderDetails(item, "credit");
    }

    this.setState({ payments });
    // console.log("MS check a4: " + payments && payments.includes(id));
  };

  showCancelOrderDialog = id => {
    console.log("showCancelOrderDialog");
    let ordercancel = this.state.ordercancel;

    if (ordercancel && ordercancel.includes(id)) {
      const index = ordercancel.indexOf(id);
      ordercancel.splice(index, 1);
    } else {
      ordercancel = ordercancel.concat(id);
      //this.updateOrderDetails(item, "cancelorder");
    }

    this.setState({ ordercancel });
  };

  handleDontCancel = id => {
    console.log("handleDontCancel:" + id);
    let ordercancel = this.state.ordercancel;
    console.log("handleDontCancel: " + ordercancel);

    if (ordercancel && ordercancel.includes(id)) {
      const index = ordercancel.indexOf(id);
      ordercancel.splice(index, 1);
    }

    this.setState({ ordercancel });
  };

  handleYesCancel = (item, id) => {
    console.log("handleYesCancel:" + id);
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic

    let ordercancel = this.state.ordercancel;
    console.log("handleYesCancel: " + ordercancel);

    if (ordercancel && ordercancel.includes(id)) {
      const index = ordercancel.indexOf(id);
      ordercancel.splice(index, 1);
    }
    this.updateOrderDetails(item, "cancelorder");
    this.setState({ ordercancel });
  };

  itemNotAvailbale = (itemOjb, productRow) => {
    //listDataSource
    var dummyListDataSource = [];
    var listDataSource = this.state.listDataSource;
    listDataSource.map(function(item) {
      //console.log('itemNotAvailbale itemOjb.orderid: '+JSON.stringify(itemOjb))
      if (itemOjb.orderid === item.orderid) {
        var productsRows = item.products;
        var dummyProductRows = [];
        productsRows.map(function(product) {
          if (
            product.productid === productRow.productid &&
            productRow.available === "yes"
          ) {
            var newCost = item.totalcost - productRow.price * productRow.qty;
            if (newCost < 0) {
              newCost = 0;
            }
            item.totalcost = newCost;
            product.available = "NA";
          }
          dummyProductRows.push(product);
        });
        item.products = dummyProductRows;
      }
      dummyListDataSource.push(item);
    });
    console.log(
      "itemNotAvailbale dummyListDataSource: " +
        JSON.stringify(dummyListDataSource)
    );
    this.setState({
      listDataSource: dummyListDataSource
    });
  };

  itemIsAvailbale = (itemOjb, productRow) => {
    console.log("itemIsAvailbale move to origion");
    //listDataSource
    var dummyListDataSource = [];
    var listDataSource = this.state.listDataSource;
    listDataSource.map(function(item) {
      //console.log('itemNotAvailbale itemOjb.orderid: '+JSON.stringify(itemOjb))
      if (itemOjb.orderid === item.orderid) {
        var dummyProductRows = [];
        var productsRows = item.products;
        productsRows.map(function(product) {
          if (
            product.productid === productRow.productid &&
            product.available === "NA"
          ) {
            var newCost =
              parseFloat(item.totalcost) +
              parseFloat(productRow.price) * parseFloat(productRow.qty);
            item.totalcost = newCost;

            product.available = "yes";
          }
          dummyProductRows.push(product);
        });
        item.products = dummyProductRows;
      }
      dummyListDataSource.push(item);
    });
    console.log(
      "itemIsAvailbale move to origion: " + JSON.stringify(dummyListDataSource)
    );
    this.setState({
      listDataSource: dummyListDataSource
    });
  };

  ShowHideTextComponentView = () => {
    if (this.state.showFilter == true) {
      this.setState({ showFilter: false });
    } else {
      this.setState({ showFilter: true });
    }
  };

  onPressMe = option => {
    console.log("onPressMe: " + JSON.stringify(option));

    let selectedButton = option.label;
    if (selectedButton === "All") {
      this.setState({
        listDataSource: this.state.arrayholder
      });
      return;
    }
    const newData = this.state.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      console.log(item.deliverystatus);
      var serchTerm = item.deliverystatus;
      const itemData = serchTerm ? serchTerm.toUpperCase() : "".toUpperCase();
      const textData = selectedButton.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      listDataSource: newData
    });
  };

  ListViewItemSeparator = () => {
    //Item sparator view
    return (
      <View
        style={{
          height: 0.3,
          width: "99%",
          backgroundColor: "#ffff",
          borderBottomColor: "#fff",
          borderBottomWidth: 1
        }}
      />
    );
  };

  // CUSTOMER ORDER DETAILS FUNCTIONS FROM ORDERLISTSCREEN - END

  render() {
    const activeSections = this.state.activeSections;
    const checkboxes = this.state.checkboxes;
    const payments = this.state.payments;
    const ordercancel = this.state.ordercancel;
    const { navigation } = this.props;
    customerDetails = navigation.getParam("customerDetails");
    // var customerMobile = navigation.getParam("customerMobile");
    // var customerName = navigation.getParam("customerName");
    var deliveryaddress = navigation.getParam("deliveryaddress");
    console.log("customerDetails: " + JSON.stringify(customerDetails));

    // if (this.state.isLoading) {
    //   return (
    //     <View style={{ flex: 1, justifyContent: "center" }}>
    //       <ActivityIndicator />
    //     </View>
    //   );
    // }

    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: "rgba(255,255,0,0.5)" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#000",
                fontWeight: "600",
                fontFamily: "sans-serif"
              }}
            >
              {customerDetails.customernamebyshop}/
              {customerDetails.customername}
            </Text>
            {customerDetails.isRegisteredByCustomer === 'yes'? 
            <MaterialCommunityIcons
              style={{ width: 30, height: 30, color: "#2979ff" }}
              name="account-check-outline"
              size={25}
            />: null}
          </View>
          <View
            style={{ flexDirection: "row", marginLeft: 10, marginRight: 10 }}
          >
            <MaterialIcons style={styles.iconMobile} name="phone" size={20} />
            <Text style={{ fontSize: 14, color: "#000" }}>
              {customerDetails.customermobile}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", marginLeft: 10, marginRight: 10 }}
          >
            <MaterialIcons
              style={styles.iconMobile}
              name="location-on"
              size={20}
            />

            {deliveryaddress ? (
              <Text style={{ fontSize: 14, color: "#000", paddingBottom: 7 }}>
                {" "}
                {deliveryaddress}{" "}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.addAddress(customerDetails, deliveryaddress)
                }
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#000",
                    paddingBottom: 7,
                    fontWeight: "500",
                    fontFamily: "sans-serif"
                  }}
                >
                  Add Address
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={{
            backgroundColor: "rgba(255,69,0, 0.7)",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 1
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#fff" }}>Total Orders: {this.state.totalNumberOfOrders}</Text>
            <Text style={{ marginLeft: 15, marginRight: 15, color: "#fff" }}>
              |
            </Text>
            <Text style={{ color: "#fff" }}>Total Amount: {this.state.totalCostOfOrders} Rs.</Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "rgba(0,0,128, 0.4)",
            // alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 1
          }}
        >
          <View style={{ flexDirection: "column" , justifyContent:'center', alignItems:'center'}}>
            <View style={{flexDirection:'row'}}>
              <Feather
                style={{ width: 30, height: 30, color: "#e1f5fe" }}
                name="arrow-down-left"
                size={20}
              />
              <Text
                style={{ color: "#fff", textAlign: "left",  }}
              >
                Amount pending: {this.state.totalCostOfPendingAmount} Rs.
              </Text>
            </View>

            <View style={{flexDirection:'row', }}>
              <MaterialCommunityIcons
                style={{ width: 30, height: 30, color: "#e1f5fe" }}
                name="briefcase-check"
                size={20}
              />

              <Text
                style={{ color: "#fff", textAlign: "right", paddingRight: 10 }}
              >
                Amount received: {this.state.totalCostOfReceivedAmount} Rs.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ width: w }}>
          <TouchableOpacity
            onPress={() => this._createNewOrder(customerDetails)}
            style={{
              height: 50
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
              <Text style={{ color: "#ffffff" }}>CREATE NEW ORDER</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* CUSTOMER ORDER LIST VIEW START*/}

        <FlatList
          data={this.state.listDataSource}
          renderItem={({ item, index }) => (
            <View style={styles.container}>
              {/*Code for Single Collapsible Start*/}
              {(item.deliverystatus === "packed" ||
                item.deliverystatus === "new") &&
              !(item.paymentstatus === "credit") &&
              item.iscancel === "no" ? (
                <TouchableOpacity
                  onPress={() => this.toggleExpanded(item.orderid)}
                  onLongPress={() => this.showCancelOrderDialog(item.orderid)}
                  delayLongPress={1000}
                >
                  <View style={styles.header}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text style={styles.headerText}>{item.customername}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.headerText}>
                          {item.totalcost} Rs
                        </Text>

                        <MaterialCommunityIcons
                          style={{
                            color: "#ffffff",
                            marginLeft: 5,
                            marginRight: 5
                          }}
                          name="dots-vertical"
                          size={20}
                        />

                        {item.deliverystatus === "new" ? (
                          <SimpleLineIcons
                            style={{ color: "#2979ff" }}
                            name="social-twitter"
                            size={20}
                          />
                        ) : item.deliverystatus === "packed" ? (
                          <MaterialCommunityIcons
                            style={{ color: "#2979ff" }}
                            name="package-variant"
                            size={20}
                          />
                        ) : item.deliverystatus === "ofd" ? (
                          <MaterialIcons
                            style={{ color: "#2979ff" }}
                            name="directions-bike"
                            size={20}
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : item.paymentstatus === "credit" ? (
                <TouchableOpacity
                  onPress={() => this.toggleExpanded(item.orderid)}
                  onLongPress={() => this.showCancelOrderDialog(item.orderid)}
                  delayLongPress={1000}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(245, 54, 29, 0.198)	",
                      padding: 16
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text style={styles.headerText}>{item.customername}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.headerText}>
                          {item.totalcost} Rs
                        </Text>

                        <MaterialCommunityIcons
                          style={{
                            color: "#ffffff",
                            marginLeft: 5,
                            marginRight: 5
                          }}
                          name="dots-vertical"
                          size={20}
                        />
                        <Feather
                          style={{ color: "#424242" }}
                          name="arrow-down-left"
                          size={20}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : item.iscancel === "yes" ? (
                <TouchableOpacity
                  onPress={() => this.toggleExpanded(item.orderid)}
                  // onLongPress={() => this.showCancelOrderDialog(item.orderid)}
                  // delayLongPress ={1000}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0, 0.1)",
                      padding: 16
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                          fontFamily: "sans-serif",
                          textDecorationLine: "line-through",
                          textDecorationStyle: "solid"
                        }}
                      >
                        {item.customername}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "500",
                            fontFamily: "sans-serif",
                            textDecorationLine: "line-through",
                            textDecorationStyle: "solid"
                          }}
                        >
                          {item.totalcost} Rs
                        </Text>

                        <MaterialCommunityIcons
                          style={{
                            color: "#ffffff",
                            marginLeft: 5,
                            marginRight: 5
                          }}
                          name="dots-vertical"
                          size={20}
                        />

                        <MaterialIcons
                          style={{ color: "#e91e63" }}
                          name="block"
                          size={20}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.toggleExpanded(item.orderid)}
                  onLongPress={() => this.showCancelOrderDialog(item.orderid)}
                  delayLongPress={1000}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(29, 231, 245, 0.1)	",
                      padding: 16
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text style={styles.headerText}>{item.customername}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.headerText}>
                          {item.totalcost} Rs
                        </Text>

                        <MaterialCommunityIcons
                          style={{
                            color: "#ffffff",
                            marginLeft: 5,
                            marginRight: 5
                          }}
                          name="dots-vertical"
                          size={20}
                        />

                        {item.deliverystatus === "ofd" ? (
                          <MaterialIcons
                            style={{ color: "#2979ff" }}
                            name="directions-bike"
                            size={20}
                          />
                        ) : item.deliverystatus === "completed" ? (
                          <MaterialCommunityIcons
                            style={{ color: "#2979ff" }}
                            name="check"
                            size={20}
                          />
                        ) : item.paymentstatus === "received" ? (
                          <MaterialCommunityIcons
                            style={{ color: "#2979ff" }}
                            name="check-all"
                            size={20}
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              {/*Content of Single Collapsible*/}
              <Collapsible
                collapsed={
                  !(activeSections && activeSections.includes(item.orderid))
                }
                align="center"
              >
                <View
                  style={{
                    height: this.state.layoutHeight,
                    overflow: "hidden"
                  }}
                >
                  {item.products.map((itemx, key) => (
                    <SwipeItem
                      style={styles.button}
                      swipeContainerStyle={styles.swipeContentContainerStyle}
                      leftButtons={leftButton}
                      onLeftButtonsShowed={() =>
                        this.itemNotAvailbale(item, itemx)
                      }
                      // onMovedToOrigin = {() => this.itemIsAvailbale(item, itemx)}
                      onMovedToOrigin={() => this.itemIsAvailbale(item, itemx)}
                      // onRightButtonsShowed = {() => this.itemIsAvailbale(item, itemx)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          backgroundColor: "#eeeeee",
                          marginBottom: 1
                        }}
                      >
                        {itemx.available === "NA" ? (
                          <Text style={styles.strikeText}>
                            {key + 1}. {itemx.productname}
                          </Text>
                        ) : (
                          <Text style={styles.text}>
                            {key + 1}. {itemx.productname}
                          </Text>
                        )}

                        {itemx.available === "NA" ? (
                          <Text style={styles.strikeText}>{itemx.qty}qty</Text>
                        ) : (
                          <Text style={styles.text}>{itemx.qty}qty</Text>
                        )}

                        {itemx.available === "NA" ? (
                          <Text style={styles.strikeText}>{itemx.weight}g</Text>
                        ) : (
                          <Text style={styles.text}>{itemx.weight}g</Text>
                        )}

                        {itemx.available === "NA" ? (
                          <Text style={styles.strikeText}>{itemx.price}Rs</Text>
                        ) : (
                          <Text style={styles.text}>{itemx.price}Rs</Text>
                        )}
                      </View>
                    </SwipeItem>
                  ))}

                  {item.iscancel === "no" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly"
                      }}
                    >
                      <MaterialIcons
                        style={{
                          marginRight: 5,
                          marginLeft: 15,
                          marginTop: 15
                        }}
                        name="directions-bike"
                        size={20}
                      />

                      {item.deliverystatus === "packed" ? (
                        <CheckBox
                          title="Packed"
                          center
                          size={20}
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          onPress={() =>
                            this.toggleCheckboxPacked(
                              item,
                              item.orderid + "Packed"
                            )
                          }
                          checked={true}
                          textStyle={{ fontSize: 10 }}
                          containerStyle={{
                            backgroundColor: "transparent",
                            borderColor: "#fff"
                          }}
                        />
                      ) : (
                        <CheckBox
                          title="Packed"
                          center
                          size={20}
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          onPress={() =>
                            this.toggleCheckboxPacked(
                              item,
                              item.orderid + "Packed"
                            )
                          }
                          checked={
                            checkboxes &&
                            checkboxes.includes(item.orderid + "Packed")
                          }
                          textStyle={{ fontSize: 10 }}
                          containerStyle={{
                            backgroundColor: "transparent",
                            borderColor: "#fff"
                          }}
                        />
                      )}

                      <CheckBox
                        title="Out for Delivery"
                        center
                        size={20}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        onPress={() =>
                          this.toggleCheckboxOFD(item, item.orderid + "ofd")
                        }
                        checked={
                          checkboxes &&
                          checkboxes.includes(item.orderid + "ofd")
                        }
                        textStyle={{ fontSize: 10 }}
                        containerStyle={{
                          backgroundColor: "transparent",
                          borderColor: "#fff"
                        }}
                      />

                      <CheckBox
                        title="Completed"
                        center
                        size={20}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        onPress={() =>
                          this.toggleCheckboxCompleted(
                            item,
                            item.orderid + "Completed"
                          )
                        }
                        checked={
                          checkboxes &&
                          checkboxes.includes(item.orderid + "Completed")
                        }
                        textStyle={{ fontSize: 10 }}
                        containerStyle={{
                          backgroundColor: "transparent",
                          borderColor: "#fff"
                        }}
                      />
                    </View>
                  ) : null}

                  {item.iscancel === "no" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        flexWrap: "wrap"
                      }}
                    >
                      <Text style={{ marginTop: 12, fontSize: 18 }}>
                        {"\u20B9"}
                      </Text>

                      <CheckBox
                        title="Pending"
                        center
                        size={20}
                        // onPress={() => this.toggleCheckboxPending(item, item.orderid+'Pending')}
                        // checked={payments && payments.includes(item.orderid+'Pending')}
                        checked={true}
                        textStyle={{ fontSize: 10 }}
                        containerStyle={{
                          backgroundColor: "transparent",
                          borderColor: "#fff"
                        }}
                      />

                      <CheckBox
                        title="Credit"
                        center
                        size={20}
                        onPress={() =>
                          this.toggleCheckboxCredit(
                            item,
                            item.orderid + "Credit"
                          )
                        }
                        checked={
                          payments && payments.includes(item.orderid + "Credit")
                        }
                        textStyle={{ fontSize: 10 }}
                        containerStyle={{
                          backgroundColor: "transparent",
                          borderColor: "#fff"
                        }}
                      />

                      <CheckBox
                        title="Received"
                        center
                        size={20}
                        onPress={() =>
                          this.toggleCheckboxReceived(
                            item,
                            item.orderid + "Received"
                          )
                        }
                        checked={
                          payments &&
                          payments.includes(item.orderid + "Received")
                        }
                        textStyle={{ fontSize: 10 }}
                        containerStyle={{
                          backgroundColor: "transparent",
                          borderColor: "#fff"
                        }}
                      />
                    </View>
                  ) : null}
                </View>
              </Collapsible>
              {/*Code for Single Collapsible Ends*/}
              <View>
                <Dialog.Container
                  visible={ordercancel && ordercancel.includes(item.orderid)}
                  buttonSeparatorStyle={{ justifyContent: "space-between" }}
                >
                  <Dialog.Title
                    style={{
                      color: "red",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                  >
                    Cancel Order !
                  </Dialog.Title>
                  <Dialog.Description>
                    <Text
                      style={{
                        fontWeight: "500",
                        justifyContent: "center",
                        textAlign: "center"
                      }}
                    >
                      {item.customername}
                    </Text>
                    <Text
                      style={{
                        paddingLeft: 50,
                        justifyContent: "center",
                        textAlign: "center",
                        alignItems: "center"
                      }}
                    >
                      {" "}
                      {item.totalcost} Rs.
                    </Text>
                    {"\n \n"}Do you want to cancel this order? You cannot undo
                    this action.
                  </Dialog.Description>
                  <Dialog.Button
                    label="Yes"
                    style={{ fontFamily: "sans-serif", marginLeft: 50 }}
                    onPress={() => this.handleYesCancel(item, item.orderid)}
                  />
                  <Dialog.Button
                    label="No"
                    style={{ fontFamily: "sans-serif" }}
                    onPress={() => this.handleDontCancel(item.orderid)}
                  />
                </Dialog.Container>
              </View>
            </View>
          )}
          enableEmptySections={true}
          extraData={this.state}
          style={{ marginTop: 1 }}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={this.ListViewItemSeparator}
        />

        {/* CUSTOMER ORDER LIST VIEW ENDS*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 2
  },
  touchButton: {
    alignSelf: "center",
    backgroundColor: "#2980b9",
    paddingVertical: 25,
    width: 295,
    margin: 15
  },
  touchButtonText: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold"
  },

  rowContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    //height: 100,
    //padding: 10,
    marginRight: 10,
    paddingLeft: 5,
    //marginLeft: 10,
    //marginTop: 5,
    //borderRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#ffffff"
    // shadowOpacity: 1.0,
    // shadowRadius: 1
  },
  dateContainer: {
    //marginLeft: 10,
    marginRight: 10
  },

  near_me: {
    margin: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    color: "#60B2E5"
  },

  iconPersone: {
    width: 30,
    height: 30,
    color: "#0091ea"
    //borderRadius: 30,
    //borderWidth: 2,
    //borderColor: 'rgb(170, 207, 202)'
  },

  iconMobile: {
    width: 30,
    height: 30,
    color: "#4caf50"
    //borderRadius: 30,
    //borderWidth: 2,
    //borderColor: 'rgb(170, 207, 202)'
  },
  totalAmountStyle: {
    justifyContent: "space-between",
    flexDirection: "row",
    //flex: 1,
    flexWrap: "wrap",
    alignSelf: "baseline",
    marginTop: 10
    //padding: 16,
  },
  // CUSTOMER ORDER DETAILS SCREEN -START
  rightSwipeItem: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
    paddingRight: 5
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingLeft: 5,
    paddingRight: 5
  },

  listItem: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1
  },

  topHeading: {
    paddingLeft: 10,
    fontSize: 20
  },
  header: {
    backgroundColor: "rgba(142, 213, 87, 0.3)",
    padding: 16
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "sans-serif"
  },

  contentText: {
    fontSize: 14,
    //fontWeight: '500',
    fontFamily: "sans-serif"
  },
  separator: {
    height: 0.5,
    backgroundColor: "#808080",
    width: "95%",
    marginLeft: 16,
    marginRight: 16,
    borderBottomColor: "#d1d0d4",
    borderBottomWidth: 1
  },
  text: {
    fontSize: 13,
    color: "#606070",
    padding: 10
  },
  strikeText: {
    fontSize: 13,
    color: "#606070",
    padding: 10,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid"
  },
  content: {
    //paddingBosubcategoryom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#fff"
  },
  contentChecked: {
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    flexDirection: "row"
  },
  alignCenter: {
    lineHeight: 40,
    color: "black"
  },

  standalone: {
    // marginTop: 30,
    // marginBottom: 30
  },
  standaloneRowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    justifyContent: "center",
    height: 50
  },
  standaloneRowBack: {
    alignItems: "center",
    backgroundColor: "#8BC645",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
    // padding: 15
  },
  backTextWhite: {
    color: "#000000"
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0
  },
  controls: {
    alignItems: "center",
    marginBottom: 30
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5
  },
  switch: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 10,
    width: Dimensions.get("window").width / 4
  },
  trash: {
    height: 25,
    width: 25
  },
  button: {
    width: "99%",
    height: 40,
    alignSelf: "center",
    marginVertical: 1
  },
  swipeContentContainerStyle: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: "#ffffff",
    // borderRadius: 10,
    borderColor: "#e3e3e3",
    borderWidth: 1
  },
  textInputStyle: {
    height: 40,
    marginTop: 15,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: "#009688",
    backgroundColor: "#FFFFFF"
  }
  // CUSTOMER ORDER DETAILS SCREEN -END
});
