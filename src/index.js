import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView,
  Alert,
  DeviceEventEmitter
} from 'react-native';
import { BluetoothStatus } from 'react-native-bluetooth-status';

import BleManager from 'react-native-ble-manager';


const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
export default class App extends Component {
  constructor() {
    super()

    this.state = {
      scanning: false,
      peripherals: new Map(),
      appState: '',
      conut: 0,
      btEnabled: false
    }
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);

  }

  componentDidMount() {

    AppState.addEventListener('change', this.handleAppStateChange);

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);

    BleManager.start({ showAlert: true })
      .then(() => {
        // Success code
        console.log('Module initialized');
      });

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

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }

    this.setState({ appState: nextAppState });
  }
  componentWillUnmount() {
    this.stopScan();
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }
  async checkInitialBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    // console.log("check bluetooth on or off", isEnabled);
    if (isEnabled == true) {

    } else {
      Alert.alert(
        'Bluethooth',
        'Bluetooth is turn off'
      );
    }
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

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  handleStopScan() {
    console.log('rescan !');
    this.setState({ peripherals: new Map() })
    this.setState({ scanning: false });
    this.startScan()
  }

  startScan() {
    if (!this.state.scanning) {
      BleManager.scan([], 300, true).then(() => {
        console.log('Scanning...');
        this.setState({ scanning: true });
      });
    }
  }

  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals;
      if (typeof peripheral.name == "string" && peripheral.name.indexOf("Holy")>=0 ){
        if (peripheral.rssi >= -70) {
          this.state.conut += +1;
          peripherals.set(peripheral.id, peripheral);
          this.setState({ peripherals });
        }
        
        
      }
    // if (peripheral.name != null) {
    //   this.state.conut += +1;
    //   peripherals.set(peripheral.id, peripheral);
    //   this.setState({ peripherals });
    // }
  }

  rssi2dis (rssi,tx) {
  
  // var txPower = -69
  // const mp = -69
  if (rssi == 0) {
    return -1.0; 
  }
  var  ratio = rssi*1.0/tx;
  if (ratio < 1.0) {
    return Math.pow(ratio,10);
  }
  else {
    var accuracy =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;    
    return accuracy;
  }
  // var distance = 10^((mp-rssi)/10*2)
  // // var distance =  Math.pow(10,((-59)-(rssi)));

  //   return distance;
 
  //  cal distance

}
  renderItem(item) {
    const color = item.connected ? 'green' : '#fff';

    return (

      <View style={[styles.row, { backgroundColor: color }]}>
        {/* {
                true (
                  <> */}
        {/* <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{this.state.conut}</Text> */}
        <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>name:{item.name}</Text>
        <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text>
        <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>txPowerLevel: {item.advertising.txPowerLevel}</Text>
        <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, }}>id:{item.id}</Text>
        <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20 }}>dis:{this.rssi2dis(item.rssi,item.advertising.txPowerLevel)}</Text>

        {/* </>
                ) : (
                    <>
                
    
                    </>
                  )
              } */}
      </View>

    );
  }

  render() {
    const list = Array.from(this.state.peripherals.values());

    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.container}>

          <View style={{ margin: 10 }}>
            <Button title={this.state.scanning + ""} onPress={() => this.startScan()} />
          </View>
          <View style={{ margin: 10 }}>
            <Button title={'stop'} onPress={() => this.stopScan()} />
          </View>


          <ScrollView style={styles.scroll}>
            {(list.length == 0) &&
              <View style={{ flex: 1, margin: 20 }}>
                <Text style={{ textAlign: 'center' }}>Waiting for rescan</Text>
              </View>
            }
            <FlatList
              data={list}
              renderItem={({ item }) => this.renderItem(item)}
              keyExtractor={item => item.id}
            />

          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10
  },
});
