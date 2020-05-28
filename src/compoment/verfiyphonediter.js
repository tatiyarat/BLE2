            
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  NativeModules,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

var DirectSms = NativeModules.DirectSms;

export default class ProfileCardView extends Component {

  constructor(props) {
    super(props);
    this.state={
        SMS4ditgit:'',
        code:'',
    }
    this.buttonPress = this.buttonPress.bind(this);
    this.fails = this.fails.bind(this);
  }

  fails = () => {
    console.log("fails");
    this.props.Onfails()
  }

  Random4ditgit = () => {
    let  generatedPassword = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
      this.setState({SMS4ditgit:generatedPassword})
    console.log("MyApp", "Generated Password : " + generatedPassword);
  }
  buttonPress () {
    this.fetchdata()
    this.storeData()
    console.log('called');
    this.props.nav.navigate('Craigslist');
  }

  fetchdata = async() => {
    try {
      const data = {
        firstname: this.props.firstname,
        lastname: this.props.lastname,
        gender: this.props.gender,
        old: this.props.old,
        tell: this.props.phone,
        email: this.props.email,
        trackerID: this.props.trackerID,
        avatar:this.props.avatar,
    }
    // http://192.168.101.201/reciveLog.php
      const jsonValue = JSON.stringify(data)
      await AsyncStorage.setItem('datakey', jsonValue)
      
    } catch (e) {
      // saving error
      console.log('saving error');
    }
  }

  storeData = async () => {
    try {
      const data = {
        firstname: this.props.fname,
        lastname: this.props.lname,
        gender: this.props.gender,
        old: this.props.old,
        tell: this.props.phone,
        email: this.props.email,
        trackerID: this.props.trackerID,
        avatar:this.props.avatar,
    }
      const jsonValue = JSON.stringify(data)
      await AsyncStorage.setItem('datakey', jsonValue)
      
    } catch (e) {
      // saving error
      console.log('saving error');
    }
  }
  sendDirectSms = async () => {
    try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
            {
                title: 'SMS Permission',
                message:
                'Application needs access to your inbox ' +
                'so you can send messages in background.',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.Random4ditgit()
            if(this.props.phone){
              DirectSms.sendDirectSms(this.props.phone, this.state.SMS4ditgit);
            }else{
              Alert.alert("Error", "ไม่มีเบอร์");
            }
        } else {
            console.log('SMS permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}


verifypassword () {
  if(this.state.code !== null && this.state.code !== ''){
    if(this.state.SMS4ditgit === this.state.code){
 
        Alert.alert("รหัสถูกต้อง: ", "ถูกต้องนะครับบบบบบ ",[{text: "OK", onPress: () =>this.buttonPress()}]);
    }else{
        Alert.alert("รหัสผิดพลาด", "รหัสไม่ถูกต้องน่ะครับบบบ");
    }
  }else{
        Alert.alert("ผิดพลาด", "โปรดกรอกรหัสยืนยันตัวตน");
    }
}

  
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={{ padding:20,flex: 1,}}>

            <View style={styles.box}>
                  {this.props.avatar === null ? (
                        <>
                      <Image style={styles.profileImage} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
                        </>
                    ) : (
                      <Image style={styles.profileImage} source={this.props.avatar} />
                  )}
                
                <Text style={styles.name}>{this.props.fname}{this.props.lname}</Text>
                <Text style={styles.subname}>จะได้รับรหัสยืนยันผ่านระบบ SMS </Text>
                <Text style={{ fontSize:14,color:'#1E90FF',marginBottom:20,}}>จากเบอร์โทรศัพท์  {this.props.phone}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="XXXX"
                        underlineColorAndroid='transparent'
                        onChangeText={(code) => this.setState({code})}
                       />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.buttonMessage]} 
                onPress={() => this.sendDirectSms()}
                >
                    <Text>รับรหัสยืนยัน</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.buttonback]} 
                onPress={()=>this.fails()}
                >
                    <Text>ย้อนกลับ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.buttonCall]} 
                onPress={()=>this.verifypassword()}
                >
                    <Text>ยืนยันตัวตน</Text>
                </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer:{
    flex: 1,
  },
  container:{
    padding:20,
  },
  box: {
    marginTop:10,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: .2,
    shadowOffset: {
      height:1,
      width:-2
    },
    elevation:2,
    paddingTop:10
  },
  profileImage:{
    width:200,
    height:200,
    marginBottom:20,
    marginTop:20,
  },
  name:{
    fontSize:25,
    marginBottom:20,
    fontWeight: 'bold',
    color: '#1E90FF',
  },subname:{
    fontSize:14,
    color: '#1E90FF',
  },
  buttonContainer:{
    justifyContent: 'center',
    
    flexDirection:'row',
    marginTop:20,
  },inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:150,
    marginBottom:20,
    alignItems:'center',

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    

},button: {
    width:85,
    height:50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    // borderRadius:30,
    margin:10,
    shadowColor: 'black',
    shadowOpacity: .8,
    shadowOffset: {
      height:2,
      width:-2
    },
    elevation:4,
  },
  buttonMessage: {
      fontSize: 16,
    backgroundColor: "#00BFFF",
  },
  buttonLike: {
    backgroundColor: "#228B22",
  },
  buttonLove: {
    backgroundColor: "#FF1493",
  },
  buttonCall: {
    backgroundColor: "#40E0D0",
  },buttonback: {
    backgroundColor: "#F0FB82",
  },
  icon: {
    width:35,
    height:35,
  }
}); 