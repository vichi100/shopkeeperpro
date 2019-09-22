import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';


import { Platform } from 'react-native';


import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import OrderListScreen from '../screens/OrderListScreen';
import LoadOrderListScreen from "../screens/LoadOrderListScreen";
import CreateOrder from '../screens/CreateOrder';

import { Fontisto } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import CustomerOrdersDetails from '../screens/CustomerOrdersDetails';
import ShoppingCartIcon from "../Containers/ShoppingCartIcon";
import Grocery from '../components/Grocery';
import CartScreen from '../Containers/CartScreen';
import LoginScreen from '../screens/login/login';
import ShopRegistration from '../screens/login/ShopRegistration';
import OTPScreen from '../screens/login/OTPScreen';
import AddCustomerAddress  from '../screens/AddCustomerAddress';
import Profile from '../screens/profile';
import SalesChart from '../purechart/SalesChart';
import HelpScreen from '../screens/HelpScreen';
import ShopRegistrationWaring from '../screens/login/ShopRegistrationWaring';
import UpdateLogin from '../screens/login/updateLogin';
import UpdateOTPScreen from '../screens/login/UpdateOTPScreen';
import UpdateShopRegistration from '../screens/login/UpdateShopRegistration';
import CreditOrderList from '../screens/CreditOrderList';  
import Icon from '@expo/vector-icons/FontAwesome';


// export default createAppContainer(
//   createSwitchNavigator({
//     // You could add another route here for authentication.
//     // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//     Main: MainTabNavigator,
//   })
// );



const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home:  OrderListScreen, //LoadOrderListScreen, //OrderListScreen, // Profile, //HelpScreen,// CreditOrderList
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `md-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
  
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: CustomerListScreen,
  },
  config
);

LinksStack.navigationOptions = {   
  tabBarLabel: 'Customers',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'md-people' : 'md-people'} />
  ),
};

LinksStack.path = '';



const chartStack = createStackNavigator(
  {
    Links: SalesChart,
  },
  config
);

chartStack.navigationOptions = {   
  tabBarLabel: 'Charts',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'md-stats' : 'md-stats'} />
  ),
};

chartStack.path = '';


const SettingsStack = createStackNavigator( 
  {
    Profile: Profile,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Me',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'md-finger-print' : 'md-finger-print'} />
  ),
};

const CreditOrderStack = createStackNavigator( 
  {
    CreditOrderList: CreditOrderList,
  },
  config
);

CreditOrderStack.navigationOptions = {
  tabBarLabel: 'Credit',
  tabBarIcon: ({focused}) => (
    <Feather
        focused={focused}
        name="arrow-down-left"
        // color={tintColor}
        size={24}
    />
  ),
};
CreditOrderStack.path = '';




const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  // CreditOrderStack,
  chartStack,
  SettingsStack,
});


//////////


const AppStack = createStackNavigator({
  MainTabNavigator: {
    screen: tabNavigator,
    headerMode: 'none',
    headerBackTitle: null,
    headerLeft: null,
    
    navigationOptions: {
      header: null  
    }
  },
  LoginScreen:{
    screen: LoginScreen,
    navigationOptions: {
      headerRight: null
    }
  },
  ShopRegistration: {
    screen: ShopRegistration,
    navigationOptions: {
      headerRight: null
    }
  },
  OTPScreen:  { 
    screen: OTPScreen,
    navigationOptions: {
      headerRight: null
    }
  },
  CustomerOrdersDetails: CustomerOrdersDetails,
  CreateOrder: CreateOrder,
  Grocery: Grocery,
  Cart: CartScreen,
  ShoppingCartIcon:ShoppingCartIcon,
  AddCustomerAddress: { 
    screen: AddCustomerAddress,
    navigationOptions: {
      headerRight: null
    }
  },
  Profile:Profile,
  HelpScreen:{
    screen: HelpScreen,
    navigationOptions: {
      headerRight: null
    }
  },
  LoadOrderListScreen:{
    screen: LoadOrderListScreen,
    navigationOptions: {
      headerRight: null
    }
  },
  ShopRegistrationWaring:{
    screen: ShopRegistrationWaring,
    navigationOptions: {
      headerRight: null
    }

  },
  UpdateLogin:{
    screen: UpdateLogin,
    navigationOptions: {
      headerRight: null
    }

  },

  UpdateOTPScreen:{
    screen: UpdateOTPScreen,
    navigationOptions: {
      headerRight: null
    }

  },

  UpdateShopRegistration:{
    screen: UpdateShopRegistration,
    navigationOptions: {
      headerRight: null
    }

  },

  CreditOrderList: {
    screen: CreditOrderList,
    navigationOptions: {
      headerRight: null
    }

  },
  
},

{
  defaultNavigationOptions:{
      // headerTitle:"Shopping App",
      headerRight:(
          <ShoppingCartIcon/>
      )
  }
}

);

export default createAppContainer( 
  createSwitchNavigator(
    {
      //AuthLoading: MainTabNavigator,
      App: AppStack
      //Auth: AuthStack,
    },
    {
      //initialRouteName: 'AuthLoading',
      initialRouteName: "App",
      headerMode: "none"
    }
  )
);

