
import * as React from 'react';
import { StyleSheet,Image,TouchableOpacity,Text,StatusBar,View,TouchableHighlight} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// import SignUp from './src/';
import register from './src/register';
import Craigslist from './src/promotion'

function Title(props) {
  return(
   <>
    <View style={{textAlign:"center", 
                      flex:1,
                      alignSelf: 'center'  }}>
      <Text style={{  fontWeight: 'bold',}}>
        {props.title}
      </Text>
      <Text style={{  fontWeight: 'bold',}}>
        {props.rssi}
      </Text>
    </View>
   </>
  );
}

function LogoTitle(props) {
  return (
     <View style={{marginLeft:5}}>
        <View style={{ flexDirection: 'row'}}>
            <View style={{ }} >
              <Image
                style={{ width: 50, height: 45,marginTop: 5,}}
                source={require('./src/logo/logo-7.png')}
              />
            </View>
        </View>    
        <View style={{ flexDirection: 'row',alignSelf:'center'}}>
            <Text>{props.locationNo}</Text>
        </View>
      </View>
  );
}
function LogoSetiing(props) {
  return (
    <View  style={{textAlign:"center", 
    flex:1,
    alignSelf: 'center'  }}>
      <TouchableOpacity onPress>
        <Image
          style={styles.editcircle}
          source={require('./src/logo/te.jpg')}
        />
      </TouchableOpacity>
      <View>
        <Text style={{ fontWeight:'bold',alignSelf:'center'}}>{props.rssi}</Text>
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
      nav:AsyncStorage.getItem('datakey')==null?"register":"Craigslist",
      title: "สวัสดีค้าา",
      rssi:"scanning",
      locationNo:"?"
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
  }
  handleTitleChange = (event) =>{
    setState({title:event})
  }
  componentDidMount(){
    console.log(this.state.nav)

  }
  componentWillUnmount(){
   
    console.log("componentWillUnmount")
  }



  render() {
    const Stack = createStackNavigator();
    return (
      <NavigationContainer>
      <StatusBar hidden={true} />
      <Stack.Navigator  initialRouteName={this.state.nav} >

          <Stack.Screen name="Register" 
          component={register}/>

          <Stack.Screen name="Craigslist" component={Craigslist} 
          
            options={{headerStyle: {
                        height:100,
                      },
                    headerTitle: props => <Title  title={this.state.title} />,
                    headerLeft: props => <LogoTitle  locationNo={this.state.locationNo}/>,
                    headerRight: props => <LogoSetiing  rssi={this.state.rssi}/>
                  }}
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