import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Navigator,
  Platform,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import Collapsible from "react-native-collapsible";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";


const width = Dimensions.get('window').width;

export default class HelpScreen extends Component {
  static navigationOptions = {
    //To set the header image and title for the current Screen
    title: "Help?",
    headerBackTitle: null,
    headerStyle: {
      //backgroundColor: "#263238"
      //Background Color of Navigation Bar
    },
    headerTitleStyle: {
      justifyContent: "center",
      color: "#757575",
      textAlign: "left",
      flex: 1
    }
  };
  constructor() {
    super();
    this.state = {
      isLoading: true,
      activeSections: [],
      dataSource: []
    };
  }
  componentDidMount() {
    this.setState({
      dataSource: helpData
    });
  }

  toggleExpanded = id => {
    let activeSections = this.state.activeSections;

    if (activeSections && activeSections.includes(id)) {
      const index = activeSections.indexOf(id);
      activeSections.splice(index, 1);
    } else {
      activeSections = activeSections.concat(id);
    }

    this.setState({ activeSections });
    // console.log("hi");
  };

  ListViewItemSeparator = () => {
    //Item sparator view
    return (
      <View
        style={{
          height: 0.3,
          width: "99%",
          backgroundColor: "#ffff",
          borderBottomColor: "#fff",
          borderBottomWidth: 1
        }}
      />
    );
  };

  render() {
    const activeSections = this.state.activeSections;
    return (
      <View>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item, index }) => (
            <View>
              <TouchableOpacity
                onPress={() => this.toggleExpanded(item.helpid)}
              >
                <View
                  style={{
                    backgroundColor: "rgba(29, 231, 245, 0.1)	",
                    padding: 16
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <Text style={styles.headerText}>{item.title}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <Collapsible
                collapsed={
                  !(activeSections && activeSections.includes(item.helpid))
                }
                align="center"
                expandMultiple={false}
              >
                <View
                  style={{
                    height: this.state.layoutHeight,
                    overflow: "hidden"
                  }}
                >
                  {item.steps.map((itemx, key) => (
                    <View
                      style={{
                        // flexDirection: "row",
                        // flex: 1,
                        backgroundColor: "#fafafa", 
                        marginBottom: 1
                      }}
                    >
                      
                      {item.title === 'What is emoji meaning?'?
                      <View style={{flexDirection:'row', margin:10}}>
                      {itemx.imgurl}
                      
                      <Text style={{marginLeft:10, marginRight:10, marginBottom:7, marginTop5:7,}}>{itemx.step}</Text>
                      
                      </View>
                      : 
                      <View>
                      <Text style={{marginLeft:10, marginRight:10, marginBottom:7, marginTop5:7,}}>{itemx.step}</Text>
                      <Image 
                    //   width={Dimensions.get('window').width} 
                      source={itemx.imgurl}   
                      style={styles.helpImage} 
                      resizeMode='contain'
                      />
                      </View>}
                    </View>
                  ))}
                </View>
              </Collapsible>
            </View>
          )}
          enableEmptySections={true}
          extraData={this.state}
          style={{ marginTop: 1 }}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={this.ListViewItemSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 1
      //backgroundColor: "#F5FCFF"
    },
    headerText: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: "sans-serif"
      },

    helpImage:{
        height: 290, 
        width: width ,
        // overflow: 'visible',
        backgroundColor:'#ffffff',
        // aspectRatio: 3/2 

    }
})

//1075 × 799

const helpData = [
  {
    helpid: "help001",
    title: "How to create new order?",
    steps: [
      {
        step:"1. Touch on customer which is at bottom",
        imgurl: require('../assets/images/customers.png'),
    },
    {
        step: "2. Now Customers list screen will open, touch on customer name for which you want to create order.",
        imgurl: require('../assets/images/customerlist.png'),
    },
    {
        step:'3. Now Customer details screen will open, touch on button "CREATE NEW ORDER" to create order.',
        imgurl: require('../assets/images/createorder.png'),
    },
    {
        step:'4. Now add item from list to bucket by touching "ADD" button. You can also search items by typing in "Search Here" place in search box at top.',
        imgurl: require('../assets/images/productlist.png'),
    },
    {
        step: "5. When finished adding items to bucket, touch bucket icon at top right hand corner.",
        imgurl: require('../assets/images/carticon.png'),
        
    },
    {
        step:'6. Now order basket will open, touch on "SHARE ORDER WITH CUSTOMER" button at bottom of screen.',
        imgurl: require('../assets/images/shopingcart.png'),

    }    
    ],
    
  },
  {
    helpid: "help002",
    title: "How to cancel one item from order?",
    steps: [
        {
            step:'1. Touch on item and move finger at right side until "NA" appears, then move your finger from it.',
            imgurl: require('../assets/images/item.png'),
        },
        {
            step: "2. Now you will see that item has been crossed by a line.",
            imgurl: require('../assets/images/itemnotavailable.png'),
        },
        {
            step: "3. If you want to add this item again in order then put your finger on item and move to left, then move your finger from it.",
            imgurl: require('../assets/images/itemnotavailableX.png'),
        },
        {
            step: "4. Now you will see that cross line has been disappeared.",
            imgurl: require('../assets/images/itemavailable.png'),
        }
      
      
      
    ],
    
  },
  {
    helpid: "help003",
    title: "How to cancel the complete order?",
    steps: [
        {
            step: "1. Put your finger on the order which you want to cancel for 5 sec.",
            imgurl: require('../assets/images/cancelorder1.png'),
        },
        {
            step:'2. A popup will appear, touch on "YES" if you want to cancel the order.',
            imgurl: require('../assets/images/cancelorder2.png'),
        },
        {
          step:'2. After canceling order it will look like below.',
          imgurl: require('../assets/images/cancelorder3.png'), 
      }
      
      
    ],
  },
  {
    helpid: "help004",
    title: "What is emoji meaning?",
    steps: [
        {
            step:' The "Bird" is for new order.',
            imgurl: <SimpleLineIcons
            style={{ color: "#2979ff" , transform: [{ rotate: '360deg'}]}}
            name="social-twitter"
            
            size={20}
          />,
        },
        {
            step:' The "Box" is for order is packed.',
            imgurl: <MaterialCommunityIcons
            style={{ color: "#2979ff" }}
            name="package-variant"
            size={20}
          />,
        },
        {
            step:' The "Bicycle" is for order is out for delivery.',
            imgurl:  <MaterialIcons
            style={{ color: "#2979ff" }}
            name="directions-bike"
            size={20}
          />,
        },
        {
            step: ' The "Single Right" is for order is delivered.',
            imgurl: <MaterialCommunityIcons
            style={{ color: "#2979ff" }}
            name="check"
            size={20}
          />,
        },
        {
            step: ' The "Double Right" is for order is delivered and payment is received.',
            imgurl: <MaterialCommunityIcons
            style={{ color: "#2979ff" }}
            name="check-all"
            size={20}
          />,
        },
        {
            step:' The "Down Arrow" is for order is delivered but payment is not received or credit.',
            imgurl: <Feather
            style={{ color: "#424242" }}
            name="arrow-down-left"
            size={20}
          />,
        },

        {
          step:' The "Block" is for order has been canceled',
          imgurl: <MaterialIcons
          style={{ color: "#e91e63" }}
          name="block"
          size={20}
        />,
      }
      
      
      
      
      
      
    ],
    
  
  }
];
