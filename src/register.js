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
  AsyncStorage,
  PixelRatio 
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
// import { RadioButton} from 'react-native-paper';
// import { Dropdown } from 'react-native-material-dropdown';
import {Picker} from '@react-native-community/picker';

export default class register extends Component {

  constructor(props) {
    super(props);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);

    this.state = {
      firstname:'',
      lastname:'',
      old:'',
      gender:'Male',
      email: '',
      password: '',
      confirmPassword: '',
      avatarSource: null,
      tell:'',
    }
  }


  onClickListener = () => {
    this.props.navigation.navigate('Home');
  }
  handleSignUp = async (value) => {
    // console.log(value.firstname +'asfdsafa');
    // if(value.firstname == null && value.firstname == "") {
    //   Alert.alert("Error", "not have firstname ");
    // }else if (value.lastname == null || value.lastname == "") {
    //   Alert.alert("Error", "not have lastname ");
    // }else if (value.Code == null || value.Code == "") {
    //   Alert.alert("Error", "not have Code ");
    // }else if (value.tell == null || value.tell == "") {
    //   Alert.alert("Error", "not have tell ");
    // }else if (value.email == null || value.email == "") {
    //   Alert.alert("Error", "not have email ");
    // }else if (value.confirmPassword == null || value.confirmPassword == "") {
    //   Alert.alert("Error", "not have confirmPassword ");
    // }else if (value.password == null || value.password == "") {
    //   Alert.alert("Error", "not have password ");
    // }else if (value.avatarSource == null) {
    //   Alert.alert("Error", "not have avatar");
    // }
    // console.log(value);
    // Make sure passwords match
    if (value.password === value.confirmPassword) {
        const register = {
          // username: 'namtest',
          firstname: value.firstname,
          lastname: value.lastname,
          gender: value.gender,
          old: value.old,
          tell: value.tell,
          email: value.email,
          passwordConf:value.confirmPassword,
          password:value.password,
  
      }
       const requestOptions = {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           },
          body: JSON.stringify(register)
      };
    
      try {
        const response = await fetch('http://203.150.55.44:3001/register',requestOptions)
        console.log(response.json())
        const data = await response.json()
        if (data.statusCode == 200) {
          Alert.alert("success", "Register success",[{text: "OK", onPress: () => this.onClickListener()}]);
        }else{
          Alert.alert("ERROR",data.message)
        }
        // console.log(data)
        
      
      } catch (error) {
        Alert.alert("Error", "Wrong email or password ");
      }
    } else {
      alert('Passwords do not match.');
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
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  render() {

    return (
      // <PaperProvider >
        <ScrollView>
      <View style={styles.container}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
              <View
                style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
                {this.state.avatarSource === null ? (
                  <Text>Select a Photo</Text>
                ) : (
                  <Image style={styles.avatar} source={this.state.avatarSource} />
                )}
              </View>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="tell/เบอร์โทร"
                underlineColorAndroid='transparent'
                onChangeText={(tell) => this.setState({tell})}/>
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
            <Text style={styles.inputs}>Gender/เพศ</Text>
            <Picker
                selectedValue={this.state.gender}
                style={{height: 50, width: 100}}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({gender: itemValue})
                }>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              
            </Picker>
          </View>
        
          <View style={styles.inputContainer}>
              <Text style={styles.inputs}>Old/ช่วงอายุ</Text>
            <Picker
                selectedValue={this.state.old}
                style={{height: 50, width: 100}}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({old: itemValue})
                }>
                <Picker.Item label="0-10 ปี" value="0-10" />
                <Picker.Item label="11-20 ปี" value="11-20" />
                <Picker.Item label="21-30 ปี" value="21-30" />
                <Picker.Item label="31-40 ปี" value="31-40" />
                <Picker.Item label="41-50 ปี" value="41-50" />
                <Picker.Item label="51-60 ปี" value="51-60" />
                <Picker.Item label="61-70 ปี" value="61-70" />
                <Picker.Item label="71-80 ปี" value="71-80" />
                <Picker.Item label="91-100 ปี" value="91-100" />
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
          
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Password/รหัส"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({password})}/>
            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/40/000000/password.png'}}/>
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="ConfirmPassword/ยืนยันรหัสผ่าน"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(confirmPassword) => this.setState({confirmPassword})}/>
            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/40/000000/password.png'}}/>
          </View>

          <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.handleSignUp(this.state)}>
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>
       
      </View>
      </ScrollView>
      // </PaperProvider>
      
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
  },avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
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
  }
}); 