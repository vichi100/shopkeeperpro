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
  RefreshControl
} from "react-native";
//import basic react native components
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { Feather } from "@expo/vector-icons";
import RadioGroup from "../radiobutton/RadioGroup";
import { AsyncStorage } from "react-native";
import { SERVER_URL } from "../Constants";
import axios from "axios";

import { CheckBox } from "react-native-elements";

// import * as Animatable from "react-native-animatable";
//import for the animation of Collapse and Expand
import Collapsible from "react-native-collapsible";
import Dialog from "react-native-dialog";

import SwipeItem from "../swipeable/SwipeItem";
import SwipeButtonsContainer from "../swipeable/SwipeButtonsContainer";

import DatePicker from "../datepicker/DatePicker";
import moment from 'moment';

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

export default class LoadOrderListScreen extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Search Orders",
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
      toDate: moment().format("DD-MM-YYYY"),
      fromDate: moment().format("DD-MM-YYYY"), 
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
    var shopid = await AsyncStorage.getItem("shopid");
    const orderQueryData = {
      shopid: shopid
    };

    try {
      axios({
        // Of course the url should be where your actual GraphQL server is.
        url: SERVER_URL + "/ordersByShopId",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: orderQueryData
      })
        .then(result => {
          console.log("Resp Data: " + JSON.stringify(result.data));
          console.log("result.data.length: " + result.data.length);
          // console.log('result.data.ordersummary: '+ result.data.ordersummary.totalcostofneworder)
          var count = Object.keys(result.data).length;

          if (count > 0) {
            this.setState({
              listDataSource: result.data.orderdata,
              orderSummaryData: result.data.ordersummary,
              totalCostOfNewOrder: result.data.ordersummary.totalcostofneworder,
            
              arrayholder: result.data.orderdata,
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

      // fetch(SERVER_URL + "/graphql", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json"
      //   },
      //   body: JSON.stringify({
      //     query:
      //       "{ products{productid  productname brand category description weight  price searchtags  imageurl } }"
      //   })
      // })
      //   .then(res => res.json())
      //   .then(res => {
      //     // console.log("data returned:", JSON.stringify(res))
      //     console.log("data returned:", data.Object);

      //   });
    } catch (err) {
      console.log("Error in OrderListScreen: " + err);
      this.setState({ isLoading: false });
    }
  }

  onRefresh = async () => {
    this.setState({ isRefreshing: true }); // true isRefreshing flag for enable pull to refresh indicator
    var shopid = await AsyncStorage.getItem("shopid");
    const orderQueryData = {
      shopid: shopid
    };

    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/ordersByShopId",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: orderQueryData
    })
      .then(result => {
        console.log("Resp Data: " + JSON.stringify(result.data));
        console.log("result.data.length: " + result.data.length);
        // console.log('result.data.ordersummary: '+ result.data.ordersummary.totalcostofneworder)
        var count = Object.keys(result).length;

        if (count > 0) {
          this.setState({
            listDataSource: result.data.orderdata,
            orderSummaryData: result.data.ordersummary,
            totalCostOfNewOrder: result.data.ordersummary.totalcostofneworder,
            
            arrayholder: result.data.orderdata,
            isLoading: false,
            isRefreshing: false
          });
        } else {
          console.log("I am in else");
          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({ isLoading: false, isRefreshing: false });
      });

    // const url = `https://api.stackexchange.com/2.2/users?page=1&order=desc&sort=reputation&site=stackoverflow`;
    // axios.get(url)
    //   .then(res => {
    //     let data = res.data.items
    //     this.setState({ isRefreshing: false, data: data }) // false isRefreshing flag for disable pull to refresh indicator, and clear all data and store only first page data
    //   })
    //   .catch(error => {
    //     this.setState({ isRefreshing: false, error: 'Something just went wrong' }) // false isRefreshing flag for disable pull to refresh
    //   });
  };

  resetFliter = async() =>{
    this.setState({
      toDate: moment().format("DD-MM-YYYY"),
      fromDate: moment().format("DD-MM-YYYY"), 
    })
  }

  fetchDataByDateRange = async () => {
    this.setState({ isRefreshing: true }); // true isRefreshing flag for enable pull to refresh indicator
    var shopid = await AsyncStorage.getItem("shopid");
    console.log('todate: '+this.state.toDate+'    fromdate: '+this.state.fromDate )
    const orderQueryData = {
      shopid: shopid, 
      todate: this.state.toDate, 
      fromdate: this.state.fromDate,    
    };

    axios({
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL + "/fetchDataByDateRange",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: orderQueryData
    })
      .then(result => {
        console.log("Resp Data: " + JSON.stringify(result.data));
        console.log("result.data.length: " + result.data.length);
        // console.log('result.data.ordersummary: '+ result.data.ordersummary.totalcostofneworder)
        var count = Object.keys(result).length;

        if (count > 0) {
          this.setState({
            listDataSource: result.data.orderdata,
            orderSummaryData: result.data.ordersummary,
            arrayholder: result.data.orderdata,
            isLoading: false,
            isRefreshing: false
          });
        } else {
          console.log("I am in else");
          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({ isLoading: false, isRefreshing: false });
      });

    
  };

  updateOrderDetails = (orderItem, status) => {
    console.log("orderItem: " + JSON.stringify(orderItem));
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

  /*
Logic for Delivery status update: check if below exit in checkboxes
1) orderid+Pending
2) orderid+ofd
3) orderid+Completed
if any of above exits for an order then it will be delivery status for that orderid
*/
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
    this.onRefresh();
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
      listDataSource: newData,
      isFilterActive: true
    });
  };

  SearchFilterFunction = text => {
    console.log(text);
    console.log("SearchFilterFunction item: " + this.state.arrayholder);
    //passing the inserted text in textinput
    const newData = this.state.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      console.log(item.customername);
      var serchTerm = item.customername + item.customermobile;
      const itemData = serchTerm ? serchTerm.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      listDataSource: newData,
      text: text
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
        <View style={{ flex: 1, paddingTop: 20, justifyContent:'center', alignItems:'center' }}>
          <ActivityIndicator 
            color = '#ea80fc'
            size = "large"
 
          />
        </View>
      );
    }

    

    // let selectedButton = this.state.filterData.find(e => e.selected == true);
    // selectedButton = selectedButton
    //   ? selectedButton.value
    //   : this.state.filterData[0].label;
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 7
          }}
        >
          <MaterialIcons
            style={{ marginLeft: 10, marginTop: 7 }}
            name="search"
            size={20}
          />
          <TextInput
            style={{ marginRight: 15, marginLeft: 10 }}
            onChangeText={text => this.SearchFilterFunction(text)}
            value={this.state.text}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />

          <TouchableOpacity onPress={() => this.ShowHideTextComponentView()}>
            <MaterialIcons
              style={{ marginRight: 10, marginTop: 7 }}
              name="filter-list"
              size={20}
            />
          </TouchableOpacity>
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
            <View style={{ flexDirection: "column" }}>
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
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={{fontSize:12}}>START DATE</Text>
                  <DatePicker
                    style={{ width: 200 }}
                    date={this.state.fromDate} //initial date from state
                    mode="date" //The enum of date, datetime and time
                    placeholder="select date"
                    format="DD-MM-YYYY"
                    // minDate="01-01-2016"
                    // maxDate="01-01-2019" 
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 36
                      }
                    }}
                    onDateChange={date => {
                      this.setState({ fromDate: date });
                    }}
                  />
                </View>
                <View>
                  <Text style={{ textAlign: "right", marginRight: 3 , fontSize:12}}>
                    END DATE
                  </Text>
                  <DatePicker
                    style={{ width: 200 }}
                    date={this.state.toDate} //initial date from state
                    mode="date" //The enum of date, datetime and time
                    placeholder="select date"
                    format="DD-MM-YYYY"
                    // minDate="01-01-2016"
                    // maxDate="01-01-2019"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 36
                      }
                    }}
                    onDateChange={date => {
                      this.setState({ toDate: date });
                    }}
                  />
                </View>
              </View>
              <View style={{justifyContent:'center',alignItems:'center', flexDirection:'row'}}>
              <TouchableOpacity onPress={() => this.resetFliter()}>
                <View style={styles.resetbutton}>
                  <Text style={styles.buttonText}>RESET</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.fetchDataByDateRange()}>
                <View style={styles.searchbutton}>
                  <Text style={styles.buttonText}>SEARCH</Text>
                </View>
              </TouchableOpacity>
              
              </View>
            </View>
          ) : null}
        </View>
        {(this.state.listDataSource === null || this.state.listDataSource === undefined ||
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
                        <Text style={styles.headerText}>
                          {item.customername}
                        </Text>
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
                              style={{
                                color: "#2979ff",
                                transform: [{ rotate: "360deg" }]
                              }}
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
                        <Text style={styles.headerText}>
                          {item.customername}
                        </Text>
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
                        <Text style={styles.headerText}>
                          {item.customername}
                        </Text>
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
                          {item.customermobile}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <AntDesign
                          style={{ marginRight: 10 }}
                          name="home"
                          size={20}
                        />
                        <Text style={styles.contentText}>
                          {item.deliveryaddress}
                        </Text>
                      </View>
                    </View>
                    {item.products.map((itemx, key) => (
                      <SwipeItem
                        style={styles.button}
                        swipeContainerStyle={styles.swipeContentContainerStyle}
                        leftButtons={leftButton}
                        onLeftButtonsShowed={() =>
                          this.itemNotAvailbale(item, itemx)
                        }
                        // onMovedToOrigin = {() => this.itemIsAvailbale(item, itemx)}
                        onMovedToOrigin={() =>
                          this.itemIsAvailbale(item, itemx)
                        }
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
                            <Text style={styles.strikeText}>
                              {itemx.qty}qty
                            </Text>
                          ) : (
                            <Text style={styles.text}>{itemx.qty}qty</Text>
                          )}

                          {itemx.available === "NA" ? (
                            <Text style={styles.strikeText}>
                              {itemx.weight}g
                            </Text>
                          ) : (
                            <Text style={styles.text}>{itemx.weight}g</Text>
                          )}

                          {itemx.available === "NA" ? (
                            <Text style={styles.strikeText}>
                              {itemx.price}Rs
                            </Text>
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
                            payments &&
                            payments.includes(item.orderid + "Credit")
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
    borderColor: "#bdbdbd",
    backgroundColor: "#FFFFFF"
  },
  searchbutton: {
    width: 75,
    borderColor: "#bdbdbd",
    borderWidth: 1,
    height: 30,
    padding: 10,
    borderRadius: 24,
    marginTop: 5,
    marginBottom:5,
    backgroundColor: "#bdbdbd",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#bdbdbd",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 5,
    shadowOpacity: 0.8
  },
  resetbutton: {
    width: 75,
    borderColor: "#bdbdbd",
    borderWidth: 1,
    height: 30,
    padding: 10,
    borderRadius: 24,
    marginTop: 5,
    marginRight:30,
    marginBottom:5,
    backgroundColor: "#bdbdbd",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#bdbdbd",
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
