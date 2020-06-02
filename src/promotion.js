import React, { Component,useState } from 'react';
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
  Modal,
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
      title: "สวัสดีค่ะ",

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

      timeToScan: 15,
      waitToScan: 2000,
      chkScanBLE: 0,
    
      peripherals: new Map(),
      appState: '',
      btEnabled: false,
      minRSSI: -71,
      buffRSSI: -71,
      minChkInOut: -61,
      status:"...",
      chkRescan: 1,

      modalVisible: false,

      firstname:'',
      lastname:'',
      old:'',
      gender:'',
      email: '',
      avatarSource: null,
      mobilenumber:'',
      trackerID:'',
      isScaning:false,
    }
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.getUser = this.getUser.bind(this)
  } 

  getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('datakey');
      if (value !== null) {
        return value != null ? JSON.parse(value) : null
      }
    } catch (error) {
      return null;
    }
  };

  componentDidMount() {
    this.props.navigation.addListener('focus', this.onScreenFocus)
    this.getUser().then((rep) => {
      this.setState({firstname:rep.firstname})
      this.setState({lastname:rep.lastname})
      this.setState({old:rep.old})
      this.setState({gender:rep.gender})
      this.setState({email:rep.email})
      this.setState({avatarSource:rep.avatar})
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
    this.startScan()
  }
  onScreenFocus = () => {
    this.getUser().then((rep) => {
      this.setState({firstname:rep.firstname})
      this.setState({lastname:rep.lastname})
      this.setState({old:rep.old})
      this.setState({gender:rep.gender})
      this.setState({email:rep.email})
      this.setState({avatarSource:rep.avatar})
      this.setState({mobilenumber:rep.tell})
      this.setState({trackerID:rep.trackerID})

    });
    BleManager.enableBluetooth()
    this.setState({chkRescan: 1})
    BleManager.stopScan()
  }

  componentWillUnmount() {
    this.handleStopScan();
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }
  
  startScan() {
    if(this.state.cur_Location == '') {
      this.setState({cur_Location: this.state.def_Location})
      this.setState({cur_Order: this.state.def_Order})
      this.setState({cur_Message: this.state.def_Message})      
      this.setState({cur_RSSI: this.state.def_RSSI})      
    }
    this.setState({get_Location: ""})
    this.setState({get_Order: ""})
    this.setState({get_Message: ""})
    this.setState({get_RSSI: this.state.minRSSI})
    BleManager.scan([], this.state.timeToScan, true).then(() => {
      this.setState({status:"Scanning.."})
    });
  } //startScan

  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals;
    this.setState({chkScanBLE: 1});
    if (typeof peripheral.name == "string" && peripheral.name.indexOf("Holy") >= 0) {
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });

        var local_RSSI = peripheral.rssi
        var local_Location = peripheral.name.split(":")[1]
        var local_Order = peripheral.name.split(":")[2]
        var local_Message = peripheral.name.split(":")[3]
        var chk_RSSI = this.state.minRSSI
        
        if (local_RSSI > chk_RSSI) {
            this.setState({ get_RSSI: local_RSSI});
            this.setState({ get_Location: local_Location});
            this.setState({ get_Order: local_Order});
            this.setState({ get_Message: local_Message});
            if ( (local_Location != this.state.cur_Location) || (local_Order != this.state.cur_Order) || (local_RSSI > this.state.cur_RSSI) ) {
              if (local_Location == "CHKI" || local_Location =="CHKO") {
                    if (local_RSSI > this.state.minChkInOut) {BleManager.stopScan()}                 
              } else {
                BleManager.stopScan()
              }
            }
        }
    }
  }

  handleStopScan() {
    if (this.state.chkScanBLE == 1 && this.state.chkRescan == 1) {
      const {get_Location,get_Order,get_Message,get_RSSI,cur_Location,cur_Order,cur_Message,cur_RSSI} = this.state
      if (get_Location == "" || get_Location == null) {
        if (cur_Location != "000") {
          this.setState({cur_Location: this.state.def_Location})
          this.setState({cur_Order: this.state.def_Order})
          this.setState({cur_Message: this.state.def_Message})      
          this.setState({cur_RSSI: this.state.def_RSSI})      
        }
      } else if ((get_Location != cur_Location) || (cur_Order != get_Order) || (get_RSSI > cur_RSSI)) {
          this.setState({cur_Location: get_Location})
          this.setState({cur_Order: get_Order})
          this.setState({cur_Message: get_Message})      
          this.setState({cur_RSSI: get_RSSI})
      }
      this.fetchdata('fast_pass',cur_Location,cur_Order,cur_RSSI)
    }
    this.setState({ peripherals: new Map() })
    this.setState({chkScanBLE: 0})
    this.setState({status:"Waiting.."})
    if(this.state.chkRescan == 1) {
      setTimeout(() => {this.startScan()}, this.state.waitToScan);
    }
  } //function

  setModalVisible = (visible) => {
    if (visible) {
      this.setState({chkRescan: 0})
    } else {
      this.setState({chkRescan: 1})
    }
    setTimeout(() => {BleManager.stopScan()}, 100);
    this.setState({ modalVisible: visible });
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
  }



  fetchdata = async (event,cur_Location,cur_Order,cur_RSSI) => {
      const formData = new FormData();
      const {cur_Message,minChkInOut} = this.state
      formData.append("t_id", this.state.trackerID);
      formData.append("s_id", cur_Location);
      formData.append("s_zone", cur_Order);
      formData.append("date", moment().format('YYYY/MM/DD,HH:mm'));
      formData.append("event", event);
        const serviceResponse= fetch('http://192.168.101.201/reciveLog.php',
        {
          method: 'POST',
          body: formData,
        })
        .then((serviceResponse) => { 
          })
        .catch((error) => console.warn("fetch error:", error))
        .then((serviceResponse) => { 
        });
 
      }

  fetchdatachk = async (event,cur_Location,cur_Order,cur_RSSI) => {

    const formData = new FormData();
    const {cur_Message,minChkInOut} = this.state
    formData.append("t_id", this.state.trackerID);
    formData.append("s_id", cur_Location);
    formData.append("s_zone", cur_Order);
    formData.append("date", moment().format('YYYY/MM/DD,HH:mm'));
    formData.append("event", event);
  
      const serviceResponse= fetch('http://192.168.101.201/reciveLog.php',
      {
        method: 'POST',
        body: formData,
      })
      .then((serviceResponse) => { 
          if (event == 'chk_out') {
            Alert.alert("Check-Out: ลงเวลาออก","คุณ "+this.state.firstname+" "+this.state.lastname +"\nที่จุด ["+cur_Location+"] "+cur_Message+"\nณ วันที่ "+moment().format('DD/MM/YYYY, HH:mm'),[{text: "OK", onPress: () => this.setModalVisible(false)}])
          } else if (event == 'chk_in'){
            Alert.alert("Check-In: ลงเวลาเข้า","คุณ "+this.state.firstname+" "+this.state.lastname +"\nที่จุด ["+cur_Location+"] "+cur_Message+"\nณ วันที่ "+moment().format('DD/MM/YYYY, HH:mm'),[{text: "OK", onPress: () => this.setModalVisible(false)}])
            
          } else {
            // FAST-PASS event
          }        
        })
      .catch((error) => console.warn("fetch error:", error))
      .then((serviceResponse) => { 
      });
    }

  gotoeditor() {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate('editprofile');
  }

  render() {
  const date = new Date();
  const { modalVisible,cur_Location,cur_Message,cur_Order,cur_RSSI,firstname,lastname,avatarSource,minChkInOut } = this.state;
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
              <View style={{marginTop:10,flexDirection: 'row',}}>
                  <TouchableOpacity
                    style={{ ...styles.openButton, backgroundColor: "#2196F3",justifyContent:'center',}}
                    onPress={() => this.gotoeditor()}
                  >
                    <Text style={styles.textStyle}>แก้ไขโปรไฟล์</Text>
                  </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: "#08CC3B",justifyContent:'center', }}
                  onPress={() => {
                    if (cur_Location != "000" && cur_RSSI > minChkInOut) {
                      this.fetchdatachk('chk_in',cur_Location,cur_Order,cur_RSSI);
                    } else {
                      Alert.alert("Error","ไม่สามารถ Check-In ได้กรุณาเดินไปที่จุดทีกำหนด\nและทำใหม่อีกครั้ง", [{text: "OK", onPress: () => this.setModalVisible(!modalVisible)}])
                    }
                  }}
                >
                <Text style={styles.textStyle}>Check in</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{ ...styles.openButton, backgroundColor: "#E5AC0A",justifyContent:'center',}}
                    onPress={() => {
                      if (cur_Location != "000" && cur_RSSI > minChkInOut) {
                        this.fetchdatachk('chk_out',cur_Location,cur_Order,cur_RSSI);
                      }else{
                        Alert.alert("Error","ไม่สามารถ Check-Out ได้กรุณาเดินไปที่จุดทีกำหนด\nและทำใหม่อีกครั้ง", [{text: "OK", onPress: () => this.setModalVisible(!modalVisible)}])
                      }
                    }}
                  >
                  <Text style={styles.textStyle}>Check out</Text>
                  </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{ ...styles.openButton, backgroundColor: "#F45C44",justifyContent:'center', }}
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
      <View  style={{ flexDirection: 'row', backgroundColor: '#BABABA',justifyContent:'center',}}>
          <View style={{margin:5,padding:10,width:"25%",alignSelf:'flex-start',alignItems:"center"}}>
            <TouchableOpacity  onPress={() => {
                    BleManager.stopScan()
                    }}>
              <Image
                style={{ 
                  borderRadius: 50,
                  width: 65, 
                  height: 65,
                  }}
                source={{uri:'http://192.168.101.201/'+cur_Location+'/logo/default.png'}}
              />
            </TouchableOpacity>
           
             <Text>{cur_Message}</Text>
          </View>
        <View style={{justifyContent:'center',alignItems: 'center',width:"50%",textAlign: 'center',alignSelf :"center"}}>
          {cur_Location != '000'?(
            <>
              <Text style={{  fontWeight: 'bold',alignSelf:'center'}}>
                สวัสดีค่ะ
              </Text>
              <Text style={{  fontWeight: 'bold',alignSelf:'center'}}>
                คุณ {firstname}  {lastname}
              </Text>
            </>
            ):(
            <>
              <Text style={{  fontWeight: 'bold',alignSelf:'center'}}>
                ShellHut
              </Text>
            </>
          )}
        </View>
        <View  style={{margin:5,padding:10,alignSelf:'flex-end',width:"25%",alignItems:"center"}}>
            <TouchableOpacity onPress={() => {this.setModalVisible(true)}}>
              <Image
                style={styles.editcircle}
                source={avatarSource}
              />
            </TouchableOpacity>
        </View>
      </View>
      <WebView source={{ uri: 'http://192.168.101.201/'+cur_Location+'?'+date.getTime()}} />
      <View style={{flexDirection: 'row', backgroundColor: '#E0E0E0',justifyContent:'center'}}>
          <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'center',padding:1,width:'20%'}}>
              <Text>{this.state.status}</Text>
          </View>
          <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'center',padding:1,width:'20%'}}>
              <Text>{this.state.cur_Message}</Text>
          </View>
          <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'center',padding:1,width:'20%'}}>
              <Text>{this.state.cur_Location}</Text>
          </View>
          <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'center',padding:1,width:'20%'}}>
              <Text>{this.state.cur_Order}</Text>
          </View>
          <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'center',padding:1,width:'20%'}}>
              <Text>{this.state.cur_RSSI}</Text>
          </View>
      </View>
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
  },
  editcircle: {
    width: 65, 
    height: 65,
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
  },
  headers: {
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