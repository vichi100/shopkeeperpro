import React, { Component } from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import AnimatedBar from './AnimatedBar';
//https://hackernoon.com/playing-with-react-native-animations-d065e7e97391#.4i8vtnhhw
//https://github.com/spencercarli/react-native-bar-graph-animation-example

const window = Dimensions.get('window');
const DELAY = 100;

class HorizontalBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.generateData();
    // this.interval = setInterval(() => {
      this.generateData();
    // }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  generateData = () => {
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push(100);
    }

    this.setState({
      data,
    });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5FCFF', justifyContent: 'center'}}>
        <View>
          {this.state.data.map((value, index) => <AnimatedBar value={value} key={index} />)}
        </View>
      </View>
    );
  }
}

export default App;
