import React, { Component } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Alert,
  Platform
} from "react-native";
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions} from "react-navigation";
import setAuthToken, {removeAxiosAuth} from "../../../utils/networkUtils";

import Loader from "../../../components/loader/Loader";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissRectButton from "../../../components/kralissButton/KralissRectButton";
import KralissGreyPicker from "../../../components/kralissPicker/KralissGreyPicker";
import KralissInput from "../../../components/kralissInput/KralissInput";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData,saveUserInfo,saveAuthToken,getAuthToken } from "../../../utils/localStorage";
import {RFPercentage} from "react-native-responsive-fontsize";
import KralissGreyInput from "../../../components/kralissInput/KralissGreyInput";
import KralissMoneyIconCell from "../../../components/kralissListCell/KralissMoneyIconCell";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import { reqPatchMyUsers, reqPatchUsersInit } from "../../../reducers/patchMyUsers";
import {reqLogin, reqInitSignIn} from "../../../reducers/login";
import CryptoJS from "react-native-crypto-js";

export default class ModifyUserDetailsView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { type } = params.params;

    this.state = {
      type,
      changedInfo:"",
      country:"",
      countryIndex:"",
      txtOldPasswd: "",
      txtNewPasswd: "",
      txtConfPasswd: "",
      bShowPwdKey: false,
      allInternationals:[],
      allInternationalsAPI:[],
      isLoading:false
    };
  }

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
  };


  onPressValidate = () => {
    let {type,changedInfo,allInternationalsAPI,allInternationalsAPIAuthorized,countryIndex} = this.state;
    if (type == "address"){
      infoType = "addressLabel1";
    }
    else if (type == "country"){
      infoType = "addressCountry";
      changedInfo = allInternationalsAPIAuthorized[countryIndex]["@id"];

    }
    else if (type == "userBirthCountry"){
      infoType = "birthCountry";
      changedInfo = allInternationalsAPI[countryIndex]["@id"];

    }
    else if (type == "userBirthCity"){
      infoType = "birthCity";
    }
    else if (type == "fixedTelephone"){
      infoType = "phoneFixed";
      changedInfo = parseInt(changedInfo);
    }  
    else if (type == "mobileNumber"){
      infoType = "phoneMobile";
      changedInfo = parseInt(changedInfo);

    }
    else if (type == "email"){
      infoType = "email";
      changedInfo = changedInfo.toLowerCase();
    }        
    else{
      infoType = type;
    }
    this.setState({isLoading: true})

    this.props.reqPatchMyUsers({
      requestCode:30,
      [infoType]: changedInfo
    });
  };

  onPressPwdKey = key => {
    const { curSelSecurityID } = this.state;
    var _stateObj = {};
    if(this.state[curSelSecurityID].length < 4) {
      _stateObj[curSelSecurityID] = this.state[curSelSecurityID] + key;
    }
    this.setState(_stateObj);
  };

  onDeleteSecurity = ID => {
    if( ID === "txtOldPasswd"){
      this.setState({ txtOldPasswd: ""});
    } else if(ID === "txtNewPasswd"){
      this.setState({ txtNewPasswd: ""});
    } else {
      this.setState({ txtConfPasswd: ""});
    }
    this.setState({bShowPwdKey: false});
  }

  onSecureChange = ID => {
    if (this.state.bShowPwdKey === false) {
      this.setState({ bShowPwdKey: true });
    }
    this.setState({ curSelSecurityID: ID });
  };

  componentDidMount =  async () => {
    let allInternationals = await loadLocalData("allInternationals");

    allInternationals = allInternationals.sort(this.sortPropsInternational)
    let nameAllInternationals = [];
    let nameAllInternationalsAuthorized = [];
    let allInternationalsAuthorized = [];

    for(let i in allInternationals) {
      nameAllInternationals.push(allInternationals[i]["label"])
      if(allInternationals[i]["authorizedCountry"]){
        allInternationalsAuthorized.push(allInternationals[i])
        nameAllInternationalsAuthorized.push(allInternationals[i]["label"])
      }
    }
    this.setState({ 
      allInternationals: nameAllInternationals ,
      allInternationalsAPI:allInternationals,
      allInternationalsAuthorized:nameAllInternationalsAuthorized,
      allInternationalsAPIAuthorized:allInternationalsAuthorized
    })
    
  }

  forceLogin = async (newEmail) => {
    const email = await loadLocalData("emailLogin");
    const pwdEncrypted = await loadLocalData("password");
    const password = CryptoJS.AES.decrypt(pwdEncrypted, email).toString(CryptoJS.enc.Utf8);
    saveLocalData("email", newEmail);
    saveLocalData("emailLogin", newEmail);
    const encryptedPwd = CryptoJS.AES.encrypt(password, newEmail).toString();
    saveLocalData("password", encryptedPwd);

    removeAxiosAuth();
    this.setState({isLoading: true})
    this.props.reqLogin({
        email: newEmail.toLowerCase(),
        password: password
    })}

  componentDidUpdate = async (prevProps, prevState) => {
    const { success, error, payLoad, auth_token} = this.props;
    token = await getAuthToken();

    if(!token && auth_token.token && this.props.auth_token !== prevProps.auth_token){
      await saveAuthToken(auth_token.token);
      await setAuthToken(auth_token.token);

      this.props.navigation.navigate("SettingSuccess", {
        title: i18n.t("contacts.succChangeTitle"),
        description: "",
        returnNavigate: "Setting"
      });
      this.setState({isLoading: false})
    }

    else if (success === true) {
      await saveUserInfo(this.props.payLoad);
      this.props.reqPatchUsersInit()

      if (this.state.type == "email"){
        await AsyncStorage.removeItem('auth_token')
        this.forceLogin(this.state.changedInfo.toLowerCase())
      }

      else{

      this.props.navigation.navigate("SettingSuccess", {
        title: i18n.t("contacts.succChangeTitle"),
        description: "",
        returnNavigate: "Setting"
      });
      this.setState({isLoading: false})

     }
    }
    if (error !== undefined && this.props.error.length > 0) {
      this.showErrorAlert(i18n.t("settings.errorPassword"));
      this.props.reqPatchUsersInit()
    }
  };

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
  /**/
  render() {
    const {
      type,
      changedInfo,
      country

    } = this.state;
    let buttonEnabled = false;
    if (
      changedInfo.length > 0 ||
      country.length > 0
    ) {
      buttonEnabled = true;
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>
        <SafeAreaView style={styles.container}>
          <Loader
            loading={this.state.isLoading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>

          <WhiteNavHeader
            title={i18n.t("settings.changeUserInfo")+i18n.t("tunnel."+type)}
            onBack={() => this.props.navigation.goBack()}
          />
          <ScrollView style={styles.textContainer}>

          {(type == "email" || type == "lastName" || type == "firstName" || type == "userBirthCity" || type == "address" ) &&
            <KralissGreyInput
                ID="changedInfo"
                placeHolder={i18n.t("tunnel."+type)}
                onChangeText={this.onChangeInputText}
                value={this.state.changedInfo}
            />}

          {type == "country"    &&
              <KralissGreyPicker
              placeHolder={i18n.t("tunnel.residenceCountry")}
              confirmBtnTitle={i18n.t("tunnel.done")}
              cancelBtnTitle={i18n.t("tunnel.cancel")}
              pickerData={this.state.allInternationalsAuthorized}
              value={this.state.country}
              onSelect={(country, countryIndex) => {
                this.setState({ country, countryIndex });
              }}
            />}

          {type == "userBirthCountry"   &&
            <KralissGreyPicker
                placeHolder={i18n.t("tunnel.userBirthCountry")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={this.state.allInternationals}
                value={this.state.country}
                onSelect={(country, countryIndex) => {
                  this.setState({ country, countryIndex });
                }}
            />}
            
            {(type == "fixedTelephone" || type == "mobileNumber" ) &&
              <KralissGreyInput
                  ID="changedInfo"
                  style={styles.phoneNum2}
                  keyboardType={"numeric"}
                  placeHolder={i18n.t("tunnel."+type)}
                  onChangeText={this.onChangeInputText}
                  value={this.state.changedInfo}
              />}
          </ScrollView>

          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressValidate}
            title={i18n.t("login.validateButton")}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end"
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
    pwdKeyPad: {
        marginBottom: 20,
        // height: 160,
        width: "95%"
    },
  sectionText: {
    marginTop: 20,
    color: "#acacac",
    fontSize: RFPercentage(2.0)
  },
  txtSectionTitle: {
    color: "#707070",
    fontSize: RFPercentage(2.0),
    marginTop: 30
  },
  marginCell: {
    marginTop: 10
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { loading, error, success ,payLoad} = state.patchInterReducer;

  const {auth_token, error: loginError, errorStatus} = state.loginReducer;

  if(success === true &&  state.type == "email" ){
    loading = true;
  }
  return { loading, error, success, payLoad, auth_token };
};

const mapDispatchToProps = {
  reqPatchMyUsers,
  reqPatchUsersInit,
  reqLogin
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyUserDetailsView);
