
import * as React from 'react';
import { StyleSheet,Image,TouchableOpacity,Text,StatusBar,View,Dimensions,NativeEventEmitter,PermissionsAndroid,
  NativeModules,AppState,Platform,Alert

} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import BleManager from 'react-native-ble-manager';

// import SignUp from './src/';
import register from './src/register';
import Craigslist from './src/promotion'

const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

function Title(props) {
  return(
   <>
    <View style={{textAlign:"center", 
                      flex:1,
                      alignSelf: 'center'  }}>
      <Text style={{  fontWeight: 'bold',}}>
        {props.title}
      </Text>
      <Text style={{  fontWeight: 'bold',}}>
        {props.rssi}
      </Text>
    </View>
   </>
  );
}

function LogoTitle(props) {
  return (
     <View style={{marginLeft:5}}>
        <View style={{ flexDirection: 'row'}}>
            <View style={{ }} >
              <Image
                style={{ width: 50, height: 45,marginTop: 5,}}
                source={require('./src/logo/logo-7.png')}
              />
            </View>
        </View>    
        <View style={{ flexDirection: 'row',alignSelf:'center'}}>
            <Text>{props.locationNo}</Text>
        </View>
      </View>
  );
}
function LogoSetiing(props) {
  return (
    <View  style={{textAlign:"center", 
    flex:1,
    alignSelf: 'center'  }}>
      <TouchableOpacity onPress>
        <Image
          style={styles.editcircle}
          source={require('./src/logo/te.jpg')}
        />
      </TouchableOpacity>
      <View>
        <Text style={{ fontWeight:'bold',alignSelf:'center'}}>{props.rssi}</Text>
      </View>
    </View>
  );
}
export default class App extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn:false,
      userToken: null,
      nav:AsyncStorage.getItem('datakey')==null?"register":"Craigslist",
      title: "สวัสดีค้าา",
      rssi:"scanning",
      locationNo:"?",
      scanning: false,
      peripherals: new Map(),
      appState: '',
      btEnabled: false,
      min:-70,
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)


    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }
  handleTitleChange = (event) =>{
    setState({title:event})
  }
  componentDidMount(){
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
    this.checkInitialBluetoothState()
    
    
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
  componentWillUnmount(){
    this.handleStopScan();
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
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
      BleManager.scan([], 30, true).then(() => {
        // console.log('Scanning...');
        this.setState({ scanning: true });
      });
    }
  }
  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals;
    // console.log('Got ble peripheral', peripheral);

    if (typeof peripheral.name == "string" && peripheral.name.indexOf("Holy")>=0 ){

      // console.log(peripheral)
      // if(typeof peripheral.name == "string" && peripheral.name.indexOf("TAN") >=0){
          // if (peripheral.rssi >= -70) {
        // console.log(peripheral.name)
        peripherals.set(peripheral.id, peripheral);
        
        this.setState({ peripherals });
        if (peripheral.rssi> this.state.min) {
          this.setState({ min: peripheral.rssi});
          this.setState({ rssi: ""+Math.abs(peripheral.rssi)});
          if (peripheral.name.split(":")[1]== 'V11') {
            this.setState({ locationNo: peripheral.name.split(":")[3]});
          }else{
            this.setState({ locationNo: peripheral.name.split(":")[1]});
          }
         
        }
          // }
      //   this.state.conut += +1;
       
      //   const buffer = new ArrayBuffer(8);
 
      //   // console.log(peripheral+"tan,pak")
        
        
      // }
    }
  }
  feht  = async(e) =>{
    try{
      const rep = await fetch();
      const data = await rep.json();
     
    }catch(err){

    }
  }
  fahtdata = async () => {
    try {
      const data = {
        firstname: this.props.firstname,
        lastname: this.props.lastname,
        gender: this.props.gender,
        old: this.props.old,
        tell: this.props.phone,
        email: this.props.email,
        trackerID: this.state.trackerID,
        avatar:this.props.avatar,
    }
   
      const jsonValue = JSON.stringify(data)
      await AsyncStorage.setItem('datakey', jsonValue)
      
    } catch (e) {
      // saving error
      console.log('saving error');
    }
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

  render() {
    const Stack = createStackNavigator();
    return (
      <NavigationContainer>
      <StatusBar hidden={true} />
      <Stack.Navigator  initialRouteName={this.state.nav} >

          <Stack.Screen name="Register" 
          component={register}/>

          <Stack.Screen name="Craigslist" component= {props => <Craigslist uri={this.state.locationNo} />}
         
            options={{headerStyle: {
                        height:100,
                      },
                      uri:this.state.locationNo,
                    headerTitle: props => <Title  title={this.state.title} />,
                    headerLeft: props => <LogoTitle  locationNo={this.state.locationNo}/>,
                    headerRight: props => <LogoSetiing  rssi={this.state.rssi}/>
                  }}
          />
      </Stack.Navigator>
    </NavigationContainer>
    );

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