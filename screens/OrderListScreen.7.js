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
  Dimensions
} from "react-native";
//import basic react native components
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RadioGroup from "react-native-radio-buttons-group";
import { SERVER_URL } from "../Constants";
// import Card from "../screens/cards/Card";
import axios from "axios";
// import { SwipeRow } from "react-native-swipe-list-view";

// import Swipeable from "react-native-swipeable-row";
// import Swipeable from "../swipeable/Swipeable";

import { CheckBox } from "react-native-elements";

// import * as Animatable from "react-native-animatable";
//import for the animation of Collapse and Expand
import Collapsible from "react-native-collapsible";


//ORDER LIST CLASS:

import  SwipeItem  from '../swipeable/SwipeItem';
import SwipeButtonsContainer from '../swipeable/SwipeButtonsContainer'

const leftButton = (
  <SwipeButtonsContainer
      style={{
          alignSelf: 'center',
          aspectRatio: 1,
          flexDirection: 'column',
          padding: 5,
          //backgroundColor:'red'
      }}
      
  >
      <TouchableOpacity
          onPress={() => console.log('left button clicked')}
      >
          <Text style={{fontWeight: '600', fontFamily: 'sans-serif', color: '#d84315'}}>NA</Text>
      </TouchableOpacity>
  </SwipeButtonsContainer>
);

export default class OrderListScreen extends Component {    
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Orders",
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
      activeSections: [],
      checkboxes: [],
      payments:[],
      multipleSelect: true,
      listDataSource: null,
      showFilter: false,
      update: [],
      collapsed: true,
      checked: false,
      filterData: [
        {
          label: "All",
          color: "#90caf9"
        },
        {
          label: "New",
          color: "#90caf9"
        },
        {
          label: "Pending",
          color: "#90caf9"
        },

        {
          label: "Completed",
          color: "#90caf9"
        }
      ]
    };
  }

  componentDidMount() {
    console.log("componentDidMount");

    var shopid = "vichishop";
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
          this.setState({ listDataSource: result.data });
        })
        .catch(error => {
          console.error(error);
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
    }
  } 

  updateOrderDetails = (orderItem, status) =>{
    console.log('orderItem: '+JSON.stringify(orderItem))
    var orderUpdateData = null;
    if(status === 'packed' || status === 'ofd' || status === 'completed'){
      // update fileds: products, totalcost, deliverystatus, paymentstatus
      orderUpdateData = {
        orderid: orderItem.orderid,
        totalcost: orderItem.totalcost, 
        products: orderItem.products,
        status: status, 

      }

    }else{

      orderUpdateData = { 
        orderid: orderItem.orderid,
        totalcost: orderItem.totalcost,
        products: orderItem.products,
        status: status,

      }

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

  }

  toggleExpanded = id => {
    let activeSections = this.state.activeSections;

    if (activeSections && activeSections.includes(id)) {
      const index = activeSections.indexOf(id);
      activeSections.splice(index, 1);
    } else {
      activeSections = activeSections.concat(id);
    }

    this.setState({ activeSections });
    console.log(
      "MS check a4: " + activeSections && activeSections.includes(id)
    );
  };

  
/*
Logic for Delivery status update: check if below exit in checkboxes
1) orderid+Pending
2) orderid+ofd
3) orderid+Completed
if any of above exits for an order then it will be delivery status for that orderid
*/
  toggleCheckboxPacked = (item, id )=> {
    let checkboxes = this.state.checkboxes;

    if (checkboxes && checkboxes.includes(id)) { 
      const index = checkboxes.indexOf(id);
      checkboxes.splice(index, 1);
    } else {
      checkboxes = checkboxes.concat(id);
      this.updateOrderDetails(item, 'packed')
    }

    this.setState({ checkboxes });
    
    // console.log("MS check a4: " + checkboxes && checkboxes.includes(id));
  };

  toggleCheckboxCompleted= (item, id ) => {
    let checkboxes = this.state.checkboxes;

    if (checkboxes && checkboxes.includes(id)) {
      const index = checkboxes.indexOf(id);
      checkboxes.splice(index, 1);
    } else {
      checkboxes = checkboxes.concat(id);
      this.updateOrderDetails(item, 'completed')
    }

    this.setState({ checkboxes });
    // console.log("MS check a4: " + checkboxes && checkboxes.includes(id));
    
  };

  toggleCheckboxOFD = (item, id ) => {
    let checkboxes = this.state.checkboxes;

    if (checkboxes && checkboxes.includes(id)) {
      const index = checkboxes.indexOf(id);
      checkboxes.splice(index, 1);
    } else {
      checkboxes = checkboxes.concat(id);
      this.updateOrderDetails(item, 'ofd')
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

 toggleCheckboxReceived = (item, id) =>{

  let payments = this.state.payments;

    if (payments && payments.includes(id)) {
      const index = payments.indexOf(id); 
      payments.splice(index, 1);
    } else {
      payments = payments.concat(id);
      this.updateOrderDetails(item, 'received')
    }

    this.setState({ payments });
    // console.log("MS check a4: " + payments && payments.includes(id));
    
   
 }

 toggleCheckboxPending = (item, id) =>{

  let payments = this.state.payments;

    if (payments && payments.includes(id)) {
      const index = payments.indexOf(id);
      payments.splice(index, 1);
    } else {
      payments = payments.concat(id);
      this.updateOrderDetails(item, 'pending')
    }

    this.setState({ payments });
    // console.log("MS check a4: " + payments && payments.includes(id));
    
   
 }

 toggleCheckboxCredit = (item, id) =>{

  let payments = this.state.payments;

    if (payments && payments.includes(id)) {
      const index = payments.indexOf(id);
      payments.splice(index, 1);
    } else {
      payments = payments.concat(id);
      this.updateOrderDetails(item, 'credit')
    }

    this.setState({ payments });
    // console.log("MS check a4: " + payments && payments.includes(id));
    
   
 }
  itemNotAvailbale = (itemOjb, productRow) =>{
    //listDataSource
    var dummyListDataSource = [];
    var listDataSource = this.state.listDataSource;
    listDataSource.map(function (item) {
      //console.log('itemNotAvailbale itemOjb.orderid: '+JSON.stringify(itemOjb))
      if(itemOjb.orderid === item.orderid){
        var newCost = item.totalcost - (productRow.price * productRow.qty)
        if(newCost < 0){
          newCost = 0
        }
        item.totalcost = newCost;
        var productsRows = item.products;   
        var dummyProductRows = [];
        productsRows.map(function (product){
          if(product.productid === productRow.productid){
            product.available = 'NA'
          }
          dummyProductRows.push(product)
        })
        item.products = dummyProductRows
      }
      dummyListDataSource.push(item);
    });
    console.log('itemNotAvailbale dummyListDataSource: '+JSON.stringify(dummyListDataSource))
    this.setState({
      listDataSource: dummyListDataSource
    })
  }


  itemIsAvailbale = (itemOjb, productRow) =>{
    console.log('itemIsAvailbale move to origion')
    //listDataSource
    var dummyListDataSource = [];
    var listDataSource = this.state.listDataSource;
    listDataSource.map(function (item) {
      //console.log('itemNotAvailbale itemOjb.orderid: '+JSON.stringify(itemOjb))
      if(itemOjb.orderid === item.orderid){
        var newCost = parseFloat(item.totalcost) + (parseFloat(productRow.price) * parseFloat(productRow.qty)) 
        item.totalcost = newCost;
        var productsRows = item.products;
        var dummyProductRows = [];
        productsRows.map(function (product){
          if(product.productid === productRow.productid){
            product.available = 'yes'
          }
          dummyProductRows.push(product)
        })
        item.products = dummyProductRows
      } 
      dummyListDataSource.push(item);
    });
    console.log('itemIsAvailbale move to origion: '+JSON.stringify(dummyListDataSource))
    this.setState({
      listDataSource: dummyListDataSource
    })
  }

 
  

  ShowHideTextComponentView = () => {
    if (this.state.showFilter == true) {
      this.setState({ showFilter: false });
    } else {
      this.setState({ showFilter: true });
    }
  };

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.title ? item.title.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      text: text
    });
  }

  

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

  // update state
  onPress = filterData => this.setState({ filterData: filterData });

  render() {
    // const { multipleSelect, activeSections } = this.state;
    const activeSections = this.state.activeSections;
    const checkboxes = this.state.checkboxes;
    const payments = this.state.payments;

    let selectedButton = this.state.filterData.find(e => e.selected == true);
    selectedButton = selectedButton
      ? selectedButton.value
      : this.state.filterData[0].label;
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
          <Text style={{ alignItems: "center", color: "#fff" }}>
            New Order: 10 of Rs. 1000
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#fff" }}>Pending: 10 of Rs. 1500</Text>
            <Text style={{ marginLeft: 15, marginRight: 15, color: "#fff" }}>
              |
            </Text>
            <Text style={{ color: "#fff" }}>Completed: 10 of Rs. 2500</Text>
          </View>
        </View>
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
            <View style={{ flexDirection: "row" }}>
              <RadioGroup
                flexDirection="row"
                radioButtons={this.state.filterData}
                onPress={this.onPress}
              />
            </View>
          ) : null}
        </View>

        <FlatList
          data={this.state.listDataSource}
          renderItem={({ item, index }) => (
            <View style={styles.container}>
              {/*Code for Single Collapsible Start*/}
              <TouchableOpacity
                onPress={() => this.toggleExpanded(item.orderid)}
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
                    {/* <Text style={styles.headerText}>+</Text> */}
                    {/* <Text style={styles.headerText}>Rs.{item.totalcost}</Text> */}
                    <Text style={styles.headerText}>{item.totalcost} Rs</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
            onLeftButtonsShowed = {() => this.itemNotAvailbale(item, itemx)}
            // onMovedToOrigin = {() => this.itemIsAvailbale(item, itemx)}
            //onSwipeInitial = {() => this.itemNotAvailbale(item, itemx)} 
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

{itemx.available === 'NA'? <Text style={styles.strikeText}>
                          {key + 1}. {itemx.productname}
                        </Text>
                        : <Text style={styles.text}>
                          {key + 1}. {itemx.productname}   
                        </Text> }

                        {itemx.available === 'NA'? <Text style={styles.strikeText}>{itemx.qty}qty</Text> 
                        : <Text style={styles.text}>{itemx.qty}qty</Text>}
                        
                        {itemx.available === 'NA'? <Text style={styles.strikeText}>{itemx.weight}g</Text>:
                        <Text style={styles.text}>{itemx.weight}g</Text>}
                        
                        {itemx.available === 'NA'?<Text style={styles.strikeText}>{itemx.price}Rs</Text>: 
                        <Text style={styles.text}>{itemx.price}Rs</Text>} 

                      </View>
                    </SwipeItem> 
                  ))}







                  
                  <View style={{ flexDirection: 'row', justifyContent:'space-evenly'}}> 
                  <MaterialIcons
                        style={{ marginRight: 5, marginLeft:15, marginTop:15 }}
                        name="directions-bike"
                        size={20}
                      />
                  
                    <CheckBox
                      title="Packed"
                      center
                      size={20}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      onPress={() => this.toggleCheckboxPacked(item, item.orderid+'Packed')} 
                      checked={checkboxes && checkboxes.includes(item.orderid+'Packed')}
                      textStyle={{fontSize:10}}
                      containerStyle={{backgroundColor:'transparent', borderColor:'#fff'}}
                    />

                    <CheckBox
                      title="Out for Delivery"
                      center
                      size={20}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      onPress={() => this.toggleCheckboxOFD(item, item.orderid+'ofd')}
                      checked={checkboxes && checkboxes.includes(item.orderid+'ofd')}
                      textStyle={{fontSize:10}}
                      containerStyle={{backgroundColor:'transparent', borderColor:'#fff'}}
                    />

                    <CheckBox
                      title="Completed"
                      center
                      size={20}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      onPress={() => this.toggleCheckboxCompleted(item, item.orderid+'Completed')}
                      checked={checkboxes && checkboxes.includes(item.orderid+'Completed')}
                      textStyle={{fontSize:10}}
                      containerStyle={{backgroundColor:'transparent', borderColor:'#fff'}}
                    />
                  </View>
                  {/* <Text>-----------</Text> */} 

                  
                  <View style={{ flexDirection: 'row', justifyContent:'space-evenly'}}> 
                  <Text style={{marginTop:12, fontSize:18}}>{'\u20B9'}</Text>
                  
                    <CheckBox
                      title="Pending"
                      center
                      size={20}
                      
                      onPress={() => this.toggleCheckboxPending(item, item.orderid+'Pending')}
                      checked={payments && payments.includes(item.orderid+'Pending')}
                      textStyle={{fontSize:10}}
                      containerStyle={{backgroundColor:'transparent', borderColor:'#fff'}}
                    />

                    <CheckBox
                      title="Credit"
                      center
                      size={20}
                      
                      onPress={() => this.toggleCheckboxCredit(item, item.orderid+'Credit')}
                      checked={payments && payments.includes(item.orderid+'Credit')}
                      textStyle={{fontSize:10}}
                      containerStyle={{backgroundColor:'transparent', borderColor:'#fff'}}
                    />

                    <CheckBox
                      title="Received"
                      center
                      size={20}
                      
                      onPress={() => this.toggleCheckboxReceived(item, item.orderid+'Received')}
                      checked={payments && payments.includes(item.orderid+'Received')}
                      textStyle={{fontSize:10}}
                      containerStyle={{backgroundColor:'transparent', borderColor:'#fff'}}
                    />
                  </View>
                
                
                </View>
              </Collapsible>
              {/*Code for Single Collapsible Ends*/}
            </View>
          )}
          enableEmptySections={true}
          style={{ marginTop: 1 }}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={this.ListViewItemSeparator}
        />
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
    alignItems: 'flex-end',
    justifyContent: 'center',
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
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid',
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
    width: '99%',
    height: 40,
    alignSelf: 'center',
    marginVertical: 1,
},
swipeContentContainerStyle: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
    // borderRadius: 10,
    borderColor: '#e3e3e3',
    borderWidth: 1,
}
});


