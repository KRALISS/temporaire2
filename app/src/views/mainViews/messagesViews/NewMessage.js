import React, {Component} from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView
} from "react-native";
import {connect} from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";

import {getStatusBarHeight} from "react-native-status-bar-height";
import i18n from "../../../locale/i18n";
import {getAuthToken} from "../../../utils/localStorage";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import WebSocketInstance from "../../../utils/WebSocket";


export default class NewMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message:'',
      object:'',
      token:''
    };
  }

  componentWillUnmount(): void {
    WebSocketInstance.close()
  }
  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("beneficiary.fault"),
        errorMsg,
        [
          {
            text: i18n.t("passwdIdentify.return"),
            onPress: () => {}
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };


  async componentDidMount() {
    this.initSocket()
  }
  initSocket = async () => {
    const token = await getAuthToken();

    this.setState({token})
    this.waitForSocketConnection(() => {
      // WebSocketInstance.initChatUser(token, );
      WebSocketInstance.addCallbacks('init_chat',this.initCallback.bind(this))
      WebSocketInstance.addCallbacks('messages',this.goBackSummary.bind(this))
      // WebSocketInstance.addCallbacks('fetch_messages',this.goBackSummary.bind(this))
      // WebSocketInstance.fetchMessages(this.state.token, "tempo", "topic", "message");
    });

    WebSocketInstance.connect()
  };
  initCallback(socketMessage){
    let {token,object,message} = this.state
    if(socketMessage.success){
      WebSocketInstance.fetchMessages(token,object,message)
    }else{
      Alert.alert(
          i18n.t("messages.initMessageErrorTitle"),
          i18n.t("messages.initMessageErrorMessage"),
          [
            {
              text: i18n.t("components.errorView.return"),
              onPress: () => {}
            }
          ],
          { cancelable: true }
        );
    }


  }

  goBackSummary(message){
    if(message[0]?.created_at){
      Alert.alert(
        i18n.t("messages.initMessageSuccessTitle"),
        i18n.t("messages.initMessageSuccessMessage"),
        [
          {
            text: i18n.t("components.errorView.return"),
            onPress: () => {
              // this.props.navigation.state.params.fetchExchange(true)
              this.props.navigation.goBack()
            }
          }
        ],
        { cancelable: true }
      );
    }else{
      Alert.alert(
        i18n.t("messages.initMessageErrorTitle"),
        i18n.t("messages.initMessageErrorMessage"),
        [
          {
            text: i18n.t("components.errorView.return"),
            onPress: () => {}
          }
        ],
        { cancelable: true }
      );
    }

  }

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (WebSocketInstance.state() === 1) {
          console.log("Connection is made")
          callback();
          return;
        } else {
          console.log("wait for connection...")
          component.waitForSocketConnection(callback);
        }
      }, 100); // wait 100 milisecond for the connection...
  }



  render() {
    const statusBarHeight = getStatusBarHeight();
    let {token,message,object} = this.state
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>
        <SafeAreaView style={styles.container}>
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
          <WhiteNavHeader
            title={i18n.t("messages.newMessage")}
            onBack={() => {
              this.props.navigation.goBack();
            }}
          />

          <View style={styles.subContainer}>

            {/*<View style={styles.row}>*/}

            {/*  <View style={styles.textWrapper}>*/}
            {/*    <Text style={styles.text}> Destinataire *  </Text>*/}
            {/*  </View>*/}

            {/*  <View*/}
            {/*    style={[styles.fieldWrapper,{*/}
            {/*      flexDirection: 'row',*/}
            {/*      alignItems:'center',*/}
            {/*      justifyContent:'space-between',*/}
            {/*    }]}>*/}

            {/*      <Text>*/}
            {/*        TechniqueTechnique*/}
            {/*      </Text>*/}

            {/*    <Image*/}
            {/*      source={require("../../../assets/images/chevron_down.png")}*/}
            {/*    />*/}
            {/*  </View>*/}

            {/*</View>*/}

            <View style={styles.row}>


              <View style={styles.textWrapper}>
                <Text> {i18n.t('messages.objectTitle')}  </Text>
              </View>

              <View style={styles.fieldWrapper}>
                <TextInput
                  style={{flex:1,}}
                  editable
                  maxLength={70}
                  onChangeText={object=>this.setState({object})}
                  placeholder={i18n.t('messages.object')}
                />
              </View>

            </View>

            <View style={styles.row}>


              <View style={styles.textWrapper}>
                <Text> {i18n.t('messages.yourMessageTitle')}  </Text>
              </View>

              <View
                style={[styles.fieldWrapper,{height:hp(15),paddingVertical:10}]}>

                <TextInput
                  placeholder={i18n.t('messages.yourMessage')}
                  style={{
                    flex:1,
                    textAlignVertical: "top"
                  }}
                  onChangeText={message=>this.setState({message})}
                  maxLength={500}
                  editable
                  multiline
                />
              </View>

              <View style={styles.textWrapper}>
                <Text> {i18n.t('messages.requiredFields')}  </Text>
              </View>

            </View>

          </View>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={()=>{
              if(!object.length){
                Alert.alert(
                  i18n.t('messages.objectEmptyErrorTitle'),
                  i18n.t('messages.objectEmptyError'),
                )
              }else if(!message.length){
                Alert.alert(
                  i18n.t('messages.messageEmptyErrorTitle'),
                  i18n.t('messages.messageEmptyError'),
                )
              }else{
                WebSocketInstance.initChatUser(token,object,message)
              }
            }}
          >
            <Text style={styles.sendButtonText}>
              {i18n.t('messages.sendButtonTitle')}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent:'space-between',
  },
  subContainer:{
    flex:1,
    paddingHorizontal:wp(5),
  },
  row:{
    marginTop:hp(3),
    // backgroundColor:'green'
  },
  text:{

  },
  textWrapper:{
    height:hp(4),
    justifyContent:'center',
    // backgroundColor:'yellow'
  },
  fieldWrapper:{
    height:hp(5),
    borderRadius:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor:'white',
    justifyContent:'center',
    paddingHorizontal:wp(5),
  },
  sendButton:{
    height:hp(6),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#00ACA9'
  },
  sendButtonText:{
    color:'#fff',
    fontSize:RFPercentage(3)
  }
});


