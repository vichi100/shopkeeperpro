import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity
} from "react-native";

import moment from "moment";

import CardContent from "./CardContent";
import CardAction from "./CardAction";
import CardButton from "./CardButton";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";


import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import GuestListScreen from "./GuestListScreen";
import BookingScreen from "./BookingScreen";

const mywidth = Dimensions.get("window").width;
const myheight = Dimensions.get('window').height;
const mycenter = (Dimensions.get('window').height)/2;

export default class CardImageOverlayEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calc_height: 0
    };
  }
  pressedLike = () => {
    console.log("hi vihi")
    this.setState({ liked: !this.state.liked });
  };

  goToTableScreenX = (clubid,eventDate) => { 
    console.log("hi vihi")
    // const {navigate} = this.props.navigation;
    // navigate('GuestListScreen'); 
    console.log("date ; " + eventDate);
    console.log("clubid ; " + clubid);
    this.props.navigation.navigate('TableScreen', {eventDate:eventDate, clubid: clubid});  
  };


  render() {
   
    const newStyle = this.props.style || {};
    if (this.props.eventDate != null) {
      var weekDayName = moment(this.props.eventDate, "DD/MMM/YYYY HH:mm:ssZZ")
        .format("ddd")
        .toUpperCase();
      var date = this.props.eventDate.split("/");
    } else {
      var weekDayName = "";
      var date = "";
    }

    return (
      <View
        style={[styles.cardImage, newStyle]}
        onLayout={e => {
          this.setState({ calc_height: (e.nativeEvent.layout.width * 9) / 16 });
        }}
      >
        <ImageBackground
          source={this.props.source}
          resizeMode="cover"//{this.props.resizeMode || "cover"}
          resizeMethod="scale"//{this.props.resizeMethod || "resize"}
          style={[styles.imageContainer, { height: this.state.calc_height }]}   
          
        >

<View style={{ flexWrap: "wrap", backgroundColor: 'rgba(0, 0, 0, 0.5)', alignSelf: 'flex-start' , position: "absolute", top: 0, margin:5,}}>
          <Text style={{ color: 'white', fontSize: 14, marginTop:5, marginLeft:5, marginRight:5}}>{weekDayName}</Text>
          <Text style={{ color: 'white',  marginLeft:5, marginRight:5}}>{date[0]}</Text>
          <Text style={{ color: 'white',  marginLeft:5, marginRight:5, marginBottom:5}}>{date[1]}</Text>
        </View>


<View style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              alignSelf: "flex-start",
              position: "absolute",
              bottom: 0,
              //left:0,
              height: 75,
              width: mywidth,
              flexDirection: "row",
            }}>
           
              <View style={{ flex: 1, marginLeft:10}}>
              <Text
                  style={{  color: "#e040fb", fontSize: 15 }}
                  numberOfLines={1}
                >
                   {this.props.eventData.eventname}
                </Text>
                <Text
                  style={{
                    
                    color: "#2196f3",
                    fontSize: 17,
                    fontWeight: "bold"
                  }}
                >
                  {this.props.eventData.clubname}
                </Text>
                
              </View>
              
              <View
                style={{
                  height: 35,
                  width: 1,
                  backgroundColor: "#ffffff",
                  marginRight: 5
                }}
              />
              <View style={styles.rowText}>
                <Text
                  style={{textAlign: 'right', color: "#ff9800", fontSize: 16}}
                  numberOfLines={2}
                  ellipsizeMode={"tail"}
                >
                  Free shots for girls 
                </Text>
                <Text
                  style={{textAlign: 'right', color: "#ff9800"}}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  upto 1:00PM 
                </Text>
              </View>


              
            </View>
            
            
            
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                  flexDirection: "row",  
                  //backgroundColor: '#ffffff',
                  position: "absolute",
                  bottom: 0,
                  justifyContent:"center",
                  marginTop: 5,
    
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    marginBottom: 5,
                    justifyContent:"flex-start",
                    flex: 1,
                    marginLeft: 10,
                    // marginRight: 10
                  }}
                >
                  <Ionicons style={styles.icons} name="ios-list" size={15} />
                  <CardButton
                    onPress={() => this.pressedLike()}
                    title="GuestList"
                    color="blue"
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    marginBottom: 5,
                    justifyContent:"center",
                    flex: 1,
                    // marginLeft: 10,
                    // marginRight: 10
                  }}
                >
                  <FontAwesome style={styles.icons} name="ticket" size={15} />  
                  <CardButton onPress={() => this.props.goToTableScreen(this.props.eventData.clubid, this.props.eventData.eventdate)} title="Pass" color="blue" />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    marginBottom: 5,
                    justifyContent:"flex-end",
                    flex: 1,
                    // marginLeft: 10,
                    marginRight: 5
                  }}
                >
                  <MaterialCommunityIcons
                    style={styles.icons}
                    name="table-plus"
                    size={15}
                    
                  />
                  
              <CardButton onPress={() => this.goToTableScreen(this.props.eventData.clubid, this.props.eventData.eventdate)} title="Table" color="#8FD694" />
                </View>
              </View>
           

              
          <MaterialCommunityIcons
          onPress={() => this.pressedLike()}
            style={styles.heartwhite}
            name="heart-outline"
            size={30}
          />
          <EvilIcons style={styles.share} name="share-google" size={30} />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardImage: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "grey",
    //alignSelf: 'stretch',
    marginBottom: 1,
    justifyContent: "center"
    //alignItems: 'stretch'
  },
  imageContainer: {
    flex: 1,
    flexDirection: "column",
    //paddingRight: 16,
    //paddingLeft: 16,
    paddingBottom: 10,
    paddingTop: 5,
    justifyContent: "flex-end"
  },
  imageTitleText: {
    fontSize: 24,
    color: "rgba(255 ,255 ,255 , 0.87)"
  },
  heartwhite: {
    margin: 10,
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    color: "#ffffff"
  },
  heartred: {
    margin: 10,
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    color: "red"
  },
  share: {
    margin: 10,
    position: "absolute",
    top: 50,
    right: 0,
    width: 30,
    height: 30,
    color: "#009688"
  },
  near_me: {
    margin: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    color: "#60B2E5"
  },

  rowText: {
    flex: 1,
    flexDirection: "column",
    color: "#607d8b",
    marginRight:10,
    //textAlign: 'right', alignSelf: 'stretch'
  },
  icons: {
    color: "#60B2E5",
    //transform: [{ rotate: '90deg'}]
  },
});
