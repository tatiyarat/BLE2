/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
// import ProfileCardView from './src/compoment/verfiyphone'
import Menu from './src/promotion'

import 'react-native-gesture-handler';
AppRegistry.registerComponent(appName, () => Menu);
