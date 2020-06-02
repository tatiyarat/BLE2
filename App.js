
import * as React from 'react';
import { StyleSheet,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// import SignUp from './src/';
import register from './src/register';
import Menu from './src/promotion'
import editer from './src/editer'
import Loading from './src/compoment/loading'
export default class App extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
      nav:"",
    }
  }
  render() {
    const Stack = createStackNavigator();
      return (
        <NavigationContainer>
          <StatusBar hidden={true} />
          <Stack.Navigator  initialRouteName={"Loading"} headerMode={'none'}>
              <Stack.Screen name="Loading" component={Loading}/>
              <Stack.Screen name="Register"  component={register}/>
              <Stack.Screen name="Craigslist" component={Menu} />
              <Stack.Screen name="editprofile" component={editer} />
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