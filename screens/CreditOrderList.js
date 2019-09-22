/*Example of Expandable ListView in React Native*/
import React, { Component } from "react";
//import react in our project
import {
  LayoutAnimation,
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
  RefreshControl,
  Button
} from "react-native";
//import basic react native components
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";

import { Feather } from "@expo/vector-icons";
import RadioGroup from "../radiobutton/RadioGroup";
import { AsyncStorage } from "react-native";
import { SERVER_URL } from "../Constants";
import axios from "axios";

import Modal from "react-native-modal";

// import * as Animatable from "react-native-animatable";
//import for the animation of Collapse and Expand
import Collapsible from "react-native-collapsible";
import Dialog from "react-native-dialog";
import SwipeButtonsContainer from "../swipeable/SwipeButtonsContainer";

import withPreventDoubleClick from "../withPreventDoubleClick";

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

var shopid = null;
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
    <TouchableOpacityEx onPress={() => console.log("left button clicked")}>
      <Text
        style={{
          fontWeight: "600",
          fontFamily: "sans-serif",
          color: "#d84315"
        }}
      >
        NA
      </Text>
    </TouchableOpacityEx>
  </SwipeButtonsContainer>
);

export default class CreditOrderList extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Credit Orders",
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
  //Main View defined under this Class
  constructor() {
    super();
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      justreceivedamount: 0,
      receivePaymentActive: false,
      paymentsdata: [],
      nonadjustableamount: 0, // this amount is remaining amount of received payment which is not able to close any order for now
      creditordersamount: 0,
      receiveamount: 0, // the amount which received today
      previousbalanceamount: 0,
      balanceamountafterreceivingpayment: 0, // remaining amount after receiving payment
      totalbalanceamount: 0, // credit order amount + previousbalanceamount
      shopid: null,
      isRefreshing: false,
      isLoading: true,
      activeSections: [],
      checkboxes: [],
      payments: [],
      ordercancel: [],
      arrayholder: [],
      multipleSelect: true,
      listDataSource: null,
      orderSummaryData: null,
      totalCostOfNewOrder: 0,
      totalNumberOfNewOrder: 0,
      totalCostOfPendingOrder: 0,
      totalNumberOfPendingOrder: 0,
      totalCostOfCompletedOrder: 0,
      totalNumberOfCompletedOrder: 0,
      showFilter: false,
      update: [],
      collapsed: true,
      checked: false,
      isFilterActive: false,
      isSearching: false,
      filterData: [
        {
          label: "All",
          color: "#90caf9",
          size: 14,
          flexDirection: "row"
        },
        {
          label: "New",
          color: "#90caf9",
          size: 14,
          flexDirection: "row"
        },
        {
          label: "Packed",
          color: "#90caf9",
          size: 14,
          flexDirection: "row"
        },
        {
          label: "Delivery",
          color: "#90caf9",
          size: 14,
          flexDirection: "row"
        },

        {
          label: "Completed",
          color: "#90caf9",
          size: 16,
          flexDirection: "row"
        }
      ]
    };
  }

  async componentDidMount() {
    console.log("componentDidMount");
    this.props.navigation.addListener("didFocus", this.onScreenFocus);
    shopid = await AsyncStorage.getItem("shopid");
    const orderQueryData = {
      shopid: shopid
    };

    try {
      axios({
        // Of course the url should be where your actual GraphQL server is.
        url: SERVER_URL + "/creditOrdersByShopId",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: orderQueryData
      })
        .then(result => {
          console.log("Resp Data: " + JSON.stringify(result.data));
          // console.log('result.data.length: '+result.data.length);
          // console.log('result.data.ordersummary: '+ result.data.ordersummary.totalcostofneworder)
          var count = Object.keys(result.data).length;
          console.log("count: " + count);
          if (count > 0) {
            this.setState({
              listDataSource: result.data,
              arrayholder: result.data,
              isLoading: false
            });
          } else {
            console.log("I am in else");
            this.setState({ isLoading: false });
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({ isLoading: false });
        });
    } catch (err) {
      console.log("Error in OrderListScreen: " + err);
      this.setState({ isLoading: false });
    }
  }

  // Called when our screen is focused
  onScreenFocus = () => {
    // Screen was focused, our on focus logic goes here
    this.onRefresh();
  };

  onRefresh = async () => {
    this.setState({ isRefreshing: true, checkboxes: [], payments: [] }); // true isRefreshing flag for enable pull to refresh indicator
    shopid = await AsyncStorage.getItem("shopid");
    if (shopid !== null) {
      this.setState({ shopid: shopid });
    }
    const orderQueryData = {
      shopid: shopid
    };

    try {
      axios({
        // Of course the url should be where your actual GraphQL server is.
        url: SERVER_URL + "/creditOrdersByShopId",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: orderQueryData
      })
        .then(result => {
          console.log("Resp Data: " + JSON.stringify(result.data));
          // console.log('result.data.length: '+result.data.length);
          // console.log('result.data.ordersummary: '+ result.data.ordersummary.totalcostofneworder)
          var count = Object.keys(result.data).length;
          console.log("count: " + count);
          if (count > 0) {
            this.setState({
              listDataSource: result.data,
              arrayholder: result.data,
              isRefreshing: false
            });
          } else {
            console.log("I am in else");
            this.setState({ isRefreshing: false });
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({ isRefreshing: false });
        });
    } catch (err) {
      console.log("Error in OrderListScreen: " + err);
      this.setState({ isRefreshing: false });
    }
  };

  updateOrderDetails = (orderItem, status) => {
    // console.log("orderItem: " + JSON.stringify(orderItem));
    var orderUpdateData = null;
    if (status === "packed" || status === "ofd" || status === "completed") {
      // update fileds: products, totalcost, deliverystatus, paymentstatus
      orderUpdateData = {
        orderid: orderItem.orderid,
        totalcost: orderItem.totalcost,
        products: orderItem.products,
        status: status
      };
    } else if (
      status === "pending" ||
      status === "credit" ||
      status === "received"
    ) {
      orderUpdateData = {
        orderid: orderItem.orderid,
        totalcost: orderItem.totalcost,
        products: orderItem.products,
        status: status
      };
    } else if (status === "cancelorder") {
      orderUpdateData = {
        orderid: orderItem.orderid,
        status: status
      };
    }

    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/updateOrderDetails",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: orderUpdateData
    })
      .then(result => {
        console.log("Resp Data: " + JSON.stringify(result.data));
        // this.setState({ listDataSource: result.data });
      })
      .catch(error => {
        console.error(error);
      });
  };

  toggleExpanded = async (item, id) => {
    this.setState({ isLoading: true });
    var shopid = await AsyncStorage.getItem("shopid");
    var customerid = id;
    const orderQueryData = {
      shopid: shopid,
      customerid: customerid
    };
    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/fetchPaymentDetails",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: orderQueryData
    })
      .then(result => {
        console.log("Resp Data: " + JSON.stringify(result.data));
        // console.log('result.data.length: '+result.data.length);
        // console.log('result.data.ordersummary: '+ result.data.ordersummary.totalcostofneworder)
        var count = Object.keys(result.data).length;
        this.setState({ paymentsdata: result.data });
        console.log("paymentsdata: " + JSON.stringify(this.state.paymentsdata));

        let activeSections = this.state.activeSections;

        // if (activeSections && activeSections.includes(id)) {
        //   const index = activeSections.indexOf(id);
        //   activeSections.splice(index, 1);
        // } else {
        //   activeSections = activeSections.concat(id);
        // }
        // let activeSections = [];

        if (activeSections && activeSections.includes(id)) {
          const index = activeSections.indexOf(id);
          activeSections.splice(index, 1);
        } else {
          activeSections = [];
          activeSections = activeSections.concat(id);
        }

        // activeSections = activeSections.concat(id);
        this.setState({ activeSections });
        this.setState({ isLoading: false });
      })
      .catch(error => {
        console.error(error);
        this.setState({ isLoading: false });
      });

    // console.log("hi");
  };

  receivePayment = async (item, id) => {
    if (this.state.receivePaymentActive === false) {
      this.setState({ receivePaymentActive: true });
      console.log("receivePayment:" + id);
      // The user has pressed the "Delete" button, so here you can do your own logic.
      // ...Your logic
      var shopid = await AsyncStorage.getItem("shopid");
      var shopname = await AsyncStorage.getItem("shopname");
      var shopmobile = await AsyncStorage.getItem("shopmobile");
      var customerid = id;
      var creditordersamount = item.totalAmount;
      var receiveamount = this.state.receiveamount;
      var balanceamountafterreceivingpayment = this.state
        .balanceamountafterreceivingpayment;

      var previousbalanceamount = 0;
      var count = Object.keys(this.state.paymentsdata).length;
      if (this.state.paymentsdata !== null && count > 0) {
        previousbalanceamount = this.state.paymentsdata[count - 1]
          .balanceafterreceivingpayment;
      } else {
        previousbalanceamount = 0;
      }

      const orderQueryData = {
        shopid: shopid,
        shopname: shopname,
        shopmobile: shopmobile,
        customerid: customerid,
        customername: item._id.customername,
        customermobile: item._id.customermobile,
        deliveryaddress: item._id.deliveryaddress,
        creditordersamount: creditordersamount,
        previousbalanceamount: previousbalanceamount,
        receiveamount: receiveamount,
        balanceamountafterreceivingpayment: balanceamountafterreceivingpayment
      };

      axios({
        // Of course the url should be where your actual GraphQL server is.
        url: SERVER_URL + "/insertPaymentDetails",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: orderQueryData
      })
        .then(result => {
          console.log("Resp Data: " + JSON.stringify(result.data));
          var count = Object.keys(result.data).length;
          console.log("count: " + count);
          this.refreshPaymentDataOnReceiveAmount(item, id);
          this.onRefresh();
        })
        .catch(error => {
          console.error(error);
          this.setState({ isLoading: false });
        });

      let ordercancel = this.state.ordercancel;
      console.log("handleYesCancel: " + ordercancel);

      if (ordercancel && ordercancel.includes(id)) {
        const index = ordercancel.indexOf(id);
        ordercancel.splice(index, 1);
      }
      // this.updateOrderDetails(item, "cancelorder");
      this.setState({ ordercancel });
    }
    this.setState({ receivePaymentActive: false });
  };

  refreshPaymentDataOnReceiveAmount = async (item, id) => {
    var shopid = await AsyncStorage.getItem("shopid");
    var customerid = id;
    const orderQueryData = {
      shopid: shopid,
      customerid: customerid
    };
    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/fetchPaymentDetails",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: orderQueryData
    })
      .then(result => {
        console.log("Resp Data: " + JSON.stringify(result.data));
        // console.log('result.data.length: '+result.data.length);
        // console.log('result.data.ordersummary: '+ result.data.ordersummary.totalcostofneworder)
        var count = Object.keys(result.data).length;
        this.setState({ paymentsdata: result.data });
        console.log("paymentsdata: " + JSON.stringify(this.state.paymentsdata));
        this.setState({
          balanceamountafterreceivingpayment: 0,
          receiveamount: 0,
          justreceivedamount: 0
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ isLoading: false });
      });

    // console.log("hi");
  };

  calculateBalanceAmount = receiveamount => {
    console.log("receiveamount" + receiveamount);
    console.log("totalbalanceamount: " + this.state.totalbalanceamount);
    //totalbalanceamount = creditordersamount + previousbalanceamount
    var remainingBalanceAmount =
      Number(this.state.totalbalanceamount) - Number(receiveamount);
    this.setState({
      balanceamountafterreceivingpayment: remainingBalanceAmount,
      receiveamount: receiveamount,
      justreceivedamount: receiveamount
    });
  };

  showReceivePaymentDialog = (item, id) => {
    console.log("showReceivePaymentDialog");
    let ordercancel = this.state.ordercancel;

    if (ordercancel && ordercancel.includes(id)) {
      const index = ordercancel.indexOf(id);
      ordercancel.splice(index, 1);
    } else {
      ordercancel = ordercancel.concat(id);
      //this.updateOrderDetails(item, "cancelorder");
    }

    //totalbalanceamount = creditordersamount + previousbalanceamount
    console.log("item: " + JSON.stringify(item));
    console.log("item.totalAmount: " + item.totalAmount);
    console.log("item.partialpaymentamount: " + item.partialpaymentamount);
    var totalbalanceamount =
      Number(item.totalAmount) -
      Number(item.totalpartialpaymentamount) -
      Number(this.state.justreceivedamount); //+ balance amount from last payment

    this.setState({ totalbalanceamount: totalbalanceamount });

    this.setState({ ordercancel });
  };

  dontReceivePayment = (item, id) => {
    console.log("dontReceivePayment:" + id);
    let ordercancel = this.state.ordercancel;
    console.log("dontReceivePayment: " + ordercancel);

    if (ordercancel && ordercancel.includes(id)) {
      const index = ordercancel.indexOf(id);
      ordercancel.splice(index, 1);
    }

    this.setState({ ordercancel });
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
      listDataSource: newData,
      isFilterActive: true
    });
  };

  SearchFilterFunction = text => {
    // console.log(text);
    // console.log("SearchFilterFunction item: " + this.state.arrayholder);
    //passing the inserted text in textinput
    const newData = this.state.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      console.log(item._id.customername);
      var serchTerm = item._id.customername + item._id.customermobile;
      const itemData = serchTerm ? serchTerm.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      listDataSource: newData,
      text: text,
      isSearching: true
    });
  };

  registerShop = () => {
    this.props.navigation.navigate("LoginScreen");
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

  render() {
    // const { multipleSelect, activeSections } = this.state;
    const activeSections = this.state.activeSections;
    const checkboxes = this.state.checkboxes;
    const payments = this.state.payments;
    const ordercancel = this.state.ordercancel;

    // console.log('this.state.listDataSource: '+ this.state.listDataSource);

    if (this.state.isLoading) {
      console.log("isLoading: " + this.state.isLoading);
      //Loading View while data is loading
      return (
        <View
          style={{
            flex: 1,
            paddingTop: 20,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator color="#ea80fc" size="large" />
        </View>
      );
    }

    if (shopid === null && this.state.listDataSource === null) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacityEx onPress={() => this.registerShop()}>
            <View style={styles.buttonx}>
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  fontWeight: "500",
                  fontFamily: "sans-serif"
                }}
              >
                REGISTER NOW
              </Text>
            </View>
            <Text
              style={{ fontFamily: "sans-serif", marginTop: 5, fontSize: 10 }}
            >
              TO CHECK YOUR CREDITORS AND CREDIT AMOUNT
            </Text>
          </TouchableOpacityEx>
        </View>
      );
    }

    if (
      (this.state.listDataSource === null ||
        this.state.listDataSource.length === 0) &&
      !this.state.isFilterActive &&
      !this.state.isSearching
    ) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Zero Credit Balance</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "rgba(0,0,128, 0.4)",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#fff" }}>
              Creditors: {this.state.totalNumberOfPendingOrder}
            </Text>
            <Text style={{ marginLeft: 15, marginRight: 15, color: "#fff" }}>
              |
            </Text>
            <Text style={{ color: "#fff" }}>
              Credit Amount: {this.state.totalNumberOfCompletedOrder} of{" "}
              {this.state.totalCostOfCompletedOrder} Rs.
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: 7
          }}
        >
          <MaterialIcons
            style={{ marginLeft: 10, marginTop: 7 }}
            name="search"
            size={20}
          />
          <TextInput
            style={{ marginRight: 15, marginLeft: 10, textAlign: "center" }}
            onChangeText={text => this.SearchFilterFunction(text)}
            value={this.state.text}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />
          {/* <TextInput
          style={styles.textInputStyle}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        /> */}
          {/* <TouchableOpacityEx onPress={() => this.ShowHideTextComponentView()}>
            <MaterialIcons
              style={{ marginRight: 10, marginTop: 7 }}
              name="filter-list"
              size={20}
            />
          </TouchableOpacityEx> */}
        </View>
        {/* THIS FILTER COMPONANT WILL HIDE ANS SHOW */}
        {/* <View>
        {this.state.showFilter ? <Text style= {{ fontSize: 25, color: "#000", textAlign: 'center' }}> Hello Friends </Text> : null}
        </View> */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "#f5f5f5"
          }}
        >
          {this.state.showFilter ? (
            <View style={{ flexDirection: "row" }}>
              <RadioGroup
                // flexDirection='col'
                // labelStyle={{fontSize:8}}
                // radioButtons={this.state.filterData}
                // onPress={this.onPress}
                horizontal
                options={radiogroup_options}
                onChange={option => this.onPressMe(option)}
                CircleStyle={{
                  width: 15,
                  height: 15,
                  borderColor: "#000",
                  borderWidth: 0.3,
                  margin: 5,
                  fillColor: "#90caf9"
                }}
              />
            </View>
          ) : null}
        </View>
        {(this.state.listDataSource === null ||
          this.state.listDataSource.length === 0) &&
        this.state.isFilterActive ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Zero Result Found</Text>
          </View>
        ) : (
          <FlatList
            data={this.state.listDataSource}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}
              />
            }
            renderItem={({ item, index }) => (
              <View style={styles.container}>
                {/*Code for Single Collapsible Start*/}

                <TouchableOpacityEx
                  onPress={() => this.toggleExpanded(item, item._id.customerid)}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(245, 54, 29, 0.198)",
                      padding: 12,
                      flexDirection: "row"
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 10, marginRight: 10 }}>
                        {
                          moment(item.createdatetime)
                            .format("DD-MMM")
                            .split("-")[0]
                        }
                      </Text>
                      <Text style={{ fontSize: 10, marginRight: 10 }}>
                        {
                          moment(item.createdatetime)
                            .format("DD-MMM")
                            .split("-")[1]
                        }
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text style={styles.headerText}>
                        {item._id.customername}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.headerText}>
                          {Number(item.totalAmount) -
                            Number(item.totalpartialpaymentamount) -
                            Number(this.state.justreceivedamount)}{" "}
                          Rs
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
                </TouchableOpacityEx>

                {/*Content of Single Collapsible*/}
                <Collapsible
                  collapsed={
                    !(
                      activeSections &&
                      activeSections.includes(item._id.customerid)
                    )
                  }
                  align="center"
                >
                  <View
                    style={{
                      height: this.state.layoutHeight,
                      overflow: "hidden"
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(128,128,0, 0.1)",
                        marginTop: 0.5,
                        padding: 10
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <MaterialIcons
                          style={{ marginRight: 10 }}
                          name="phone"
                          size={20}
                        />
                        <Text style={styles.contentText}>
                          {item._id.customermobile}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <AntDesign
                          style={{ marginRight: 10 }}
                          name="home"
                          size={20}
                        />
                        <Text style={styles.contentText}>
                          {item._id.deliveryaddress}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: "rgba(50, 210, 159, 0.84)",
                        hight: 50
                      }}
                    >
                      <TouchableOpacityEx
                        onPress={() =>
                          this.showReceivePaymentDialog(
                            item,
                            item._id.customerid
                          )
                        }
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            padding: 10,
                            color: "#ffffff"
                          }}
                        >
                          RECEIVE PAYMENT
                        </Text>
                      </TouchableOpacityEx>
                    </View>

                    {this.state.paymentsdata.map((itemx, key) =>
                      itemx.orderid === null || itemx.orderid === undefined ? (
                        <View
                          style={{
                            backgroundColor: "rgba(129, 237, 178, 0.1)",
                            padding: 10,
                            marginBottom: 2
                            // justifyContent:'center',
                            // alignItems: 'center'
                          }}
                        >
                          <Text style={{ textAlign: "center", fontSize: 12 }}>
                            {moment(itemx.updatedatetime).format(
                              "DD MMM, YYYY"
                            )}
                            {/* {itemx.updatedatetime} */}
                          </Text>
                          {/* <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}
                        >
                          <Text
                            style={{
                              color: "#616161",
                              fontFamily: "sans-serif"
                            }}
                          >
                            Recent Previous Order 
                          </Text>
                          <Text
                            style={{
                              color: "#616161",
                              fontFamily: "sans-serif"
                            }}
                          >
                            {itemx.creditordersamount} Rs
                          </Text>
                        </View> */}
                          {/* <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}
                        >
                          <Text
                            style={{
                              color: "#616161",
                              fontFamily: "sans-serif"
                            }}
                          >
                            Previous Balance
                          </Text>
                          <Text
                            style={{
                              color: "#616161",
                              fontFamily: "sans-serif"
                            }}
                          >
                            +{Number(itemx.receiveamount)+Number(itemx.balanceafterreceivingpayment)} Rs
                          </Text>
                        </View> */}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                          >
                            <Text
                              style={{
                                color: "#616161",
                                fontFamily: "sans-serif"
                              }}
                            >
                              Received Amount
                            </Text>
                            <Text
                              style={{
                                color: "#616161",
                                fontFamily: "sans-serif"
                              }}
                            >
                              -{itemx.receiveamount} Rs
                            </Text>
                          </View>
                          {/* <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}
                        >
                          <Text
                            style={{
                              color: "#616161",
                              fontFamily: "sans-serif"
                            }}
                          >
                            Balance After Payment
                          </Text>
                          <Text
                            style={{
                              color: "#616161",
                              fontFamily: "sans-serif"
                            }}
                          >
                            {itemx.balanceafterreceivingpayment} Rs
                          </Text>
                        </View> */}
                        </View>
                      ) : 
                     itemx.paymentstatus === 'credit' ?
                      
                      
                      (
                        <View
                          style={{
                            backgroundColor: "rgba(245, 54, 29, 0.025)",
                            padding: 12,
                            flexDirection: "row"
                          }}
                        >
                          <View>
                            <Text style={{ fontSize: 10, marginRight: 10 }}>
                              {
                                moment(item.createdatetime)
                                  .format("DD-MMM")
                                  .split("-")[0]
                              }
                            </Text>
                            <Text style={{ fontSize: 10, marginRight: 10 }}>
                              {
                                moment(item.createdatetime)
                                  .format("DD-MMM")
                                  .split("-")[1]
                              }
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                          >
                            <Text style={styles.headerText}>
                              {itemx.customername}
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                              <Text style={styles.headerText}>
                                {Number(itemx.totalcost)} Rs
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
                      ):

                      (
                        <View
                          style={{
                            backgroundColor: "rgba(29, 231, 245, 0.1)",
                            padding: 12,
                            flexDirection: "row"
                          }}
                        >
                          <View>
                            <Text style={{ fontSize: 10, marginRight: 10 }}>
                              {
                                moment(item.createdatetime)
                                  .format("DD-MMM")
                                  .split("-")[0]
                              }
                            </Text>
                            <Text style={{ fontSize: 10, marginRight: 10 }}>
                              {
                                moment(item.createdatetime)
                                  .format("DD-MMM")
                                  .split("-")[1]
                              }
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                          >
                            <Text style={styles.headerText}>
                              {itemx.customername}
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                              <Text style={styles.headerText}>
                                {Number(itemx.totalcost)} Rs
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
                              <MaterialCommunityIcons
                                style={{ color: "#424242" }}
                                name="check-all"
                                size={20}
                              />
                            </View>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                </Collapsible>
                {/*Code for Single Collapsible Ends*/}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    hight: 500,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Modal
                    isVisible={
                      ordercancel && ordercancel.includes(item._id.customerid)
                    }
                  >
                    <View style={{ backgroundColor: "#fff" }}>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgba(63, 191, 184, 0.1)",
                          padding: 10
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "sans-serif",
                            fontWeight: "500"
                          }}
                        >
                          Receive Payment
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: 10
                        }}
                      >
                        <Text> {item._id.customername} </Text>
                        <Text>{this.state.totalbalanceamount} Rs.</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: 10
                        }}
                      >
                        <Text>Receive Amount</Text>
                        <TextInput
                          style={{ textAlign: "right" }}
                          placeholder="Enter Amount"
                          onChangeText={receiveamount =>
                            this.calculateBalanceAmount(receiveamount)
                          }
                          value={this.state.receiveamount}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: 10
                        }}
                      >
                        <Text> Balance Amount </Text>
                        <Text>
                          {this.state.balanceamountafterreceivingpayment} Rs.
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end"
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "rgba(50, 210, 159, 0.84)",
                            hight: 45,
                            margin: 10
                          }}
                        >
                          <TouchableOpacityEx
                            onPress={() =>
                              this.dontReceivePayment(item, item._id.customerid)
                            }
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                padding: 10,
                                color: "#ffffff"
                              }}
                            >
                              CANCEL
                            </Text>
                          </TouchableOpacityEx>
                        </View>
                        <View
                          style={{
                            backgroundColor: "rgba(50, 210, 159, 0.84)",
                            hight: 45,
                            margin: 10
                          }}
                        >
                          <TouchableOpacityEx
                            onPress={() =>
                              this.receivePayment(item, item._id.customerid)
                            }
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                padding: 10,
                                color: "#ffffff"
                              }}
                            >
                              RECEIVE
                            </Text>
                          </TouchableOpacityEx>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            )}
            enableEmptySections={true}
            extraData={this.state}
            style={{ marginTop: 1 }}
            keyExtractor={(item, index) => index}
            ItemSeparatorComponent={this.ListViewItemSeparator}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 1
    //backgroundColor: "#F5FCFF"
  },
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
  },
  buttonx: {
    width: 325,
    borderColor: "#42a5f5",
    borderWidth: 1,
    height: 50,
    padding: 10,
    // borderRadius: 24,
    marginTop: 20,
    backgroundColor: "#42a5f5",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#42a5f5",
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
  }
});
