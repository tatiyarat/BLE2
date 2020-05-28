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
  ScrollView,
  FlatList,
  Dimensions,
  Linking,
  NativeModules,NativeEventEmitter,Platform,PermissionsAndroid
} from 'react-native';
import { WebView } from 'react-native-webview';

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
      runing:0,
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    // this.handleAppStateChange = this.handleAppStateChange.bind(this);
  } 
  
  componentDidMount(){
    console.log("MOUNT");
    
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

        console.log(peripheral.name+"  == ALL "+peripheral.rssi);

        if (peripheral.rssi > this.state.get_RSSI) {
          console.log(peripheral.name+"  == RSSI"+peripheral.rssi);
            this.setState({ get_RSSI: peripheral.rssi});
            this.setState({ get_Location: peripheral.name.split(":")[1]});
            this.setState({ get_Order: peripheral.name.split(":")[2]});
            this.setState({ get_Message: peripheral.name.split(":")[3]});
        }
    }
  }

  handleStopScan() {

    let {get_Location,get_Order,get_Message,get_RSSI,cur_Location,cur_Order,cur_Message,cur_RSSI} = this.state

    setTimeout(()=>{
      console.log('=======================')
      console.log('rescan !<GET>'+ get_Location +" : " + get_Order);
      console.log('rescan !<CUR>'+ cur_Location +" : " + cur_Order);
      console.log('=======================')
    },1000)

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

    setTimeout(()=>{
      console.log('=======================')
      console.log('rescan !<CHK-CUR>'+ cur_Location +" : " + cur_Order);
      console.log('=======================')
    },2000)
    
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

  handleTitleChange = (event) =>{
    setState({title:event})
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
    console.log('Disconnected from ' + data.peripheral);
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

  render() {
  // console.log('http://192.168.101.201/'+this.state.cur_Location+'/index.html')
    
    return(
      <>
      <View  style={{ flexDirection: 'row', backgroundColor: 'steelblue'}}>
        <View style={{marginLeft:5}}>
          <View style={{ flexDirection: 'row'}}>
              <View>
                <Image
                  style={{ width: 50, height: 45,marginTop: 5,}}
                  source={require('./logo/logo-7.png')}
                />
              </View>
          </View>    
          <View style={{ flexDirection: 'row',alignItems:'center'}}>
              <Text>{this.state.cur_Message}</Text>
          </View>
        </View>

        <View style={{textAlign:"center", flex:2,alignItems: 'center'}}>
            <Text style={{  fontWeight: 'bold',}}>
              สวัสดีค้าา
            </Text>

            <Text style={{  fontWeight: 'bold',}}>
              rssi
            </Text>
        </View>

        <View  style={{textAlign:"center", flex:1,alignItems: 'center'}}>
            <TouchableOpacity onPress>
              <Image
                style={styles.editcircle}
                source={require('./logo/te.jpg')}
              />
            </TouchableOpacity>

            <View>
              <Text style={{ fontWeight:'bold',alignItems:'center'}}>
                {this.state.cur_Order}
                {this.state.cur_RSSI} 
                (m)
              </Text>
            </View>
        </View>

      </View>

      <Text> Status:{this.state.status } </Text>
    <Text> Location:{this.state.cur_Location }       </Text>
    <Text> Message:{this.state.cur_Message} </Text>
    <Text> Rssi:{this.state.cur_RSSI} </Text>
    <Text> Order:  {this.state.cur_Order}</Text>
    <WebView source={{ uri: 'http://192.168.101.201/'+this.state.cur_Location+'/logo/default.png' }} />

    </>
    )
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
   


