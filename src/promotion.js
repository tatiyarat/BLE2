import React, { Component } from 'react';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import BleManager from 'react-native-ble-manager';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  NativeModules,NativeEventEmitter,Platform,PermissionsAndroid,
  Modal
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
var {height, width} = Dimensions.get('window');

// BLE
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);



export default class  Menu extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      serverAddr: "192.168.101.201",
      title: "สวัสดีค้าา",

      def_Location: "000",
      def_Order: "00",
      def_Message: "ShellHut",
      def_RSSI: 0,

      cur_Location: "",
      cur_Order: "",
      cur_Message: "",
      cur_RSSI: 0,
      
      get_Location: "",
      get_Order: "",
      get_Message: "",
      get_RSSI: 0,

      timeToScan: 5,
   
      peripherals: new Map(),
      appState: '',
      btEnabled: false,
      minRSSI: -71,
      status:"...",

      modalVisible: false,


      firstname:'',
      lastname:'',
      old:'',
      gender:'',
      email: '',
      avatarSource: null,
      mobilenumber:'',
      trackerID:'',
    }
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    // this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.getUser = this.getUser.bind(this)
  } 


  getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('datakey');
      if (value !== null) {
        // We have data!!
        return value != null ? JSON.parse(value) : null
        console.log(value);
      }
    } catch (error) {
      return null;
      // Error retrieving data
    }
  };
  componentDidMount(){
    // console.log("User ",this.getUser());
    this.getUser().then((rep) => {
      this.setState({firstname:rep.firstname})
      this.setState({lastname:rep.lastname})
      this.setState({old:rep.old})
      this.setState({gender:rep.gender})
      this.setState({email:rep.email})
      this.setState({avatarSource:rep.avatarSource})
      this.setState({mobilenumber:rep.tell})
      this.setState({trackerID:rep.trackerID})
      // console.log(rep);
    });

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);

    BleManager.start({ showAlert: true }).then(() => {console.log('Module initialized');});

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }
    this.checkInitialBluetoothState()
  }

  componentWillUnmount(){
    this.handleStopScan();
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  
  startScan() {
    if(this.state.cur_Location == '') {
      this.showDefaultURL()
    }
    this.setState({get_Location: ""})
    this.setState({get_Order: ""})
    this.setState({get_Message: ""})
    this.setState({get_RSSI: this.state.minRSSI})
    BleManager.scan([], this.state.timeToScan, true).then(() => {
      this.setState({status:"Scanning..."})
        console.log('Scanning...');
    });
  } //startScan

  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals;
    if (typeof peripheral.name == "string" && peripheral.name.indexOf("Holy") >= 0) {
      
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });

        // console.log(peripheral.name+"  == ALL "+peripheral.rssi);

        if (peripheral.rssi > this.state.get_RSSI) {
            // console.log(peripheral.name+"  == RSSI"+peripheral.rssi);
            this.setState({ get_RSSI: peripheral.rssi});
            this.setState({ get_Location: peripheral.name.split(":")[1]});
            this.setState({ get_Order: peripheral.name.split(":")[2]});
            this.setState({ get_Message: peripheral.name.split(":")[3]});
        }
    }
  }

  handleStopScan() {
    
    let {get_Location,get_Order,get_Message,get_RSSI,cur_Location,cur_Order,cur_Message,cur_RSSI} = this.state

    // setTimeout(()=>{
    //   console.log('=======================')
    //   console.log('rescan !<GET>'+ get_Location +" : " + get_Order);
    //   console.log('rescan !<CUR>'+ cur_Location +" : " + cur_Order);
    //   console.log('=======================')
    // },1000)

    this.setState({status:"Rescan..."})
    if (get_Location == "" ) {
      if (cur_Location != "000") {
        this.showDefaultURL();
      }  
    } else {
      if (get_Location != cur_Location) {
        this.showLocationURL(get_Location,get_Order,get_Message,get_RSSI);
      } else {
          this.setState({cur_Order: get_Order})
          this.setState({cur_RSSI: get_RSSI})
          this.setState({cur_Message: get_Message})
      }
    }
    this.fetchdata('fast_pass')

    this.setState({ peripherals: new Map() })
    this.startScan()
  } //function


  showLocationURL(get_Location,get_Order,get_Message,get_RSSI) {
    this.setState({cur_Location: get_Location})
    this.setState({cur_Order: get_Order})
    this.setState({cur_Message: get_Message})      
    this.setState({cur_RSSI: get_RSSI})      
  }

  showDefaultURL() {
    this.setState({cur_Location: this.state.def_Location})
    this.setState({cur_Order: this.state.def_Order})
    this.setState({cur_Message: this.state.def_Message})      
    this.setState({cur_RSSI: this.state.def_RSSI})      
  }


  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }
  
  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
    }
    // console.log('Disconnected from ' + data.peripheral);
  }

  async checkInitialBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    // console.log("check bluetooth on or off", isEnabled);
    if (isEnabled == true) {
      // console.log("check bluetooth on ", isEnabled);
      this.startScan()
    } else {
      Alert.alert(
        'Bluethooth',
        'Bluetooth is turn off'
      );
    }
  }

  fetchdata = async (event) => {
//===============================================================================
      const userProfile = await this.getUser();
      const formData = new FormData();
      const userDateTime = new Date();
      const {cur_Location,cur_Order,cur_Message,cur_RSSI} = this.state
      formData.append("t_id", userProfile.trackerID);
      formData.append("s_id", cur_Location);
      formData.append("s_zone", cur_Order);
      formData.append("date", moment().format('YYYY/MM/DD,HH:mm'));
      formData.append("event", event);
      console.log(userDateTime);

      const serviceResponse= fetch('http://192.168.101.201/reciveLog.php',
      {
      method: 'POST',
      body: formData,
      })
      .then((serviceResponse) => { 
        console.log(serviceResponse);
        if(cur_RSSI > -50){
          if (event == 'chk_out') {
            Alert.alert("Check-Out: ลงเวลาออก","คุณ "+userProfile.firstname+" "+userProfile.lastname +"\nที่จุด ["+cur_Location+"] "+cur_Message+"\nณ วันที่ "+moment().format('DD/MM/YYYY, HH:mm'))
          } else if (event == 'chk_in'){
            Alert.alert("Check-In: ลงเวลาเข้า","คุณ "+userProfile.firstname+" "+userProfile.lastname +"\nที่จุด ["+cur_Location+"] "+cur_Message+"\nณ วันที่ "+moment().format('DD/MM/YYYY, HH:mm'))
          } else{
  
          }
        }else{
          if (event == 'chk_out') {
            Alert.alert("Error","ไม่สามารถ Check-Out ได้คลื่นสัณญาต่ำ")
          } else if (event == 'chk_in'){
            Alert.alert("Error","ไม่สามารถ Check-In ได้คลื่นสัณญาต่ำ")
          } else{
  
          }
        }
       
        return serviceResponse.json() 
      } )
      .catch((error) => console.warn("fetch error:", error))
      .then((serviceResponse) => {
      console.log(JSON.stringify(serviceResponse));
      });
//===============================================================================
  }
  gotoeditor(visible){
    this.setState({ modalVisible: visible });
    this.props.navigation.navigate('editprofile');
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  render() {
  // console.log('http://192.168.101.201/'+this.state.cur_Location+'/index.html')
  const date = new Date();
  const { modalVisible,cur_Location,cur_Message,cur_Order,cur_RSSI,firstname,lastname,avatarSource } = this.state;
    return(
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{marginTop:10,flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{ ...styles.openButton, backgroundColor: "#2196F3"}}
                    onPress={() => this.gotoeditor(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>แก้ไขโปรไฟล์</Text>
                  </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: "#08CC3B" }}
                  onPress={() => {
                    this.fetchdata('chk_in');
                  }}
                >
                <Text style={styles.textStyle}>Check in</Text>
                </TouchableOpacity>
              </View>
              
              <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{ ...styles.openButton, backgroundColor: "#E5AC0A" }}
                    onPress={() => {
                      this.fetchdata('chk_out');
                    }}
                  >
                  <Text style={styles.textStyle}>Check out</Text>
                  </TouchableOpacity>
              </View>
              
      

              <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{ ...styles.openButton, backgroundColor: "#F45C44" }}
                    onPress={() => {
                      this.setModalVisible(!modalVisible);
                    }}
                  >
                  <Text style={styles.textStyle}>ยกเลิก</Text>
                </TouchableOpacity>
              </View>
              
            </View>
          </View>
        </Modal>
      

      {/* headers */}
      <View  style={{ flexDirection: 'row', backgroundColor: '#BABABA',justifyContent:'center'}}>

        <View style={{margin:5,padding:10}}>
          <View style={{ flexDirection: 'row'}}>
              <View>
                <Image
                  style={{ width: 50, height: 45,marginTop: 5,margin: 5,borderRadius: 50,}}
                  // source={{uri: 'https://img.icons8.com/color/40/000000/circled-user-male-skin-type-3.png'}}
                  source={{uri:'http://192.168.101.201/'+cur_Location+'/logo/default.png?'+date.getTime()}}
                />
              </View>
          </View>    
          <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'center'}}>
              <Text>{cur_Message}</Text>
          </View>
        </View>

        <View style={{textAlign:"center", flex:2,justifyContent:'center',alignItems: 'center'}}>
          {cur_Location != '000'?(
            <>
              <Text style={{  fontWeight: 'bold',alignSelf:'center'}}>
                สวัสดีค้า
              </Text>
              <Text style={{  fontWeight: 'bold',alignSelf:'center'}}>
                คุณ {firstname}  {lastname}
              </Text>
            </>
            ):(
            <>
            
            </>
          )}
          
        </View>

        <View  style={{textAlign:"center", flex:1,alignItems: 'center',}}>
            <TouchableOpacity onPress={() => {this.setModalVisible(true)}}>
              <Image
                style={styles.editcircle}
                source={avatarSource}
              />
            </TouchableOpacity>
            <View>
              <Text style={{ fontWeight:'bold',alignItems:'center',marginBottom:10}}>
                {cur_Order}
                {cur_RSSI} 
                {/* (m) */}
              </Text>
            </View>

        </View>

      </View>

    <Text> Status:{this.state.status } </Text>
    <Text> Location:{this.state.cur_Location }</Text>
    <Text> Message:{this.state.cur_Message} </Text>
    <Text> Rssi:{this.state.cur_RSSI} </Text>
    <Text> Order:  {this.state.cur_Order}</Text>
    <WebView source={{ uri: 'http://192.168.101.201/'+cur_Location+'?'+date.getTime()}} />

    </>
    )
  }
 
} 

 
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },editcircle: {
    width: 50, 
    height: 50,
    margin: 10,
    borderRadius: 50,
    borderWidth:2, 
    borderColor:"#3F3F3E",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },headers: {
    flexDirection: 'row', 
    backgroundColor: '#BABABA',
    

  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 5,
    marginBottom:10,
    width: 100, 
    height: 50,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    justifyContent:"center",
    textAlign: "center",
    alignItems: 'center'
  },
});
   


