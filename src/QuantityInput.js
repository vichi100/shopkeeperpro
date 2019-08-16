import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';



class QuantityInput extends React.Component {
    
    userProductQty = Array.apply(null, Array(this.props.item.length)).map(Number.prototype.valueOf, 1);
    itemPosition = -1;
  
    constructor(props) {
      super(props);
      this.state = {
        viewAddToCart: this.props.viewAddToCart,
        item: this.props.item,
        style: { flex: 1 },
        styleTextInput: { backgroundColor: '#ffffff' },
        styleButton: { backgroundColor: '#000000' },
        styleImage: { width: 12, height: 12 },
        editable: true,
        stepsize: 1,
        initialValue: 1,
        min: 1,
        max: 100
      }
    }
    upBtnPressed = (dataSource, fieldName) => {
      if (dataSource.userQty < this.state.max) {
        let value = (parseInt(dataSource.userQty) + parseInt(this.state.stepsize)).toString();
        dataSource.userQty = value;
        this.setState({
          item: dataSource
        });
      }
    }
  
    downBtnPressed = (dataSource, fieldName, props) => {
      if (dataSource.userQty < this.state.min) {
        let value = (parseInt(dataSource.userQty) - parseInt(this.state.stepsize)).toString();
        dataSource.userQty = value;
        this.setState({
          item: dataSource
        });
      }
    }
  
    onChangeText = (text, item, fieldName, itemPosition) => {
      if (!isNaN(text)) {
        item.userQty = text.toString();
        this.setState({
          item: item
        });
      } else {
        item.userQty = 0;
        this.setState({
          item: item
        });
      }
    }
  
    render() {
      return (
        this.state.viewAddToCart ?
          /* Add to cart */
          <View style={[{ flexDirection: 'row' }]}>
            <Left style={{ flex: 0 }}>
              <Button rounded danger
                title="Add"
                color="white"
                style={[{ width: 70 }, { height: 30 }, { justifyContent: 'center' }]}
                onPress={() => { this.props.onAddToCart(this.state.item); this.setState({ viewAddToCart: false }) }}
              >
                <Text style={[{ color: 'white' }]}>{string.addToCart}</Text>
              </Button>
              {/*</TouchableOpacity>*/}
            </Left>
          </View>
          :
          /* Quantity Text */
          <View style={{ flexDirection: 'row' }}>
            <View style={stylesQuantityText.verticle}>
              <TouchableOpacity style={[styles.button, styles.transparentBkg, { backgroundColor: '#d9534f' }, { paddingLeft: 10 }, { borderTopLeftRadius: 5 }, { borderBottomLeftRadius: 5 }, { justifyContent: 'center' }, { alignItems: 'center' }]} onPress={() => { this.downBtnPressed(this.state.item, this.state.item.productId); }} >
                <Text style={[{ width: 20 }, { height: 26 }, { fontSize: 21 }, { alignSelf: 'center' }, { paddingBottom: 10 }, { fontWeight: 'bold' }]}>-</Text>
                {/*<Icon name={"remove"} />*/}
              </TouchableOpacity>
              <TextInput
                style={[stylesQuantityText.textinput, this.state.styleTextInput]}
                editable={this.state.editable}
                keyboardType={'numeric'}
                text={this.state.item.userQty.toString()}
                value={this.state.item.userQty.toString()}
                ref={"Qty" + this.state.item.productId}
                key={"Qty" + this.state.item.productId}
                onChangeText={(text) => { this.onChangeText(text, this.state.item, this.state.item.productId); this.props.onAddToCart(this.state.item); }} />
  
              <TouchableOpacity style={[styles.button, styles.transparentBkg, { backgroundColor: '#d9534f' }, { paddingLeft: 10 }, { borderTopRightRadius: 5 }, { borderBottomRightRadius: 5 }]} onPress={() => { this.upBtnPressed(this.state.item, this.state.item.productId); this.props.onAddToCart(this.props.item); }}>
                {/*<Icon name={"add"}
                  size={27} />*/}
                <Text style={[{ width: 20 }, { height: 26 }, { fontSize: 19 }, { alignSelf: 'center' }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
  
      );
    }
  }
  
  const stylesQuantityText = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: '#eeeeee'
    },
    verticle: {
      flexDirection: 'row',
      paddingLeft: 0,
      paddingRight: 0,
  
    },
    horizontal: {
      flexDirection: 'row'
    },
    textinput: {
      backgroundColor: '#eeeeee',
      textAlign: 'center',
      width: 30,
      borderColor: 'black',
      borderWidth: 1,
      height: 26
    },
    button: {
      backgroundColor: '#dedede',
      padding: 5
    },
    image: {
      width: 18,
      height: 18
    },
    buttonText: {
      alignSelf: 'center'
    }
  
  });