
import * as React from 'react';
import {  AsyncStorage,Button,Image,TouchableOpacity} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Picker} from '@react-native-community/picker';

// import SignUp from './src/';
import register from './src/register';
import Craigslist from './src/promotion'
// import Craigslist from './promotion';


function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('./src/logo/logo-7.png')}
    />
  );
}
function LogoSetiing() {
  return (
    <TouchableOpacity onPress>
      <Image
        style={{ width: 50, height: 50 }}
        source={require('./src/logo/settting.png')}
      />
    </TouchableOpacity>
    
  );
}
export default class App extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn:false,
      userToken: null,
      nav:"register",
    }
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token')
      if(value !== null) {
        this.setState({isSignedIn: true})
        this.setState({nav:"Craigslist"})
        console.log(this.state.isSignedIn)
        // await  AsyncStorage.setItem('token','');
        // const adfas = await AsyncStorage.getItem('token')
        // console.log(adfas+'asfasf')
      }
    } catch(e) {
      console.log(e)
    }
  }
 
  componentDidMount(){

    this.setState({isSignedIn: true})
    this.setState({ nav : 'Craigslist' })
    console.log(this.state.isSignedIn)
    console.log(this.state.nav)
    
    // this.getData();
   
    // console.log(this.state);
    
    // console.log(this.state.nav);
  }
  // componentWillUnmount(){
  //   this.setState({isSignedIn: false})
  //   this.setState({ nav : 'register' })
  //   console.log(this.state.isSignedIn)
  //   console.log(this.state.nav)
  // }

  render() {
    
    // onSignOut = async () =>{
    //     try {
    //       const value = await AsyncStorage.setItem('token','')
    //       console.log(value+'logOuted')
    //       this.setState({isSignedIn: false})
    //       this.props.navigation.navigate('Home')
    //       // , {
    //       //   screen: 'Home',
    //       // }
    //     } catch (e) {
    //       console.log(e)
    //     }
    // } 
   
    const Stack = createStackNavigator();
    return (
      <NavigationContainer>
      <Stack.Navigator  initialRouteName={this.state.nav}>
          <Stack.Screen name="register" component={register} />

          <Stack.Screen name="Craigslist" component={Craigslist} 
            options={{
            headerTitle: props => <LogoTitle {...props} />,
            headerRight:props => <LogoSetiing {...props} />
          }}
          />
      </Stack.Navigator>
    </NavigationContainer>
    );

  }
}