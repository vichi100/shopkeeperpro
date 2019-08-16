/*Example of Expandable ListView in React Native*/
import React, { Component } from "react";
//import react in our project
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  FlatList,
  TextInput
} from "react-native";
//import basic react native components
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RadioGroup from 'react-native-radio-buttons-group';
import {SERVER_URL} from '../Constants'; 
import Card from "../screens/cards/Card";
import axios from 'axios';

class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List
  constructor() {
    super();
    
    this.state = {
      layoutHeight: 0,
      liked : false,
    };
  }
  componentWillReceiveProps(nextProps) {

    


    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0
        };
      });
    }
  }

  toggleStrike(index) {
    this.setState((prevState) => {
        prevState.items[index].selected = !prevState.items[index].selected;
        return { ...prevState }
    });
} 

  pressedLike = () => {
    console.log("hi vihi")
    this.setState({ liked: !this.state.liked });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  

  render() {
    return (
      <View>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={styles.header}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={styles.headerText}>
              {this.props.item.customername}
            </Text>
            <Text style={styles.headerText}>+</Text>
            <Text style={styles.headerText}>
              Rs.{this.props.item.totalcost}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: "hidden"
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(128,128,0, 0.1)",
              marginTop: 0.5,
              padding: 10
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons style={{marginRight:10}} name="phone" size={20} />
              <Text style={styles.contentText}>
                {this.props.item.customermobile}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <AntDesign style={{marginRight:10}} name="home" size={20} />
              <Text style={styles.contentText}>
                {this.props.item.deliveryaddress} 
              </Text>
            </View>
          </View>
          {/*Content under the header of the Expandable List Item*/}
          {this.props.item.products.map((item, key) => (
            <View style={{flexDirection:'row', flex: 1}}>
              {/* <TouchableOpacity
                key={key}
                style={styles.content}
                onPress={() => alert("Id: " + item.id + " val: " + item.name)}
              > */}
                <Text style={styles.text}>
                  {key+1}. {item.productname}
                </Text>
                <Text style={styles.text}>
                   {item.weight}
                </Text>
                <Text style={styles.text}>
                   Rs.{item.price}
                </Text>
                <TouchableOpacity onPress={()=>this.pressedLike()} >
         
          

                <MaterialCommunityIcons
                      color={this.state.touchableHighlightMouseDown?'#424242':(this.state.liked ? '#dd2c00' : '#424242')}
                      name="heart-outline"
                      size={20}
                    />
          </TouchableOpacity>
                {/* <TouchableOpacity
                key={key}
                style={styles.content}
                onPress={() => alert("Id: " + item.id + " val: " + item.name)}
              > */}
                {/* <AntDesign style={{marginTop:10, alignItems: "center", justifyContent: 'center', position: 'absolute', right:10, color:'#bdbdbd'}} name="minuscircleo" size={20} /> */}
              {/* </TouchableOpacity> */}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

//ORDER LIST CLASS:

export default class OrderListScreen extends Component { 
    static navigationOptions = {
        //To set the header image and title for the current Screen
        title: 'Orders',
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
  //Main View defined under this Class
  constructor() {
    super();
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = { 
        listDataSource: null,
        showFilter: false,
        filterData: [
            {
                label: 'All',
                color: '#90caf9',
              },
            {
                label: 'New',
                color: '#90caf9',
              },
            {
              label: 'Pending',
              color: '#90caf9',
            },
            
            {
                label: 'Completed',
                color: '#90caf9',
              },
          ],
    };
  }


  componentDidMount() {
    console.log('componentDidMount')
    
    
    var shopid = 'vichishop';
    const orderQueryData = {
      shopid: shopid
    }
    
    try{
      axios({
        // Of course the url should be where your actual GraphQL server is.
        url: SERVER_URL + "/ordersByShopId",
        method: "POST",  
        headers: {
          Accept: "application/json",  
          "Content-Type": "application/json"  
        }, 
        data: orderQueryData
      }).then(result => {
        console.log("Resp Data: " + JSON.stringify(result.data));
        this.setState({listDataSource: result.data})
        
      }).catch(error => {    
        console.error(error); 
      });     

      // fetch(SERVER_URL + "/graphql", { 
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json"
      //   },
      //   body: JSON.stringify({
      //     query:
      //       "{ products{productid  productname brand category description weight  price searchtags  imageurl } }"
      //   })
      // })
      //   .then(res => res.json())
      //   .then(res => {
      //     // console.log("data returned:", JSON.stringify(res))
      //     console.log("data returned:", data.Object);
          
      //   });


      

    }catch(err){
      console.log('Error in OrderListScreen: '+err)
    }

    
      
    
    
    
    



  }

  

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

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.title ? item.title.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      text: text
    });
  }

  updateLayout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.listDataSource];
    array[index]["isExpanded"] = !array[index]["isExpanded"];
    this.setState(() => {
      return {
        listDataSource: array
      };
    });
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

    // update state
    onPress = filterData => this.setState({ filterData: filterData });

  render() {
    let selectedButton = this.state.filterData.find(e => e.selected == true);
    selectedButton = selectedButton ? selectedButton.value : this.state.filterData[0].label;
    return (
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "rgba(0,0,128, 0.4)",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10
          }}
        >
          <Text style={{ alignItems: "center", color: "#fff" }}>
            New Order: 10 of Rs. 1000
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#fff" }}>Pending: 10 of Rs. 1500</Text>
            <Text style={{ marginLeft: 15, marginRight: 15, color: "#fff" }}>
              |
            </Text>
            <Text style={{ color: "#fff" }}>Completed: 10 of Rs. 2500</Text>
          </View>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', margin:7}}>
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
        {/* <View>
        {this.state.showFilter ? <Text style= {{ fontSize: 25, color: "#000", textAlign: 'center' }}> Hello Friends </Text> : null}
        </View> */}

        <View style = {{flexDirection:'row', justifyContent:'center', backgroundColor: '#f5f5f5'}}>
        {this.state.showFilter ? 
            <View style={{flexDirection: 'row'}}>
            <RadioGroup  flexDirection='row' radioButtons={this.state.filterData} onPress={this.onPress} />
      </View> : null}
      </View>

        
        {/* <ScrollView>
          {this.state.listDataSource.map((item, key) => (
            <ExpandableItemComponent
              key={item.category_name}
              onClickFunction={this.updateLayout.bind(this, key)}
              item={item}
            />
          ))}
        </ScrollView> */}

        <FlatList
          data={this.state.listDataSource}
          renderItem={({ item, index }) => (
            // <Text style={styles.textStyle}>{item.category_name}</Text>
            <ExpandableItemComponent
              key={item.category_name}
              onClickFunction={this.updateLayout.bind(this, index)}
              item={item}
            />
          )}
          enableEmptySections={true}
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
  topHeading: {
    paddingLeft: 10,
    fontSize: 20
  },
  header: {
    backgroundColor: "rgba(142, 213, 87, 0.3)",
    padding: 16
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "sans-serif"
  },

  contentText: {
    fontSize: 14,
    //fontWeight: '500',
    fontFamily: "sans-serif"
  },
  separator: {
    height: 0.5,
    backgroundColor: "#808080",
    width: "95%",
    marginLeft: 16,
    marginRight: 16,
    borderBottomColor: "#d1d0d4",
    borderBottomWidth: 1
  },
  text: {
    fontSize: 16,
    color: "#606070",
    padding: 10
  },
  content: {
    //paddingBosubcategoryom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#fff"
  }
});

//Dummy content to show
//You can also use dynamic data by calling webservice
const CONTENT = [
  {
    isExpanded: false,
    customerName: "Vichi",
    customerMObile: "+91 9867614422",
    totalCost: "500",
    customerAddress:
      "B-102 2nd Floor, Kagalwala House Bandra Kurla Complex, Mumbai 400098",
    products: [
      {
        id: 1,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 2,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 3,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 4,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 5,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 6,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      }
    ]
  },
  {
    isExpanded: false,
    customerName: "Tuchi",
    customerMObile: "+91 9867614422",
    totalCost: "500",
    customerAddress:
      "B-102 2nd Floor, Kagalwala House Bandra Kurla Complex, Mumbai 400098",
    products: [
      {
        id: 1,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 2,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 3,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 4,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 5,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 6,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      }
    ]
  },
  {
    isExpanded: false,
    customerName: "Suchi",
    customerMObile: "+91 9867614422",
    totalCost: "500",
    customerAddress:
      "B-102 2nd Floor, Kagalwala House Bandra Kurla Complex, Mumbai 400098",
    products: [
      {
        id: 1,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 2,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 3,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 4,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 5,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      },
      {
        id: 6,
        name: "magggi",
        brand: "Maggi",
        description: " 2 minitus noodles",
        weight: "70g",
        quantity: "5",
        price: "21"
      }
    ]
  }
];
