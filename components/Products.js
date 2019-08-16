//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
// import  CounterAction from '../src/CounterAction';
// import QuantityInput from '../src/QuantityInput';
import NumericInput from "../numericInput/NumericInput";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

// create a component
class Products extends Component {
  constructor(props) {
    super(props);
    
    
  }

  pressedIncreaseProductCount = value => {
    console.log("guestlistgirlcount " + JSON.stringify(value));
    // this.setState({ guestlistgirlcount: value.guestlistgirlcount });
    // this.setState({itemQuntity: value})
    // this.forceUpdate();
    // this.props.updateQty(value)
    // this.props.increaseQty
    // this.props.updateQty( )
    this.props.parentMethod();
  };

  _renderProducts = products => {
    //console.log("Product:" + JSON.stringify(products));
    return (
      <View key={products.index} style={{ flex: 1, flexDirection: "row" }}>
        {/* <FontAwesome style={{ marginRight: 10 }} name="ticket" size={100} /> */}
        <Image
          resizeMode = "stretch"
          style = {{ flex: 1 , height:100, width:500}}
          source={{
                        uri: products.item.imageurl
                      }}
        />
        <View style={{ padding: 5 }}>
          <Text style={{ color: "#757575", fontWeight: "600", fontSize: 16 }}>
            {products.item.productname}
          </Text>
          <Text>{products.item.description}</Text>
          <View>
            <View style={{ flex: 1, paddingTop: 15, flexDirection: "row" }}>
              <Text>Rs.{products.item.price}</Text>
              <Text style={{ marginLeft: 25, marginRight: 25 }}>|</Text>
              <Text style={{ marginLeft: 0 }}>500 g</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginLeft: 110 }}>
              <NumericInput
                initValue={1}
                value={products}
                //onChange={this.props.increaseQty}
                onChange={this.props.parentMethod}
                totalWidth={150}
                totalHeight={35}
                minValue={1}
                maxValue={50}
                step={1}
                iconStyle={{ fontSize: 15, color: "#434A5E" }}
                inputStyle={{ fontSize: 18, color: "#ffffff" }}
                valueType="real"
                borderColor="#C7CBD6"
                rightButtonBackgroundColor="#C7CBD6"
                leftButtonBackgroundColor="#C7CBD6"
              />
              <TouchableOpacity
                onPress={() => this.props.onPress(products.item)}// this method call onPress of Grocery
                style={{
                  height: 30,
                  backgroundColor: "#ffc400",
                  //width:160,
                  //borderRadius:10,
                  //   margin: 10,

                  marginLeft: 10
                  //   marginRight:50,
                  // marginTop :20
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    marginLeft: 5,
                    marginRight: 5,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#4caf50",
                      marginRight: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      //   fontSize: 16,
                      fontWeight: "bold",
                      fontFamily: "sans-serif"
                    }}
                  >
                    ADD
                  </Text>
                  <Ionicons style={styles.icons} name="ios-basket" size={20} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // this will render shoping cart screen
  _renderCartProducts = products => {
    //console.log("Product:" + JSON.stringify(products));
    console.log('products.item.qty: '+ products.item.qty);
    if(products.item.qty === undefined){
      products.item.qty = 1
    }
    return (
      <View key={products.index} style={{ flex: 1, flexDirection: "row" }}>
      
        <Image
          resizeMode = "stretch"
          style = {{ flex: 1 , height:100, width:500}}
          source={{ uri: products.item.imageurl }}
        />
        <View style={{ padding: 5 }}>
          <Text style={{ color: "#424242", fontWeight: "600" }}>
            {products.item.productname}
          </Text>
          <Text>{products.item.description}</Text>
          <View>
            <View style={{ flex: 1, paddingTop: 15, flexDirection: "row" }}>
              <Text>Rs.{products.item.price}</Text>
              <Text style={{ marginLeft: 25, marginRight: 25 }}>|</Text>
              <Text style={{ marginLeft: 0 }}>500 g</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginLeft: 110 }}>
              <NumericInput
                initValue={products.item.qty}
                value={products}
                onChange={this.pressedIncreaseProductCount}
                totalWidth={150}
                totalHeight={35}
                minValue={1}
                maxValue={50}
                step={1}
                iconStyle={{ fontSize: 15, color: "#434A5E" }}
                inputStyle={{ fontSize: 18, color: "#ffffff" }}
                valueType="real"
                borderColor="#C7CBD6"
                rightButtonBackgroundColor="#C7CBD6"
                leftButtonBackgroundColor="#C7CBD6"
              />
              <TouchableOpacity
                onPress={() => this.props.onPress(products.item)}
                style={{
                  //height: 30,
                  //backgroundColor: "#ffc400",
                  //width:160,
                  //borderRadius:10,
                  //   margin: 10,

                  marginLeft: 10
                  //   marginRight:50,
                  // marginTop :20
                }}
              >
                <Entypo
                  style={{ color: "#ff1744" }}
                  name="squared-cross"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  ListViewItemSeparator = () => {
    //Item sparator view
    return (
      <View
        style={{
          height: 0.3,
          width: "99%",
          backgroundColor: "#000",
          borderBottomColor: "#d1d0d4",
          borderBottomWidth: 1
        }}
      />
    );
  };

  render() {
    console.log("fromScreen:" + this.props.fromScreen);
    if (this.props.fromScreen === "addToCart") {
      return (
        <View style={styles.container}>
        
          <FlatList
            data={this.props.products}
            renderItem={this._renderProducts}
            ItemSeparatorComponent={this.ListViewItemSeparator}
            enableEmptySections={true}
            style={{ marginTop: 2 }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.products}
            renderItem={this._renderCartProducts}
            ItemSeparatorComponent={this.ListViewItemSeparator}
            enableEmptySections={true}
            style={{ marginTop: 2 }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    }
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    // width: "100%",
    flex: 1,
    justifyContent: "space-between"
    // alignItems: "center"
    // backgroundColor: '#2c3e50',
  }
});

//make this component available to the app
export default Products;
