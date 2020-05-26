
import * as React from 'react';
import {  AsyncStorage,Button,Image,TouchableOpacity,Text,StatusBar,View} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// import SignUp from './src/';
import register from './src/register';
import Craigslist from './src/promotion'
// import Craigslist from './promotion';


function LogoTitle() {
  return (
   
     <View>
        <View style={{flex: 1, flexDirection: 'row'}}>
           
            <View style={{ backgroundColor: 'powderblue'}} >
              <Image
                style={{ width: 50, height: 50 }}
                source={require('./src/logo/logo-7.png')}
              />
            </View>

        </View>    
        <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{ backgroundColor: 'powderblue'}} >
              <Text style={{ fontWeight:'bold',alignSelf:'center'}}>14535</Text>
            </View>
    
        </View>
      </View>
   
   // <View style={{marginBottom:5,marginLeft:5,flexDirection: 'row'}}>
    //   <View style={{flexDirection: 'row'}}>

    //   </View>
    //  <Image
    //   style={{ width: 50, height: 50 }}
    //   source={require('./src/logo/logo-7.png')}
    // />
    // <Text style={{ fontWeight:'bold',alignSelf:'center'}}>14535</Text>
    // </View>
  );
}
function LogoSetiing() {
  return (
    <View>
      <View>
      <TouchableOpacity onPress>
      <Image
        style={{ width: 50, height: 50 ,margin: 10,}}
        source={require('./src/logo/film.png')}
      />
    </TouchableOpacity>
      </View>
      <View >

      </View>
    </View>
   
    
  );
}
export default class App extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn:false,
      userToken: null,
      nav:"register",
      title: "สวัสดีค้าา"
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
        <StatusBar hidden={true} />
      <Stack.Navigator  initialRouteName={'Register/ลงทะเบียน'} >
          {/* <Stack.Screen name="Register/ลงทะเบียน" component={register} /> */}

          <Stack.Screen name="Craigslist" component={Craigslist} 
          
            options={{
                    headerTitleStyle: { 
                      textAlign:"center", 
                      flex:1 
                  },
                    headerTitleAlign: { alignSelf: 'center' },
                    title: this.state.title,
                      headerStyle: {
                        fontWeight: 'bold',
                        padding:20,
                        height:100,
                        // backgroundColor: '#f4511e',
                      },
                    headerLeft: props => <LogoTitle {...props} />,
                
                    headerRight:props => <LogoSetiing {...props} />
                  }}
          />
      </Stack.Navigator>
    </NavigationContainer>
    );

  }
}