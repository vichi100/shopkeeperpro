import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { Button } from 'react-native-elements'; // Version can be specified in package.json
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

export default class PhoneNumberListScreen extends Component {
  
  async showFirstContactAsync() {
      // Ask for permission to query contacts.
      const permission = await Permissions.askAsync(Permissions.CONTACTS);
      
      if (permission.status !== 'granted') {
        // Permission was denied...
        return;
      }
      const contacts = await Contacts.getContactsAsync({
        fields: [
          Contacts.PHONE_NUMBERS,
          Contacts.EMAILS,
        ],
        pageSize: 100,
        pageOffset: 0,
      });
      if (contacts.total > 0) {
        //console.log(contacts.data)
        console.log(contacts.data[40].firstName)
        console.log(contacts.data[40].phoneNumbers[0].number)
        // Alert.alert(
        //   'Your first contact is...',
        //   `Name: ${contacts.data[0].name}\n` +
        //   `Phone numbers: ${contacts.data[0].phoneNumbers[0].number}\n` +
        //   `Emails: ${contacts.data[0].emails[0].email}`
        // );
      }
    }
    
  render() {
    return (
      <View style={{flex: 1, paddingTop: 40}}>
        <Button title='Get contacts' onPress={this.showFirstContactAsync} />
      </View>
    );
  }
}