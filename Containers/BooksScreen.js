import React, { Component } from 'react';
import { View, Text , StyleSheet } from 'react-native';
import {books} from "../Data";
import Products from "../components/Products"
import {connect} from "react-redux";
 class BooksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <View style={styles.container} >
      <Products products={books} fromScreen='addToCart' onPress = {this.props.addItemToCart} />
      </View>
    );
  }
}


const mapDispatchToProps = (dispatch) =>{
  return{
    addItemToCart : (product) => dispatch({
      type:"ADD_TO_CART",
      payload:product
    }),
    // increaseCounter: ()=> dispatch({type:"ICREASE_COUNTER"}),
    // decreaseCounter: ()=> dispatch({type:"DECREASE_COUNTER"})
  }
}

export default connect(null , mapDispatchToProps)(BooksScreen);

const styles = StyleSheet.create({
    container:{
        flex:1,
        // alignItems:"center",
        justifyContent:"space-between"
    }
})

