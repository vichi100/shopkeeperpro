import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';


const TESTDATA = [
	{ key: 1, label: 'Label 1', leftLabel: 'Left 1', rightLabel: 'Right 1' },
	{ key: 2, label: 'Label 2', leftLabel: 'Left 2', rightLabel: 'Right 2' },
	{ key: 3, label: 'Label 3', leftLabel: 'Left 3', rightLabel: 'Right 3' },
	{ key: 4, label: 'Label 4', leftLabel: 'Left 4', rightLabel: 'Right 4' },
	{ key: 5, label: 'Label 5', leftLabel: 'Left 5', rightLabel: 'Right 5' },
	{ key: 6, label: 'Label 6', leftLabel: 'Left 6', rightLabel: 'Right 6' },
	{ key: 7, label: 'Label 7', leftLabel: 'Left 7', rightLabel: 'Right 7' },
	{ key: 8, label: 'Label 8', leftLabel: 'Left 8', rightLabel: 'Right 8' },
	{ key: 9, label: 'Label 9', leftLabel: 'Left 9', rightLabel: 'Right 9' },
	{ key: 10, label: 'Label 10', leftLabel: 'Left 10', rightLabel: 'Right 10' },
	{ key: 11, label: 'Label 11', leftLabel: 'Left 11', rightLabel: 'Right 11' },
	{ key: 12, label: 'Label 12', leftLabel: 'Left 12', rightLabel: 'Right 12' },
	{ key: 13, label: 'Label 13', leftLabel: 'Left 13', rightLabel: 'Right 13' },
	{ key: 14, label: 'Label 14', leftLabel: 'Left 14', rightLabel: 'Right 14' },
	{ key: 15, label: 'Label 15', leftLabel: 'Left 15', rightLabel: 'Right 15' },
	{ key: 16, label: 'Label 16', leftLabel: 'Left 16', rightLabel: 'Right 16' },
	{ key: 17, label: 'Label 17', leftLabel: 'Left 17', rightLabel: 'Right 17' },
	{ key: 18, label: 'Label 18', leftLabel: 'Left 18', rightLabel: 'Right 18' },
	{ key: 19, label: 'Label 19', leftLabel: 'Left 19', rightLabel: 'Right 19' },
	{ key: 20, label: 'Label 20', leftLabel: 'Left 20', rightLabel: 'Right 20' },
	{ key: 21, label: 'Label 21', leftLabel: 'Left 21', rightLabel: 'Right 21' },
	{ key: 22, label: 'Label 22', leftLabel: 'Left 22', rightLabel: 'Right 22' },
	{ key: 23, label: 'Label 23', leftLabel: 'Left 23', rightLabel: 'Right 23' },
	{ key: 24, label: 'Label 24', leftLabel: 'Left 24', rightLabel: 'Right 24' },
	{ key: 25, label: 'Label 25', leftLabel: 'Left 25', rightLabel: 'Right 25' },
	{ key: 26, label: 'Label 26', leftLabel: 'Left 26', rightLabel: 'Right 26' },
	{ key: 27, label: 'Label 27', leftLabel: 'Left 27', rightLabel: 'Right 27' },
	{ key: 28, label: 'Label 28', leftLabel: 'Left 28', rightLabel: 'Right 28' },
	{ key: 29, label: 'Label 29', leftLabel: 'Left 29', rightLabel: 'Right 29' },
	{ key: 30, label: 'Label 30', leftLabel: 'Left 30', rightLabel: 'Right 30' },
];

export default class SwipeableFlatListExample extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Example of react-native-swipeable-flat-list
				</Text>
				<SwipeableFlatList
					data={TESTDATA}
					keyExtractor={(item) => `${item.label}`}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => console.log('pressed TouchableOpacity')}
							style={{
								height: 48,
							}}
						>
							<View
								style={{
									backgroundColor: 'cornflowerblue',
									borderColor: 'grey',
									borderWidth: 1,
									flex: 1,
									justifyContent: 'center',
									padding: 8,
								}}
							>
								<Text
									style={{
										backgroundColor: 'transparent',
										color: 'black',
										fontSize: 16,
									}}
								>
									{item.label}
								</Text>
							</View>
						</TouchableOpacity>
					)}
					renderLeft={({ item }) => (
						<TouchableOpacity
							style={{
								height: 48,
								width: 80,
							}}
						>
							<View
								style={{
									backgroundColor: 'lightgrey',
									borderColor: 'black',
									borderWidth: 1,
									flex: 1,
									justifyContent: 'center',
									padding: 8,
								}}
							>
								<Text
									style={{
										backgroundColor: 'transparent',
										color: 'black',
										fontSize: 16,
									}}
								>
									{item.leftLabel}
								</Text>
							</View>
						</TouchableOpacity>
					)}
					renderRight={({ item }) => (
						<TouchableOpacity
							style={{
								height: 48,
								width: 80,
							}}
						>
							<View
								style={{
									backgroundColor: 'lightgrey',
									borderColor: 'black',
									borderWidth: 1,
									flex: 1,
									justifyContent: 'center',
									padding: 8,
								}}
							>
								<Text
									style={{
										backgroundColor: 'transparent',
										color: 'black',
										fontSize: 16,
									}}
								>
									{item.rightLabel}
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		//alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});