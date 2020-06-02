import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  PixelRatio,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {Picker} from '@react-native-community/picker';
import ProfileCardView from './compoment/verfiyphone'
import AsyncStorage from '@react-native-community/async-storage';

export default class register extends Component {

  constructor(props) {
    super(props);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);

    this.state = {
      firstname:'',
      lastname:'',
      old:'0-10',
      gender:'Male',
      email: '',
      avatarSource: null,
      mobilenumber:'',
      showImage:true,
      uri:null,
      type:null,
      name:null,
      source64:null,
    }
    this.handleShowImage = this.handleShowImage.bind(this)
  }

  handleShowImage = () =>{
    this.setState({showImage: true})
    console.log(this.state.showImage);
  }

  onClickListener = () => {
    this.props.navigation.navigate('Craigslist');
  }
  handleSignUp () {
    // console.log(this.state);
    if(this.state.firstname === null || this.state.firstname == ""){
      Alert.alert("ผิดพลาด", "โปรดกรอก ชื่อ");
    }else if(this.state.lastname === null || this.state.lastname == ''){
      Alert.alert("ผิดพลาด", "โปรดกรอก นามสกุล");
    }else if(this.state.email === null || this.state.email == ''){
      Alert.alert("ผิดพลาด", "โปรดกรอก อีเมล์");
    }else if(this.state.avatarSource === null || this.state.avatarSource == ''){
      Alert.alert("ผิดพลาด", "โปรดกรอกใส่รูปภาพ");
    }else if(this.state.mobilenumber === null || this.state.mobilenumber == ''){
      Alert.alert("ผิดพลาด", "โปรดกรอก เบอร์มือถือ");
    }else{
      // console.log(this.state);
      this.setState({showImage:false})
    }
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        const uri = response.uri;
        const type = response.type;
        const name = response.fileName;

        // You can also display the image using data:
        let source64 = 'data:image/jpeg;base64,' + response.data ;
        this.setState({source64:source64})
        this.setState({uri:uri})
        this.setState({name:name})
        this.setState({type:type})
        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  
  render() {
    const showImage = this.state.showImage;
    return (
      <>
      {showImage 
        ? <ScrollView>
            <View style={styles.container}>
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                  <View
                    style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
                    {this.state.avatarSource === null ? (
                        <>
                            <Text>Select a Photo</Text>
                            <Text>ใส่รูปภาพ</Text>
                        </>
                    ) : (
                      <Image style={styles.avatar} source={this.state.avatarSource} />
                    )}
                  </View>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <TextInput style={styles.inputs}
                    placeholder="Phone/เบอร์โทร"
                    keyboardType = 'numeric'
                    underlineColorAndroid='transparent'
                    onChangeText={(mobilenumber) => this.setState({mobilenumber})}/>
              </View>

              <View style={styles.inputContainer}>
                <TextInput style={styles.inputs}
                    placeholder="Firstname/ชื่อ"
                    underlineColorAndroid='transparent'
                    onChangeText={(firstname) => this.setState({firstname})}/>
                <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/40/000000/circled-user-male-skin-type-3.png'}}/>
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput style={styles.inputs}
                    placeholder="Lastname/นามสกุล"
                    underlineColorAndroid='transparent'
                    onChangeText={(lastname) => this.setState({lastname})}/>
                <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/40/000000/circled-user-male-skin-type-3.png'}}/>
              </View>

              <View  style={styles.inputContainer}>
                <Text style={styles.inputspiker}>Gender/เพศ</Text>
                <Picker
                    selectedValue={this.state.gender}
                    style={{height: 50, width: 130}}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({gender: itemValue})
                    }>
                    <Picker.Item label="Male/ชาย" value="Male" />
                    <Picker.Item label="Female/หญิง" value="Female" />
                </Picker>
              </View>
            
              <View style={styles.inputContainer}>
                  <Text style={styles.inputspiker}>Old/ช่วงอายุ</Text>
                <Picker
                    selectedValue={this.state.old}
                    style={{height: 50, width: 150}}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({old: itemValue})
                    }>
                    <Picker.Item label="0-10 ปี/Old" value="0-10" />
                    <Picker.Item label="11-20 ปี/Old" value="11-20" />
                    <Picker.Item label="21-30 ปี/Old" value="21-30" />
                    <Picker.Item label="31-40 ปี/Old" value="31-40" />
                    <Picker.Item label="41-50 ปี/Old" value="41-50" />
                    <Picker.Item label="51-60 ปี/Old" value="51-60" />
                    <Picker.Item label="61-70 ปี/Old" value="61-70" />
                    <Picker.Item label="71-80 ปี/Old" value="71-80" />
                    <Picker.Item label="91-100 ปี/Old" value="91-100" />
                </Picker>   
              
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput style={styles.inputs}
                    placeholder="Email/อีเมล์"
                    keyboardType="email-address"
                    underlineColorAndroid='transparent'
                    onChangeText={(email) => this.setState({email})}/>
                <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/flat_round/40/000000/secured-letter.png'}}/>
              </View>

              <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.handleSignUp()}>
                <Text style={styles.btnText}>OK</Text>
              </TouchableOpacity>
          
          </View>
          </ScrollView>
        :
          <ProfileCardView 
          fname={this.state.firstname}
          lname={this.state.lastname}
          phone={this.state.mobilenumber+''}
          gender={this.state.gender}
          email={this.state.email}
          avatar={this.state.avatarSource}
          mobilenumber={this.state.mobilenumber}
          old={this.state.old}
          Onfails={()=>this.handleShowImage()}
          nav={this.props.navigation}
          uri={this.state.uri}
          type={this.state.type}
          name={this.state.name}
          source64={this.state.source64}
          />
      }
     </>
    );
  }
}


const resizeMode = 'center';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    height: '100%',
  },avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:15,

  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:300,
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },inputradio: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:300,
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },inputspiker:{
    color:'#C3C6C8',
    flex:1,
    marginLeft:16,
  },
  inputs:{
    height:45,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginRight:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:300,
    borderRadius:30,
    backgroundColor:'transparent'
  },
  btnForgotPassword: {
    height:15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom:10,
    width:300,
    backgroundColor:'transparent'
  },
  loginButton: {
    backgroundColor: "#00b5ec",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.50,
    shadowRadius: 12.35,

    elevation: 19,
  },
  loginText: {
    color: 'white',
  },
  bgImage:{
    flex: 1,
    resizeMode,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btnText:{
    color:"white",
    fontWeight:'bold'
  }, box: {
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
    width:300,
    height:300,
    marginBottom:20,
  },name:{
    fontSize:25,
    marginBottom:20,
    fontWeight: 'bold',
    color: '#1E90FF',
  },subname:{
    fontSize:14,

    color: '#1E90FF',
  },
  buttonContainer211:{
    justifyContent: 'center',
    flexDirection:'row',
    marginTop:20,
  },
  button: {
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
  buttonCall: {
    backgroundColor: "#40E0D0",
  },
}); 