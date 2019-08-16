// import React, { Component } from 'react';
// import { View, Text, FlatList, ActivityIndicator } from 'react-native';
// import { ListItem, SearchBar } from 'react-native-elements';




//This is an example code to Add Search Bar Filter on Listview//
import React, { Component } from 'react';
import { Card } from 'react-native-elements';
//import react in our code.
 
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
//import all the components we are going to use.
 
export default class CustomerListScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = { isLoading: true, text: '' };
    this.arrayholder = [];
  }
 
  componentDidMount() {
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson
          },
          function() {
            this.arrayholder = responseJson;
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      text: text,
    });
  }
  ListViewItemSeparator = () => { 
    //Item sparator view
    return (
      <View
        style={{
          height: 0.3,
          width: '90%',
          backgroundColor: '#080808',
        }}
      />
    );
  };
  render() {
    if (this.state.isLoading) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      //ListView to show with textinput used as search bar
      <View style={styles.viewStyle}>
      <Card containerStyle={{padding: 10, backgroundColor:'#69f0ae'}}> 
        {/*react-native-elements Card*/}
        <View style={styles.totalAmountStyle}>
            <Text>Total amount to receive</Text> 
            <Text>5000</Text> 
        </View>
        </Card>
        
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
        <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          renderItem={({ item }) => (
            <Text style={styles.textStyle}>{item.title}</Text>
          )}
          enableEmptySections={true}
          style={{ marginTop: 10 }}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    //justifyContent: 'center',
    backgroundColor: '#ffffff',//'#ecf0f1',
    flex: 1,
    //marginTop: 10,
    // paddingLeft: 16,
    // paddingRight: 16,
  },
  totalAmountStyle:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    //flex: 1,
    
    marginTop: 10,
    //padding: 16,
  },
  textStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    marginTop:15,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
});







// export default class CustomerListScreen extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       loading: false,
//       data: [],
//       error: null,
//     };

//     this.arrayholder = [];
//   }

//   componentDidMount() {
//     this.makeRemoteRequest();
//   }

//   makeRemoteRequest = () => {
//     const url = `https://randomuser.me/api/?&results=20`;
//     this.setState({ loading: true });

//     fetch(url)
//       .then(res => res.json())
//       .then(res => {
//         this.setState({
//           data: res.results,
//           error: res.error || null,
//           loading: false,
//         });
//         this.arrayholder = res.results;
//       })
//       .catch(error => {
//         this.setState({ error, loading: false });
//       });
//   };

//   renderSeparator = () => {
//     return (
//       <View
//         style={{
//           height: 1,
//           width: '86%',
//           backgroundColor: '#CED0CE',
//           marginLeft: '14%',
//         }}
//       />
//     );
//   };

//   searchFilterFunction = text => {
//     this.setState({
//       value: text,
//     });

//     const newData = this.arrayholder.filter(item => {
//       const itemData = `${item.name.title.toUpperCase()} ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
//       const textData = text.toUpperCase();

//       return itemData.indexOf(textData) > -1;
//     });
//     this.setState({
//       data: newData,
//     });
//   };

//   renderHeader = () => {
//     return (
//       <SearchBar
//         placeholder="Search Name or Phone Number"
//         lightTheme
//         round
//         onChangeText={text => this.searchFilterFunction(text)}
//         autoCorrect={false}
//         value={this.state.value}
//       />
//     );
//   };

//   render() {
//     if (this.state.loading) {
//       return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//           <ActivityIndicator />
//         </View>
//       );
//     }
//     return (
//       <View style={{ flex: 1 }}>
//         <FlatList
//           data={this.state.data}
//           renderItem={({ item }) => (
//             <ListItem
//               leftAvatar={{ source: { uri: item.picture.thumbnail } }}
//               title={`${item.name.first} ${item.name.last}`}
//               subtitle={item.email}
//             />
//           )}
//           keyExtractor={item => item.email}
//           ItemSeparatorComponent={this.renderSeparator}
//           ListHeaderComponent={this.renderHeader}
//         />
//       </View>
//     );
//   }
// }

