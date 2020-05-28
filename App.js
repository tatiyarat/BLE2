
import * as React from 'react';
import { StyleSheet,Image,TouchableOpacity,Text,StatusBar,View,Dimensions,NativeEventEmitter,PermissionsAndroid,
  NativeModules,AppState,Platform,Alert

} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// import SignUp from './src/';
import register from './src/register';
import Menu from './src/promotion'



export default class App extends React.Component {
    
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      nav:AsyncStorage.getItem('datakey')==null?"register":"Craigslist",

      serverAddr: "192.168.101.201",

      title: "สวัสดีค้าา",

      def_Location: "000",
      def_Order: "00",
      def_Message: "ShellHut",
      def_RSSI: 0,

      cur_Location: "",
      cur_Order: "",
      cur_Message: "",
      cur_RSSI: 0,
      
      get_Location: "",
      get_Order: "",
      get_Message: "",
      get_RSSI: 0,

      timeToScan: 5,
   
      peripherals: new Map(),
      appState: '',
      btEnabled: false,
      minRSSI: -75,

      runing:0,
    }
    // this.handleAppStateChange = this.handleAppStateChange.bind(this);

  }

 


  componentDidMount(){
    
    
 
  }

  componentWillUnmount(){
   
  }

  render() {
    
    const Stack = createStackNavigator();
    return (
      <NavigationContainer  >
      <StatusBar hidden={true} />
      <Stack.Navigator  initialRouteName={this.state.nav } headerMode={'none'}>
          <Stack.Screen name="Register" 
          component={register}/>
          <Stack.Screen name="Craigslist" component={Menu} 
          headerMode={"none"}
          />
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  editcircle: {
    width: 50, 
    height: 50,
    margin: 10,
    borderRadius: 50
  },
  row: {
    margin: 10
  },
});