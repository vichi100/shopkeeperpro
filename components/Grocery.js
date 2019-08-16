import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { books } from "../Data";
import Products from "./Products";
import { connect } from "react-redux";
import MaterialIcons from "@expo/vector-icons";
import { SERVER_URL } from "../Constants";

const window = Dimensions.get("window");

let w = window.Width;

class Grocery extends Component {
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

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      arrayholder: [],
      dataSource: []
    };
  }

  componentDidMount() {
    fetch(SERVER_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        query:
          "{ products{productid  productname brand category description weight  price searchtags  imageurl } }"
      })
    })
      .then(res => res.json())
      .then(res => {
        // console.log("data returned:", JSON.stringify(res))
        // console.log("data returned:", data.Object);
        this.setState({
          dataSource: res.data.products,
          arrayholder: res.data.products,
          isLoading: false
        });
      });
  }

  // componentDidMount() {
  //   this.setState({
  //       dataSource: books,
  //       arrayholder: books,
  //       isLoading: false
  //   });
  // }

  _goTOBasket = (props, customerMobile, customerName, deliveryaddress) => {
    //console.log('_goTOBasket in grocery customerMobile: '+customerMobile)
    props.navigation.navigate("Cart", {
      customerMobile: customerMobile,
      customerName: customerName,
      deliveryaddress: deliveryaddress
    });
  };

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.state.arrayholder.filter(function(item) {
      console.log("item: " + JSON.stringify(item));
      const query = text.toLowerCase();
      return (
        item.productname.toLowerCase().indexOf(query) >= 0
        // item.name.toLowerCase().indexOf(query) >= 0 ||
        // item.price.toLowerCase().indexOf(query) >= 0
      );
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      text: text
    });
  }

  render() {
    const { navigation } = this.props;

    var customerMobile = navigation.getParam("customerMobile");
    // console.log('in grocery customerMobile: '+customerMobile)
    var customerName = navigation.getParam("customerName");
    // console.log('in grocery customerName: '+customerName)
    var deliveryaddress = navigation.getParam("deliveryaddress");
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: 10,
            borderColor: "#e0e0e0",
            borderWidth: 1
          }}
        >
          {/* <MaterialIcons style={{marginLeft:10, marginTop:7}} name="search" size={20} /> */}
          <TextInput
            style={{ marginRight: 15, marginLeft: 10, alignItems: "center" }}
            onChangeText={text => this.SearchFilterFunction(text)}
            value={this.state.text}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />
          {/* <TouchableOpacity onPress={() => this.ShowHideTextComponentView()}>
            <MaterialIcons style={{marginRight:10, marginTop:7}} name="filter-list" size={20} />
        </TouchableOpacity> */}
        </View>
        <Products
          products={this.state.dataSource}
          fromScreen="addToCart"
          onPress={this.props.addItemToCart}
        />

        <TouchableOpacity
          onPress={() =>
            this._goTOBasket(
              props,
              customerMobile,
              customerName,
              deliveryaddress
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
            <Text style={{ color: "#ffffff" }}>GO TO BASKET</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addItemToCart: product =>
      dispatch(
        
        {
        type: "ADD_TO_CART",
        payload: product
      })
    // increaseCounter: ()=> dispatch({type:"ICREASE_COUNTER"}),
    // decreaseCounter: ()=> dispatch({type:"DECREASE_COUNTER"})
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Grocery);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems:"center",
    justifyContent: "space-between"
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
