import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Dimensions,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';

var {height, width} = Dimensions.get('window');

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uri : props.uri
    };
  }

  componentDidMount() {
    // console.log(this.state.uri);
    
  }
  render() {
    return <WebView source={{ uri: 'http://203.150.55.44/'+this.state.uri+'.html' }} />;
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:20,
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor:"#E6E6E6",
  },

  /******** card **************/
  card:{
    width: width,
    height:150,
    flexDirection:'row',
    padding:20,

    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardImage:{
    height: 70,
    width: 70,
  },
  title:{
    fontSize:28,
    flex:1,
    color:"#FFFFFF",
    fontWeight:'bold',
    marginLeft:40
  },
  subTitle:{
    fontSize:12,
    flex:1,
    color:"#FFFFFF",
  },
  icon:{
    height: 20,
    width: 20, 
  }
});     
 