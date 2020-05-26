            
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Alert,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  NativeModules
} from 'react-native';
import SendSMS from 'react-native-sms';
var DirectSms = NativeModules.DirectSms;

export default class ProfileCardView extends Component {

  constructor(props) {
    super(props);
    this.state={
        mobilenumber:'0867902524',
        SMS4ditgit:'',
        code:'',
        trackerID:'',
    }
        
  }
  Random4ditgit = () => {
    let  generatedPassword = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
      this.setState({SMS4ditgit:generatedPassword})
    console.log("MyApp", "Generated Password : " + generatedPassword);
  
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
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.Random4ditgit()
            DirectSms.sendDirectSms(this.state.mobilenumber, this.state.SMS4ditgit);
        } else {
            console.log('SMS permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}
convermobile2trackerID(){
    let str = this.state.mobilenumber;
     str = str.replace(/0/g, "A");
     str = str.replace(/1/g, "B");
     str = str.replace(/2/g, "C");
     str = str.replace(/3/g, "D");
     str = str.replace(/4/g, "E");
     str = str.replace(/5/g, "F");
     str = str.replace(/6/g, "G");
     str = str.replace(/7/g, "H");
     str = str.replace(/8/g, "I");
     str = str.replace(/9/g, "J");
     this.state.trackerID = str;
    // this.setState({trackerID:str});
    
    console.log(this.state.trackerID );
}

verifypassword(){
    if(this.state.code != null || this.state.code != ''){
        if(this.state.SMS4ditgit === this.state.code){
            this.convermobile2trackerID();
            
            Alert.alert("รหัสถูกต้อง: "+this.state.trackerID, "ถูกต้องนะครับบบบบบ ",[{text: "OK"}]);
            
        }else{
            Alert.alert("รหัสผิดพลาด", "รหัสไม่ถูกต้องน่ะครับบบบ");
        }
    }else{
        Alert.alert("Error", "โปรดกรอกรหัสยืนยันตัวตน");
    }
}

  
  
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={{ padding:20,flex: 1,}}>

            <View style={styles.box}>
                <Image style={styles.profileImage} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
                <Text style={styles.name}>คุณ สุพิน วรรณา</Text>
                <Text style={styles.subname}>จะได้รับรหัสยืนยันผ่านระบบ SMS </Text>
                <Text style={{ fontSize:14,color:'#1E90FF',marginBottom:20,}}>จากเบอร์โทรศัพท์  0867902524</Text>
            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder={this.state.SMS4ditgit}
                        underlineColorAndroid='transparent'
                        onChangeText={(code) => this.setState({code})}
                       />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableHighlight style={[styles.button, styles.buttonMessage]} onPress={() => this.sendDirectSms()}>
                    <Text>รับรหัสยืนยัน</Text>
                </TouchableHighlight>

                <TouchableHighlight style={[styles.button, styles.buttonCall]} onPress={() => this.verifypassword()}>
                    <Text>ยืนยันตัวตน</Text>
                </TouchableHighlight>
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
  },
  icon: {
    width:35,
    height:35,
  }
}); 