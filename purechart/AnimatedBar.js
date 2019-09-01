import React, { Component } from "react";
import { Animated, Text, StyleSheet, View, Dimensions } from "react-native";
import randomcolor from "randomcolor";

const window = Dimensions.get("window");
const {width, height} = Dimensions.get('window');

//https://medium.com/@wwayne_me/let-s-drawing-charts-in-react-native-without-any-library-4c20ba38d8ab
//https://hackernoon.com/playing-with-react-native-animations-d065e7e97391#.4i8vtnhhw

class AnimatedBar extends Component {
  constructor(props) {
    super(props);

    this._width = new Animated.Value(100);
    console.log("Animated.Value: " + Animated.Value);
    

    this.state = {
      color: randomcolor(),
      
    };

    

  }

  componentDidMount() {
    console.log("this.props.value: " + JSON.stringify(this.props.value));
    // console.log('this.props.delay: '+this.props.delay)
    this.animateTo(this.props.delay, this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    this.animateTo(nextProps.delay, nextProps.value);
  }

  animateTo = (delay, value) => {
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(this._width, {
        toValue: (value.totalAmount / 100000) * window.width
        // toValue: {x: height / 2},

      })
    ]).start();
  };

  render() {
    const barStyles = {
      backgroundColor: this.state.color,
      height: 5,
      width: this._width,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      marginRight: 2,
      marginBottom:5 
    };

    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
      <Text style={{ fontFamily: "sans-serif", numberOfLines: 1, color: '#616161', fontSize:12, fontWeight:'300'}}> 
            {this.props.value._id.customername}-{this.props.value.totalAmount}
          </Text>
        <Animated.View style={barStyles}>
          
        </Animated.View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textS: {
    marginLeft: 2
    // fontFamily: 'sans-serif', fontWeight:'500', numberOfLines:1
  }
});

export default AnimatedBar;
