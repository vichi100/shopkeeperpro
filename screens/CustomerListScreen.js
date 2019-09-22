import React, { Component } from "react";
import * as Contacts from "expo-contacts";
import * as Permissions from "expo-permissions";

import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import axios from 'axios';
import { SERVER_URL } from "../Constants";

import RadioGroup from 'react-native-radio-buttons-group';

import Card from "./cards/Card";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";


import { FontAwesome } from "@expo/vector-icons";
import { AsyncStorage } from "react-native";

export default class CustomerListScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    //https://stackoverflow.com/questions/45596645/react-native-react-navigation-header-button-event
    const { params = {} } = navigation.state;
    return {
      title: "Customers",
      headerTitleStyle: {
        justifyContent: "center",
        color: "#757575",
        textAlign: "left",
        flex: 1
      },
        // headerStyle: {backgroundColor:'#3c3c3c'},
        headerRight: <Feather
        style={{ marginRight: 10, color: "#424242" }}
        name={"arrow-down-left"}
        size={25}
        onPress={() => params.openCreditOrderList()} 
      />
      
      
      };
};

openCreditOrderList = () =>{
  console.log('openCreditOrderList');
  this.props.navigation.navigate("CreditOrderList");
}

    // static navigationOptions = {
    //     //To set the header image and title for the current Screen
    //     title: 'Customers',
    //     headerBackTitle: null,
    //     headerStyle: {
    //       //backgroundColor: '#263238',
    //       //Background Color of Navigation Bar
    //     },
    //     headerTitleStyle: {
    //       justifyContent: 'center', 
    //       color:'#757575',
    //       textAlign:"left", 
    //         flex:1
    //   },
    //   headerTintColor: "#757575"
    //   }
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: true,
      text: "",
      contacts: [],
      arrayholder: [],
      dataSource: [],
      showFilter: false,
      checked: 'first',
      data: [
        {
            label: 'All',
            color: '#7cb342',
          },
        {
          label: 'Order',
          color: '#7cb342',
        },
        
        {
            label: 'Non Order',
            color: '#7cb342',
          },
      ],
    };
  }

  async componentDidMount() {
    this.props.navigation.setParams({ openCreditOrderList: this.openCreditOrderList });
    // Ask for permission to query contacts.
    const permission = await Permissions.askAsync(Permissions.CONTACTS);
    var contactDataArray = []

    if (permission.status !== "granted") {
      // Permission was denied...
      return;
    }
    const contacts = await Contacts.getContactsAsync({
      fields: [
        Contacts.PHONE_NUMBERS
        //Contacts.EMAILS,
      ],
      pageSize: 2000,
      pageOffset: 0
    });
    if (contacts.total > 0) {
      console.log('contacts size '+ contacts.total )
      var shopid = await AsyncStorage.getItem("shopid");
      for (let i = 0; i < contacts.total; i++) { 
        if (contacts.data[i] !== undefined && contacts.data[i].firstName) { 
          try {
            var name = contacts.data[i].firstName;
            var lastName = contacts.data[i].lastName;
            var mobile = contacts.data[i].phoneNumbers[0].number;
            // console.log(contacts.data[i].firstName +' '+ lastName)
            // console.log(contacts.data[i].phoneNumbers[0].number);
            var fullName = name;
            if (lastName !== undefined) { 
              fullName = name + " " + lastName;
            }

            const obj = { name: fullName, mobile: mobile,  shopid:shopid};
            // this.state.dataSource.push(obj); // Push the object
            contactDataArray.push(obj)
          } catch (e) {
            console.log("Error");
          }
        }
      }
      //console.log(this.state.arrayholder)      
      // write customer contacts to server 

      // this.setState({ arrayholder: this.state.dataSource, isLoading: false });
      this._sendCustomerDetailsToserver(contactDataArray)
    }
  }

  _sendCustomerDetailsToserver = (contactsData) =>{ 
    //console.log('contactsData: '+ JSON.stringify(contactsData))
    console.log('contactsData size: '+ contactsData.length)
    const requestBody = JSON.stringify(contactsData) 
    // console.log('contactsData size: '+ requestBody.length)
    
    console.log('registerShop')  
    axios({ 
      // Of course the url should be where your actual GraphQL server is.
      url: SERVER_URL+"/createCustomers", 
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json" 
      },  
      data: requestBody        
    }).then(result => { 
      // console.log("Resp Data: "+JSON.stringify(result.data));

      const customerContactDetailsData = result.data

      this.setState({ dataSource: customerContactDetailsData, arrayholder: customerContactDetailsData, isLoading: false });
      // this.props.navigation.navigate("MainTabNavigator", {
      //   shopmobile: "shopmobile"    
      // });               
    });              
  }                 
 


  // update state
  onPress = data => this.setState({ data:  data});


  // we get mobile number from customer phone and add them to shop customer list in background
  insertShopCustomersDetails=() =>{
    var postData = {
      "userid" : this.state.userid,
      "mobilenumber":this.state.mobile,
      "email" : this.state.email,
      "name" : this.state.name, 
      "expoToken": this.state.expoToken,
    }

    this._storeCustomerData();



    // SEND Customer DETAILS TO SERVER -  START
    // return fetch(SERVER_URL+"insertCustomerDetails",{  
    //   method: "POST",
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',   
    //   },
    //   body:  JSON.stringify(postData)
    // })
    return axios.post(SERVER_URL+"insertCustomerDetails", postData,  {

      headers: {
        'Content-Type': 'application/json',
    },
    })
   // .then(response => response.json()) 
    .then(response => {
    console.log("data : " + response.data); 
      this.setState({ dataSource: response.data, isLoading: false });
      
    console.log("data send to server");
    }) 
    .catch(error => {
      console.error(error); 
    }); 
    // SEND Customer DETAILS TO SERVER FINSH -END

  }


  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.state.arrayholder.filter(function(item) {
      const query = text.toLowerCase();
      return (
        item.customernamebyshop.toLowerCase().indexOf(query) >= 0 ||
        item.customermobile.toLowerCase().indexOf(query) >= 0
      );
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
          width: "90%",
          backgroundColor: "#080808"
        }}
      />
    );
  };

  renderItem = ({ item }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View>
        <TouchableOpacity onPress={() => this._getCustomerOrdersDetails(item)}>
          <Card containerStyle={{ padding: 10 }}>
            <View
              style={{ flexDirection: "row", marginLeft: 5, marginRight: 10, marginTop:5 }}
            >
              { item.isRegisteredByCustomer === 'no' ? 
              <MaterialCommunityIcons
                style={styles.iconPersone} 
                name="account-box-outline"
                size={20}
              />: 
              <MaterialCommunityIcons
              style={styles.iconPersone}
              name="account-check-outline"
              size={20}
            />}
              <Text
                style={{
                  fontSize: 14,
                  color: "#000",
                  fontWeight: "bold",
                  fontFamily: "sans-serif"
                }}
              >
                {item.customernamebyshop}
              </Text>
            </View>
            {/* <Text>{item.name}</Text> */}

            <View
              style={{ flexDirection: "row", marginLeft: 40, marginRight: 10 }}
            >
              <MaterialIcons style={styles.iconMobile} name="phone" size={20} />
              <Text style={{ fontSize: 14, color: "#000" }}>{item.customermobile}</Text>
            </View>

            {/* <Text>{item.mobile}</Text> */}
          </Card>
        </TouchableOpacity>
      </View>
    );
  };

  _getCustomerOrdersDetails = item => {
    console.log("customer name: " + JSON.stringify(item));
    var customerMobile = item.customermobile;
    if(customerMobile !== null || customerMobile !== undefined){
      customerMobile = customerMobile.replace(/\s/g, "");
    }

    fetch(SERVER_URL + "/customerDetails", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        customerid: customerMobile
         
      })
    })
      .then(res => res.json())
      .then(res => {
        // console.log("customer data returned:", JSON.stringify(res))
        //const customerdeliveryaddress = res.customeraddresslineone+ ;

        // console.log("deliveryaddress: ", deliveryaddress);
        this.props.navigation.navigate("CustomerOrdersDetails", {
          customerMobile: item.customermobile,  
          customerName: item.customernamebyshop, 
          customerDetails: item,
          //deliveryaddress: deliveryaddress
        });
       
        
      }); 
   
  };

  ShowHideTextComponentView = () =>{
 
    if(this.state.showFilter == true)
    {
      this.setState({showFilter: false})
    }
    else
    {
      this.setState({showFilter: true})
    }
  }

  _keyExtractor = (item, index) => index.toString();

  render() {
      const { checked } = this.state.checked; 
      let selectedButton = this.state.data.find(e => e.selected == true);
    selectedButton = selectedButton ? selectedButton.value : this.state.data[0].label;
    if (this.state.isLoading) {
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
    return (
      //ListView to show with textinput used as search bar
      <View style={styles.viewStyle}>
        

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
            <Text style={{ color: "#fff" }}>Orders: 10000</Text>
            <Text style={{ marginLeft: 15, marginRight: 15, color: "#fff" }}>
              |
            </Text>
            <Text style={{ color: "#fff" }}>Amount: Rs.50000000</Text>
          </View>
        </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', margin:10}}>
        <MaterialIcons style={{marginLeft:10, marginTop:7}} name="search" size={20} />
        <TextInput
          style={{marginRight:15, marginLeft:10}}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
        <TouchableOpacity onPress={() => this.ShowHideTextComponentView()}>
            <MaterialIcons style={{marginRight:10, marginTop:7}} name="filter-list" size={20} />
        </TouchableOpacity>
        </View>
        {/* THIS FILTER COMPONANT WILL HIDE ANS SHOW */}
        <View style = {{flexDirection:'row', justifyContent:'center', backgroundColor:'#fafafa'}}>
        {this.state.showFilter ? 
            <View style={{flexDirection: 'row'}}>
            <RadioGroup  flexDirection='row' radioButtons={this.state.data} onPress={this.onPress} />
      </View> : null}
        </View>
        <FlatList
          data={this.state.dataSource}
          renderItem={this.renderItem}
          enableEmptySections={true}
          style={{ marginTop: 1 }} 
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    //justifyContent: 'center',
    backgroundColor: "#ffffff", //'#ecf0f1',
    flex: 1
    //marginTop: 10,
    // paddingLeft: 16,
    // paddingRight: 16,
  },
  totalAmountStyle: {
    justifyContent: "space-between",
    flexDirection: "row",
    //flex: 1,

    marginTop: 10
    //padding: 16,
  },
  textStyle: {
    padding: 10
  },
  iconPersone: {
    width: 30,
    height: 30,
    color: "#0091ea",
    marginRight:10,
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
  textInputStyle: {
    height: 40,
    marginTop: 15,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: "#009688",
    backgroundColor: "#FFFFFF"
  }
});


