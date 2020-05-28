/**
 * @format
 */


import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React, { Component } from 'react';

// import ProfileCardView from './src/compoment/verfiyphone'
// import Menu from './src/promotion'
// import App from './src/index'
import 'react-native-gesture-handler';
// import reducer from './src/reducer'
// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import store from './store'
// const store = createStore(reducer);

export default function Root() {
    return (
      // <Provider>
        <App />
      // </Provider>
    );
  }
  

AppRegistry.registerComponent(appName, () => Root);
