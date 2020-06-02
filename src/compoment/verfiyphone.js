            
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
  TouchableOpacity,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
// import RNFetchBlob from 'react-native-fetch-blob'
var DirectSms = NativeModules.DirectSms;

export default class ProfileCardView extends Component {

  constructor(props) {
    super(props);
    this.state={
        SMS4ditgit:'',
        code:'',
        trackerID:'',
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
     this.storeData()
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
        trackerID: this.state.trackerID,
        avatar:this.props.avatar,
    }
   
      const jsonValue = JSON.stringify(data)
      await AsyncStorage.setItem('datakey', jsonValue)
      setTimeout(() => {this.fetchdata()}, 3000);
    } catch (e) {
      console.log('saving error');
    }
  }

  fetchdata = async () => {
    //===============================================================================
          // var data = await RNFS.readFile( this.props.uri, 'base64').then(res => { return res });
          // const  formData = new FormData();
          // formData.append("Tracker_ID","XXAAXXAAXXAAXX");
          // formData.append("name", "test");
          // formData.append("sirname","test");
          // formData.append("old","test");
          // formData.append("gender","test");
          // formData.append("email", "test");
          // formData.append("mobile",  "test");
          // const file = {
          //   uri: this.props.uri.replace("file://", ""),
          //   type: this.props.type, // or photo.type
          //   name: this.props.name
          // }
          // formData.append('avatar', file);
          // // console.log(file);
          //   // return;
          // const serviceResponse = RNFetchBlob.fetch('http://192.168.101.201/CreateUser.php',{
          //   'Content-Type' : 'multipart/form-data',
          // }, [
          //   // element with property `filename` will be transformed into `file` in form data
          //   // { name : 'avatar', filename : 'avatar.png', data: binaryDataInBase64},
          //   // // custom content type
          //   // { name : 'avatar-png', filename : 'avatar-png.png', type:'image/png', data: binaryDataInBase64},
          //   // // part file from storage
          //   { name : 'avatar-foo', filename : this.props.name, type:this.props.type, data: RNFetchBlob.wrap(this.props.uri)},
          //   // elements without property `filename` will be sent as plain text
          //   { name : 'Tracker_ID', data : 'XXAAXXAAXXAAXX'},
          //   { name : 'name', data : 'test'},
          //   { name : 'sirname', data : 'test'},
          //   { name : 'old', data : 'test'},
          //   { name : 'gender', data : 'test'},
          //   { name : 'email', data : 'test'},
          //   { name : 'mobile', data : 'test'}
          // ]).then((resp) => {
          //   // ...
          //   console.log("success",resp);
            
          // }).catch((err) => {
          //   // ...
          //   console.log("fails",err);
            
          // })
          // ,
          // body:formData
          // }, (progressEvent) => {
          //   const progress = progressEvent.loaded / progressEvent.total;
          //   console.log(progress);
          // }).then((res) => console.log(res), (err) => console.log("err",err))
          // .then((serviceResponse) => { 
          //   console.log('=============>',serviceResponse);
          //   // this.props.nav.navigate('Craigslist');
          //   return serviceResponse.json()
          // } ).then((json)=>console.log(json)
          // )
          // .catch((error) => 
          // console.log("fetch error:", error
          // ));
    //===============================================================================
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
futch = (url, opts={}, onProgress) => {
  console.log(url, opts)
  return new Promise( (res, rej)=>{
      var xhr = new XMLHttpRequest();
      xhr.open(opts.method || 'get', url);
      for (var k in opts.headers||{})
          xhr.setRequestHeader(k, opts.headers[k]);
      xhr.onload = e => res(e.target);
      xhr.onerror = rej;
      if (xhr.upload && onProgress)
          xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
      xhr.send(opts.body);
  });
}
convermobile2trackerID(){
    let str1 = this.props.phone+this.state.SMS4ditgit;
    str1 = str1.replace(/0/g, "A");
    str1 = str1.replace(/1/g, "B");
    str1 = str1.replace(/2/g, "C");
    str1 = str1.replace(/3/g, "D");
    str1 = str1.replace(/4/g, "E");
    str1 = str1.replace(/5/g, "F");
    str1 = str1.replace(/6/g, "G");
    str1 = str1.replace(/7/g, "H");
    str1 = str1.replace(/8/g, "I");
    str1 = str1.replace(/9/g, "J");
    // this.state.trackerID = str1;
    this.setState({trackerID:str1});
    
    console.log(this.state.trackerID+"trackerID");
}

async verifypassword () {
  Alert.alert("รหัสถูกต้อง:\n"+this.state.trackerID, "ถูกต้องนะครับบบบบบ ",[{text: "OK", onPress: () =>this.buttonPress()}]);
  // if(this.state.code !== null && this.state.code !== ''){
  //   if(this.state.SMS4ditgit === this.state.code){
  //       await this.convermobile2trackerID();
       
  //   }else{
  //       Alert.alert("รหัสผิดพลาด", "รหัสไม่ถูกต้องน่ะครับบบบ");
  //   }
  // }else{
  //       Alert.alxert("ผิดพลาด", "โปรดกรอกรหัสยืนยันตัวตน");
  //   }
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
                
                <Text style={styles.name}>{this.props.fname} {this.props.lname}</Text>
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