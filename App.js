
import * as React from 'react';
import { StyleSheet,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// import SignUp from './src/';
import register from './src/register';
import Menu from './src/promotion'
import editer from './src/editer'

export default class App extends React.Component {
    
  constructor(props) {
    // console.log(AsyncStorage.getItem('datakey'));
    
    super(props);
    this.state = {
      nav:"",
    }
  }
  componentWillMount() {
    // this._loadInitialState()
  }
 
  // _loadInitialState = async () => {
  //   try {
  //       let value = await AsyncStorage.getItem('datakey');
  //       if (value !== null || value === 'true') {
  //         this.setState({nav: "Craigslist"});
  //       } else {
  //         this.setState({nav: "Register"});
  //       }
  //   } catch (error) {
  //     console.error('Error:AsyncStorage:', error.message);
  //   }
  // };


  render() {
    const Stack = createStackNavigator();
    const nav = this.state.nav;
    console.log(nav);
    // if (nav == "Craigslist") {
      return (
        <NavigationContainer>
          <StatusBar hidden={true} />
          <Stack.Navigator  initialRouteName={"Register"} headerMode={'none'}>
              <Stack.Screen name="Register"  component={register}/>
              <Stack.Screen name="Craigslist" component={Menu} />
              <Stack.Screen name="editprofile" component={editer} />
          </Stack.Navigator>
        </NavigationContainer>
        );
    // } else {
    //   return (
    //     <NavigationContainer>
    //       <StatusBar hidden={true} />
    //       <Stack.Navigator  initialRouteName={"Register"} headerMode={'none'}>
    //           <Stack.Screen name="Register"  component={register}/>
    //           <Stack.Screen name="Craigslist" component={Menu} />
    //           <Stack.Screen name="editprofile" component={editer} />
    //       </Stack.Navigator>
    //     </NavigationContainer>
    //     );
    // }
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