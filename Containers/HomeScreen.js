import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 10 }}>
          <Button
            title="Electronics"
            onPress={() => this.props.navigation.navigate("Electronics")}
          />
        </View>
        <View>
          <Button
            title="Books"
            onPress={() => this.props.navigation.navigate("Books")}
          />
        </View>
      </View>
    );
  }
}

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
