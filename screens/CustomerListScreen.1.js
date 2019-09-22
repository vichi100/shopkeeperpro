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
import {AsyncStorage} from 'react-native';


import { FontAwesome } from "@expo/vector-icons";

export default class CustomerListScreen extends Component {

    static navigationOptions = {
        //To set the header image and title for the current Screen
        title: 'Customers',
        headerBackTitle: null,
        headerStyle: {
          //backgroundColor: '#263238',
          //Background Color of Navigation Bar
        },
        headerTitleStyle: {
          justifyContent: 'center', 
          color:'#757575',
          textAlign:"left", 
            flex:1
      },
      headerTintColor: "#757575"
      }
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: true,
      text: "",
      contacts: [],
      arrayholder: [],
      dataSource: [], /// this value we will get from server fetching from mongodb
      customerContatDataToInsert:[],
      customerContatDataToUpdate:[],
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
    // Ask for permission to query contacts.
    const permission = await Permissions.askAsync(Permissions.CONTACTS);
    var contactMap = new Map(); 

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
      // console.log('contacts size '+ contacts.data )
      var CustomerDetailsMap = await AsyncStorage.getItem('CustomerDetailsMap');

      for (let i = 0; i < 10; i++) { 
        if (contacts.data[i] !== undefined && contacts.data[i].firstName) { 
          try {
            var name = contacts.data[i].firstName;
            var lastName = contacts.data[i].lastName;
            var mobile = contacts.data[i].phoneNumbers[0].number;
            // console.log(contacts.data[i].firstName +' '+ lastName)
            // console.log(contacts.data[i].phoneNumbers[0].number);
            console.log('contacts data: '+JSON.stringify(contacts.data[i]))    
            var fullName = name;
            if (lastName !== undefined) { 
              fullName = name + " " + lastName;
            }

            if(CustomerDetailsMap === null){
              contactMap.set(mobile, name)
              const obj = {  name: fullName, mobile: mobile,  };
              this.state.customerContatDataToInsert.push(obj); // Push the object
              console.log('name: '+JSON.stringify(this.state.dataSource))
            }else{
              // one cud be for update name while other cud be for new insert.
              if(CustomerDetailsMap.has(mobile) && CustomerDetailsMap[mobile] !== fullName){
                const obj = {  name: fullName, mobile: mobile,  };
                this.state.customerContatDataToUpdate.push(obj); // Push the object
              }else if(!CustomerDetailsMap.has(mobile)){
                const obj = {  name: fullName, mobile: mobile};
                this.state.customerContatDataToInsert.push(obj); // Push the object
              }
            }
          } catch (e) {
            console.log("Error");
          }
        }
      }
      
      for(const item of contactMap){
        console.log('map item: '+item); 
      }


      this.setState({ arrayholder: this.state.dataSource, isLoading: false });
      await AsyncStorage.setItem('CustomerDetailsMap', contactMap);
      this._sendCustomerDetailsToserver()
    }
  }

  _sendCustomerDetailsToserver = () =>{ 
    
    const requestBody = JSON.stringify({
      customerContactDataToUpdate: this.state.customerContactDataToUpdate,
      customerContactDataToInsert: this.state.customerContactDataToInsert
    }) 
    console.log('contactsData size: '+ requestBody.length)
    // const requestBody = { 
    //   query: `
    //         mutation{  
    //           createManyCustomers(customerInput: {customerData: "${name}"})
    //         }
    //         `
    // };
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
      console.log("Resp Data: "+JSON.stringify(result.data));
      this.props.navigation.navigate("MainTabNavigator", {
        shopmobile: "shopmobile"   
      });               
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
        item.name.toLowerCase().indexOf(query) >= 0 ||
        item.mobile.toLowerCase().indexOf(query) >= 0
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
              style={{ flexDirection: "row", marginLeft: 10, marginRight: 10, marginTop:5 }}
            >
              <MaterialCommunityIcons
                style={styles.iconPersone}
                name="account-box-outline"
                size={20}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: "#000",
                  fontWeight: "bold",
                  fontFamily: "sans-serif"
                }}
              >
                {item.name}
              </Text>
            </View>
            {/* <Text>{item.name}</Text> */}

            <View
              style={{ flexDirection: "row", marginLeft: 40, marginRight: 10 }}
            >
              <MaterialIcons style={styles.iconMobile} name="phone" size={20} />
              <Text style={{ fontSize: 14, color: "#000" }}>{item.mobile}</Text>
            </View>

            {/* <Text>{item.mobile}</Text> */}
          </Card>
        </TouchableOpacity>
      </View>
    );
  };

  _getCustomerOrdersDetails = item => {
    console.log("customer name: " + JSON.stringify(item));
    var customerMobile = item.mobile;
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
        // console.log("data returned:", JSON.stringify(res))
        const deliveryaddress = res.deliveryaddress;

        console.log("deliveryaddress: ", deliveryaddress);
        this.props.navigation.navigate("CustomerOrdersDetails", {
          customerMobile: item.mobile,  
          customerName: item.name, 
          customerDetails: item,
          deliveryaddress: deliveryaddress
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
  textInputStyle: {
    height: 40,
    marginTop: 15,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: "#009688",
    backgroundColor: "#FFFFFF"
  }
});


