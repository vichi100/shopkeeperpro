import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableHighlight } from 'react-native';
const width = Dimensions.get("window").width;

// const iconWallet = require("./img/purse.png");
// const iconChecked = require("./img/checked.png");

const data = [
	{ name: 'Name wallet 1', key: 1 },
	{ name: 'Name wallet 2', key: 2 },
	{ name: 'Name wallet 3', key: 3 },  
	{ name: 'Name wallet 4', key: 4 },
	{ name: 'Name wallet 5', key: 5 }
]

export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			indexChecked: []
		};
  }
  
  itemSelected = (index) => {
    console.log('itemSelected: '+ index)  
    var x = this.state.indexChecked
    if(x.includes(index)){
      x.pop(index)
    }else{
      x.push(index)
    }
    
    this.setState({ indexChecked: x })
    console.log('this.state.indexChecked Array: '+this.state.indexChecked)
    
  }

	render() { 
    console.log('this.state.indexChecked: '+this.state.indexChecked)
		return (
			<View style={styles.container}>
				{/* <StatusBar backgroundColor="#a8e9f4"/>? */}
				<View style={styles.title}>
					<Text>Select one wallet</Text>
				</View>

				<FlatList
					data={data}
					keyExtractor={(item) => item.key}
					extraData={this.state}
					renderItem={({ item, index}) =>
						<View style={styles.wrapContent}>
							{/* <Image source={iconWallet} style={styles.iconForm} /> */}
							<TouchableHighlight
								style={styles.boxSelect}
								underlayColor="transparent"
								onPress={() => this.itemSelected(item.key)}
							>
								<View style={styles.contentChecked}>
									<Text style={styles.alignCenter}>{item.name}</Text> 
									{/* {this.state.indexChecked === item.key && <Text style={styles.iconChecked} >hi</Text>} */}
									{/* color={this.state.touchableHighlightMouseDown?'#424242':(this.state.liked ? '#dd2c00' : '#424242')} */}
                  {true ?  <Text style={styles.iconChecked}>yo</Text> : <Text style={styles.iconChecked} >oi</Text>}
								</View>
							</TouchableHighlight>
						</View>
					}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#a8e9f4"
	},

	wrapContent: {
		position: 'relative',
		flexDirection: 'row',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'flex-start',
		margin: 10,
		height: 40,
		paddingHorizontal: 10
	},

	boxSelect: {
		justifyContent: 'flex-start',
		alignContent: 'center',
		borderRadius: 5,
		paddingLeft: 10,
		width: width - 40
	},

	contentChecked: {
		justifyContent: 'space-between',
		alignItems: 'center',
		height: '100%',
		flexDirection: 'row'
	},

	iconChecked: {
		marginRight: 20
	},

	alignCenter: {
		lineHeight: 40,
		color: 'black'
	},

	title: {
		padding: 10
	}
});