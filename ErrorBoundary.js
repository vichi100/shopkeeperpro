import React from "react";

import { View, Text, Image } from "react-native";

// import Error from "./assets/images/error.png";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: ""
    };
  }
  componentDidCatch(err, errInfo) {
    console.log(err);
    console.log(errInfo);
    this.setState({
      error: true,
      message: errInfo.componentStack.toString()
    });
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          
          <Text style={{ textAlign: "center", fontSize: 14, padding: 10, fontWeight:'500', fontFamily: "sans-serif" }}>
            Opps...! Something Went Wrong. Try Again Later
          </Text>
          {__DEV__ ? (
            <Text style={{ textAlign: "center", fontSize: 8, padding: 10 }}>
              {this.state.message}
            </Text>
          ) : null}
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = {
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
};