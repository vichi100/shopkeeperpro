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

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
//https://github.com/laki944/react-native-navigation-directions/blob/master/index.js
import { OpenMapDirections } from '../screens/gmap/GMapDirectionDrive'; 

const mywidth = Dimensions.get("window").width;
const myheight = Dimensions.get('window').height;
const mycenter = (Dimensions.get('window').height)/2;

export default class CardImage extends Component {
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

  _callShowDirections = (latlong) => {
    //"latlong":"19.106205,72.825633"
    console.log("latlong "+latlong);
    var latlongArr = latlong.split(',');
    console.log("latlong "+parseFloat(latlongArr[0]));
    console.log("latlong "+latlongArr[1]);
    const startPoint = {
      longitude: -8.945406,
      latitude: 38.575078
    } 

    const endPoint = { 
      longitude: parseFloat(latlongArr[1]),
      latitude: parseFloat(latlongArr[0]),
    }

		const transportPlan = 'd';

    OpenMapDirections(null, endPoint, transportPlan).then(res => {
      console.log(res)
    });
  }

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
          resizeMode={this.props.resizeMode || "cover"}
          resizeMethod={this.props.resizeMethod || "resize"}
          style={[styles.imageContainer, { height: this.state.calc_height }]}
          
        >
          {/* {this.props.title !== undefined &&
            this.props.singleLineTitle == true && (
              <Text numberOfLines={1} style={styles.imageTitleText}>
                {this.props.title}
              </Text>
            )}
          {this.props.title !== undefined &&
            (this.props.singleLineTitle == false ||
              this.props.singleLineTitle === undefined) && (
              <Text style={styles.imageTitleText}>{this.props.title}</Text>
            )} */}

          {/* <View style={{ flexWrap: "wrap", backgroundColor: 'rgba(0, 0, 0, 0.5)', alignSelf: 'flex-start' , position: "absolute", top: 0, margin:5,}}>
          <Text style={{ color: 'white', fontSize: 14, marginTop:5, marginLeft:5, marginRight:5}}>{weekDayName}</Text>
          <Text style={{ color: 'white',  marginLeft:5, marginRight:5}}>{date[0]}</Text>
          <Text style={{ color: 'white',  marginLeft:5, marginRight:5, marginBottom:5}}>{date[1]}</Text>
        </View> */}

          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              alignSelf: "flex-start",
              position: "absolute",
              bottom: 0,
              height: 55,
              width: mywidth
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#ffffff",
                margin: 5
              }}
            >
              {this.props.title}
            </Text>

            <Text
              style={{
                color: "#ffffff",
                marginLeft: 5
              }}
            >
              {this.props.location}
            </Text>
            
          </View>
          {/* <TouchableOpacity onPress={()=>this.pressedLike()} >
         
          

          <MaterialCommunityIcons
          style={[styles.heartwhite, this.state.liked && styles.heartred]}
          //color={this.state.touchableHighlightMouseDown?'#ffffff':(this.state.liked ? '#dd2c00' : '#ffffff')}
                      name="heart-outline"
                      size={25}
                    />
          </TouchableOpacity> */}
          
              <MaterialIcons onPress={() => this._callShowDirections(this.props.latlong)} style={styles.near_me} name="near-me" size={30} />
              
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
});
