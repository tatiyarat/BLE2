
import * as React from 'react';
import { StyleSheet,Image,TouchableOpacity,Text,StatusBar,View,Dimensions,NativeEventEmitter,PermissionsAndroid,
  NativeModules,AppState,Platform,Alert

} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import BleManager from 'react-native-ble-manager';
import { WebView } from 'react-native-webview';

// import SignUp from './src/';
import register from './src/register';
// import Menu from './src/promotion'

const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

function Title(props) {
  return(
   <>
    <View style={{
        textAlign:"center", 
        flex:1,
        alignSelf: 'center' 
         }}>
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
function Menu(props) {
  console.log(props+"menu");
  
  return(
    <WebView source={{ uri: 'http:/192.168.101.201/v11.html' }} />
    
  ) 
}
function LogoTitle(props) {
  if(this.locationNo == '000'){
    const date = new Date();
    const imglogo = 'http:/192.168.101.201/logo/default.png?'+date.getTime();

    console.log(imglogo);
  
  }
  // const date = new Date();
  // const imglogo = 'http:/192.168.101.201/logo/shellhut.png?'+date.getTime();
  // console.log(imglogo);

  return (
     <View style={{marginLeft:5}}>
        <View style={{ flexDirection: 'row'}}>
            <View>
               <Image style={{ width: 50, height: 45,marginTop: 5,}}
               source={{uri:imglogo}}/>
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
    <View  style={{
      textAlign:"center", 
      flex:1,
      alignItems: 'center'
    }}>
      <TouchableOpacity onPress>
        <Image
          style={styles.editcircle}
          source={require('./src/logo/te.jpg')}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row'}}>
        <Text style={{ fontWeight:'bold',alignSelf:'center'}}>{props.name}</Text>
        <Text style={{ fontWeight:'bold',alignSelf:'center'}}>({props.rssi})</Text>
        {/* <Text style={{ fontWeight:'bold',alignSelf:'center'}}>()</Text> */}

      </View>
    </View>
  );
}
export default class App extends React.Component {
    
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isSignedIn:false,
      userToken: null,
      nav:AsyncStorage.getItem('datakey')==null?"register":"Craigslist",
      title: "สวัสดีค้าา",

      rssi:"Scanning",

      def_Location: "000",
      def_Order: "00",
      def_Message: "ShellHut",

      cur_Location: "",
      cur_Order: "",
      cur_Message: "",

      get_Location: "",
      get_Order: "",
      get_Message: "",

      timeToScan: 5,
   
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

  showHeaderLocation() {
  }

  startScan() {
    if(this.state.cur_Location == '') {
      this.setState({cur_Location: this.state.def_Location})
      this.setState({cur_Order: this.state.def_Order})
      this.setState({cur_Message: this.state.def_Message})      
    }

    this.showHeaderLocation();

    BleManager.scan([], this.state.timeToScan, true).then(() => {
        console.log('Scanning...');
    });
  } //startScan


  handleTitleChange = (event) =>{
    setState({title:event})
  }

  componentDidMount(){
    // console.log(this.props);
    
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

  handleStopScan() {
    console.log('rescan !');
    const newrssi = this.state.rssi;
    const newlocation = this.state.locationNo;
    const newname = this.state.nameNo;
    if(this.state.namelogo != ''){
      const newnamelogo = this.state.namelogo;
      this.setState({rssi2:newrssi})
      if (this.state.locationNo2 !==  this.state.locationNo) {
        this.setState({locationNo2:newlocation})
        
      }
      this.setState({nameNo2:newname+":"})
      this.setState({namelogo2:newnamelogo})
      this.setState({ peripherals: new Map() })
      this.setState({ scanning: false });
      this.setState({ min: -70 });
      this.startScan()
    }else if (this.state.namelogo == ''){
      const newnamelogo = 'shellht';
      this.setState({rssi2:newrssi})
      if (this.state.locationNo2 !==  this.state.locationNo) {
        this.setState({locationNo2:newlocation})
      }
      this.setState({nameNo2:newname})
      this.setState({namelogo2:newnamelogo})
      this.setState({ peripherals: new Map() })
      this.setState({ scanning: false });
      this.setState({ min: -70 });
      this.startScan()
    }
  }

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }
  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals;
    // console.log('Got ble peripheral', peripheral);

    if (typeof peripheral.name == "string" && peripheral.name.indexOf("Holy")>=0 ){
        peripherals.set(peripheral.id, peripheral);
        
        this.setState({ peripherals });
        if (peripheral.rssi > this.state.min) {
          // console.log(peripheral.name);
          console.log(peripheral.name);
          
          this.setState({ min: peripheral.rssi});
          this.setState({ rssi: ""+peripheral.rssi});
          // if (peripheral.name.split(":")[1] != '') {
            this.setState({ locationNo: peripheral.name.split(":")[3]});
            this.setState({ nameNo: peripheral.name.split(":")[2]});
            this.setState({ namelogo: peripheral.name.split(":")[1]});

            // this.rssi2dis(peripheral.rssi,peripheral.advertising.txPowerLevel)

          // }else{
            // this.setState({ locationNo: peripheral.name.split(":")[1]});
          // }
        }
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
  
    
    //   RSSI = TxPower - 10 * n * lg(d)
    //  n = 2 (
      
    //   d = 10 ^ ((TxPower - RSSI) / (10 * n))
     
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
      <NavigationContainer >
      <StatusBar hidden={true} />
      <Stack.Navigator  initialRouteName={this.state.nav} >

          <Stack.Screen name="Register" 
          component={register}/>

          <Stack.Screen name="Craigslist"
          component={Menu} 
            // initialParams={{ locationNo2: this.state.locationNo2 }}
            // screenProps={this.state.locationNo2}
            // locationNo={ this.state.locationNo2}
            options={{headerStyle: {
                        height:100,
                      },
                    headerTitle: props => <Title  title={this.state.title} />,
                    headerLeft: props => <LogoTitle  locationNo={this.state.locationNo2} logo={this.state.namelogo2}/>,
                    headerRight: props => <LogoSetiing  rssi={this.state.rssi2} name={this.state.nameNo2}/>
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