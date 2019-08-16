import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity } from 'react-native';
import {connect} from "react-redux";
 class CounterApp extends React.Component {

  render() {
    return (
      <View style={styles.container}>
      <View style={{flexDirection:"row" , width:200 , justifyContent:"space-around"  }} >
      <TouchableOpacity onPress={() => this.props.increaseCounter()} >
        <Text style={{fontSize:14, fontFamily: "sans-serif",}} >Increase</Text>
      </TouchableOpacity>
      <Text style={{fontSize:14, fontFamily: "sans-serif",}} >{this.props.counter}</Text>
      <TouchableOpacity onPress={() =>this.props.decreaseCounter()} >
        <Text style={{fontSize:14, fontFamily: "sans-serif",}} >Decrease</Text>
      </TouchableOpacity>
      </View>
      </View>
    );
  }
}

const mapStateToProps = (state) =>{
  return {
    counter:state.counter
  } 
}
const mapDispatchToProps = (dispatch) =>{
  return{
    increaseCounter:()=> dispatch({type:"ICREASE_COUNTER"}),
    decreaseCounter:()=> dispatch({type:"DECREASE_COUNTER"})
  }
}
export default  connect(mapStateToProps ,mapDispatchToProps )(CounterApp)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
