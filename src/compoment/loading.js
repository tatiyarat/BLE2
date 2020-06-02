import React, { Component } from 'react';
import {
  ActivityIndicator,
  Text,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Loading extends Component {
  componentDidMount(){
    this._loadInitialState()
  }
  _loadInitialState = async () => {
    try {
        let value = await AsyncStorage.getItem('datakey');
        if (value !== null || value === 'true') {
          this.props.navigation.navigate('Craigslist');
        } else {
          this.props.navigation.navigate('Register');
        }
    } catch (error) {
      console.error('Error:AsyncStorage:', error.message);
    }
  };
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