import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity
} from "react-native";

import { withNavigation } from 'react-navigation'

import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

_goTOBasket = (props) =>{

    //console.log('_goTOBasket in ShoppingCartIcon props: '+JSON.stringify(props))
    const { navigation } = props;

    var customerMobile = navigation.getParam("customerMobile");
    //console.log('_goTOBasket in ShoppingCartIcon customerMobile: '+customerMobile)
    var customerName = navigation.getParam("customerName");
    //console.log('_goTOBasket in ShoppingCartIcon customerName: '+customerName)
    var deliveryaddress = navigation.getParam("deliveryaddress"); 
    // props.navigation.navigate('Cart')
    props.navigation.navigate('Cart',
    {
      customerMobile: customerMobile,
      customerName: customerName,
      deliveryaddress: deliveryaddress
    });
}

const ShoppingCartIcon = (props) => (
    
    // <TouchableOpacity  onPress={() => props.navigation.navigate('Grocery')} >
    <TouchableOpacity  onPress={() => _goTOBasket(props)} >
    <View style={[{ padding: 5 }, Platform.OS == 'android' ? styles.iconContainer : null]}>
        <View style={{
            position: 'absolute', height: 30, width: 30, borderRadius: 15, backgroundColor: 'rgba(95,197,123,0.8)', right: 15, bottom: 15, alignItems: 'center', justifyContent: 'center', zIndex: 2000,

        }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{props.cartItems.length }</Text>
        </View>
        <Icon name="ios-cart" size={30} />
    </View>
    </TouchableOpacity>

)

const mapStateToProps = (state) => {
    return {
        cartItems: state
    }
}

export default connect(mapStateToProps)(withNavigation(ShoppingCartIcon));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
        paddingLeft: 20, paddingTop: 10, marginRight: 5
    }
});