import React, { Component } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import BleManager from 'react-native-ble-manager';

export default class Loading extends Component {
  state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
  };
  // watchID: ?number = null;

  componentDidMount(){
    this._loadInitialState()
    this.props.navigation.addListener('focus', this.onScreenFocus)
  }


  _loadInitialState = async () => {
    try {
        let value = await AsyncStorage.getItem('datakey');
        if (value !== null || value === 'true') {
          BleManager.enableBluetooth().then(() => {
            // Success code
            console.log('The bluetooth is already enabled or the user confirm');
            this.props.navigation.navigate('Craigslist');
          })
          .catch((error) => {
            // Failure code
            console.log('The user refuse to enable bluetooth');
          });
        } else {
          this.props.navigation.navigate('Register');
        }
    } catch (error) { 
      console.error('Error:AsyncStorage:', error.message);
    }
  }; 
  onScreenFocus = () => {
    this._loadInitialState()
  }

    render() {
      return (
        
        <View style={{  flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#DCDCDC',
            height: '100%',}}>
          <ActivityIndicator
            animating={true}
            color="white"
            size="large"
            style={{margin: 15}}
          />
          <Text >
            loading...
          </Text>
        </View>
      );
    }
}