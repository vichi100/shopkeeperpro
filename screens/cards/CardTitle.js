import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class CardTitle extends Component {
  render () {
    //const newStyle = this.props.style || {};
    let titleStyle = [styles.titleText];
    let subtitleStyle = [styles.subtitleText];
    if((this.props.title!==undefined)&&(this.props.subtitle!==undefined)&&(this.props.avatarSource===undefined)) {
      if(this.props.subtitleAbove===true) {
        subtitleStyle = [...subtitleStyle, {marginBottom: 1}];
      }
      else {
        titleStyle = [...titleStyle, {marginBottom: 1}];
      }
    }
    if(this.props.isDark) {
      subtitleStyle = [...subtitleStyle, styles.lightText];
      titleStyle = [...titleStyle, styles.lightText];
    }
    else {
      titleStyle = [...titleStyle, styles.darkText];
    }
    if(this.props.subtitleAbove!==true) {
      return (
        <View style={[styles.cardTitle]}>
          {this.props.avatarSource!==undefined &&
            <Image source={this.props.avatarSource} resizeMode="stretch" style={styles.avatarStyle} />
          }
          <View style={styles.cardTitleTextCont}>
            {this.props.title!==undefined &&
              <Text style={this.props.avatarSource===undefined ? titleStyle : [titleStyle, {fontSize: 14}]}>{this.props.title}</Text>
            }
            {this.props.subtitle!==undefined &&
              <Text style={subtitleStyle}>{this.props.subtitle}</Text>
            }
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={[styles.cardTitle]}>
          {this.props.avatarSource!==undefined &&
            <Image source={this.props.avatarSource} resizeMode="stretch" style={styles.avatarStyle} />
          }
          <View style={styles.cardTitleTextCont}>
            {this.props.subtitle!==undefined &&
              <Text style={subtitleStyle}>{this.props.subtitle}</Text>
            }
            {this.props.title!==undefined &&
              <Text style={this.props.avatarSource===undefined ? titleStyle : [titleStyle, {fontSize: 14}]}>{this.props.title}</Text>
            }
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  darkText: {
    color: 'rgba(0 ,0 ,0 , 0.87)'
  },
  lightText: {
    color: '#D138BF'
  },
  cardTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 3,
    //paddingTop: 5, #
    //backgroundColor: '#80cbc4',
  },
  cardTitleTextCont: {
    flex: 1,
    flexDirection: 'column',
    
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600', 
  },
  subtitleText: {
    fontSize:14,
    color: '#D138BF'
  },
  avatarStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16
  }
});
