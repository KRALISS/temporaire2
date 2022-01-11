import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  AppState,
  TouchableHighlight,
  TouchableOpacity,
  View, TouchableWithoutFeedback
} from "react-native";
import  AsyncStorage  from "@react-native-community/async-storage";
import {connect} from "react-redux";
import React, {Component} from "react";
import {RFPercentage} from "react-native-responsive-fontsize";
import {NavigationActions} from "react-navigation";
import Joi from "react-native-joi";
import GradientView from "../../../components/gradientView/GradientView";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissCheckBox from "../../../components/kralissCheckBox/KralissCheckBox";
import KralissButton from "../../../components/kralissButton/KralissButton";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import Loader from "../../../components/loader/Loader";
import {reqInitSignIn, reqLogin} from "../../../reducers/login";
import {reqAccountsMe, reqInitAccountsMe} from "../../../reducers/accountsMe";
import {reqActivation, reqInitActivation} from '../../../reducers/resendEmailActivation';
import {reqConfirmAccount} from "../../../reducers/confirmAccount"
import setAuthToken, {removeAxiosAuth} from "../../../utils/networkUtils";
import {loadLocalData, saveAuthToken, saveLocalData, saveUserInfo} from "../../../utils/localStorage";
import i18n from "../../../locale/i18n";
import {number_of_connection} from "../../../utils/config";
import CryptoJS from "react-native-crypto-js";
import * as LocalAuthentication from 'expo-local-authentication';
import FingerprintPopup from '../../../components/fingerPrint/FingerPrintPopUp';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtEmail: "",
      txtSecurity: "",
      bRememberMe: false,
      showPwdkey: false,
      loadingAccountsMe: false,
      isLoading: false,
      passwordLength: 0,
      displayEmail: true,
      newTxtEmail: "",
      numberOfFailed: 0,
      firstDelete: false,
      popupShowed:false,
      errorMessage: undefined,
      biometric: undefined,
    };

  }

  schema = Joi.object()
    .keys({
      password: Joi.string()
        .min(4)
        .required(),
      email: Joi.string()
        .email()
        .required()
    })
    .with("email", "password");

  scanFingerPrint = async () => {
    try {
      let results = await LocalAuthentication.authenticateAsync();
      if (results.success) {
        this.setState({
          modalVisible: false,
          authenticated: true,
          numberOfFailed: 0,
        });
      } else {
        this.setState({
          numberOfFailed: this.state.numberOfFailed + 1,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  fingerPrintLogin = async () => {
    const emailInLocalStorage = await loadLocalData("rememberMeContent");
    this.hideEmailText(emailInLocalStorage)
    let password = await loadLocalData('password')
    let decrypted = CryptoJS.AES.decrypt(password, emailInLocalStorage).toString(CryptoJS.enc.Utf8);
    this.setState({
      txtEmail: emailInLocalStorage,
      bRememberMe: true,
      displayEmail: false,
      txtSecurity: decrypted
    }, this.onPressLogin);
  };
  async componentDidMount() {
    if (Platform.OS === "android") {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
      Linking.addEventListener("url", this.handleOpenURL);
    }
    let rememberMeBtn = false;

    rememberMeBtn = await loadLocalData("rememberMeBtn");
    if (rememberMeBtn === true) {
      const emailInLocalStorage = await loadLocalData("rememberMeContent");
      this.hideEmailText(emailInLocalStorage)
      let password = await loadLocalData('password')
      if(password){

        // this.scanFingerPrint()
        AppState.addEventListener('change', this.handleAppStateChange);
        // Get initial fingerprint enrolled
        this.detectFingerprintAvailable();

      }
        this.setState({ txtEmail: emailInLocalStorage, bRememberMe: true, displayEmail: false });
    }
    await AsyncStorage.removeItem('auth_token')
  }
  detectFingerprintAvailable = () => {
    LocalAuthentication.hasHardwareAsync()
      .then(success => {
        console.log("success",success)
        this.handleFingerprintShowed()
      })
      .catch(error => this.setState({ errorMessage: error.message, biometric: error.biometric }));
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState && this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      LocalAuthentication.cancelAuthenticate()
      this.detectFingerprintAvailable();
    }
    this.setState({ appState: nextAppState });
  }
  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  handleOpenURL = event => {
    console.log(event.url);
    this.navigate(event.url);
    // do something with the url, in our case navigate(route)
    //this.props.navigation.navigate("ResetPasswd");
  };

  navigate = url => {
    const { navigate } = this.props.navigation;
    if(url !== null) {
      const route = url.replace(/.*?:\/\//g, "");

      const routeName = route.split("?")[0];
      //console.log(routeName);
      let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }
      //console.log(params);
      if (routeName === "reset") {
        navigate("ResetPasswd", params);
      }
      if (routeName === "confirm") {
        this.confirmAccount(params);
        setTimeout(() => {
          if(this.props.confirmPayload !== null) {
            Alert.alert(
              i18n.t('login.activation'),
              i18n.t('login.activationDesc'),
            )
          } else if(this.props.confirmError !== null) {
            Alert.alert(
              i18n.t('login.activation'),
              i18n.t('login.alreadyActivted'),
            )
          }
        }, 1500)
      }
    }
  };

  confirmAccount = (params) => {
    if(params.token !== undefined) {
      this.props.reqConfirmAccount(params.uid, params.token)
    } else {
      this.props.reqConfirmAccount(params.uid, params["amp;token"])
    }
  }

  onChangeEmail = (ID, txtEmail) => {
    if(this.state.firstDelete === true) {
      let email = this.state.txtEmail;
      email = email.slice(0, -1);
      this.setState({txtEmail: "", firstDelete: false})
    } else {
      this.setState({ txtEmail });
    }
    this.setState({ showPwdkey: false });
    this.setState({ displayEmail: true })
  };

  onChangeSecure = ID => {
    this.setState({ showPwdkey: true });
    Keyboard.dismiss();
  };
  onDeleteSecurity = ID => {
    this.setState({ txtSecurity: "", passwordLength: 0 });
    this.setState({ showPwdkey: false });
  };

  onCheckChanged = () => {
    this.setState({ bRememberMe: !this.state.bRememberMe });
  };
  onPressForgotPassword = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "ForgotPasswd"
    });
    this.props.navigation.dispatch(navigateAction);
  };

  onPressPwdKey = key => {
    const {passwordLength} = this.state;
    if(passwordLength < 4) {
      this.setState({ txtSecurity: this.state.txtSecurity + key });
      this.setState({ passwordLength: passwordLength + 1});
    }
  };

  validateCallBack = async (err, value) => {
    // const token = await loadLocalData('token') // To not delete the token when we are clearing the cache of the notification
    // const push = await loadPushData() // Keep in cache the notifications
    // // await deleteMyAccount(); // It's not deleting the account, it's just to clear the cache of the app
    // await saveLocalData("token", token) // Put back the token in the cache
    // await savePushData(push) // Put back push in the cache
    removeAxiosAuth(); // Remove Authorization header when doing the API login call
    if (this.state.bRememberMe === true) {
      saveLocalData("rememberMeBtn", true);
      saveLocalData("rememberMeContent", this.state.txtEmail);
    } else {
      saveLocalData("rememberMeBtn", false);
    }
    if (err === null) {
      saveLocalData("email", this.state.txtEmail);
      var encrypted = CryptoJS.AES.encrypt(this.state.txtSecurity, this.state.txtEmail).toString();
      saveLocalData("password", encrypted);
      this.setState({ isLoading: true, loadingAccountsMe: false });
      this.props.reqLogin({
        username: (this.state.txtEmail).toLowerCase(),
        password: this.state.txtSecurity
      });
    } else {
      this.props.navigation.navigate("ErrorView", {
        errorText: err.details[0].message
      });
    }
  };

  onPressLogin = async () => {
    Joi.validate(
      { email: this.state.txtEmail, password: this.state.txtSecurity },
      this.schema,
      this.validateCallBack
    );
  };
  onPressSignup = async () => {
    this.props.navigation.navigate("SignupView");
  };

  gotoTunnelWelcome = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "TunnelWelcomeView"
    });
    this.props.navigation.dispatch(navigateAction);
  };

  gotoMainTab = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "Main"
    });
    this.props.navigation.dispatch(navigateAction);
  };

  goToRenewPasswordTab = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "RenewPasswd"
    });
    this.props.navigation.dispatch(navigateAction)
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const { auth_token } = this.props.auth_token;
    if (auth_token !== undefined && !this.state.loadingAccountsMe && prevProps.auth_token !== auth_token) {
      saveAuthToken(this.props.auth_token.auth_token);
      setAuthToken(this.props.auth_token.auth_token);
      //kraliss_accounts/me api call => goto main or Tunnel welcome
      this.setState({ loadingAccountsMe: true });
      this.props.reqAccountsMe();
      this.props.reqInitSignIn();
    }
    if (this.props.payLoad !== undefined) {
      const { kra_user, kra_api_money_state } = this.props.payLoad;
      if (kra_user !== undefined) {
        this.props.reqInitAccountsMe();
        if (kra_user.myuser_first_sign_in === true) {
          this.setState({ isLoading: false });
          this.gotoTunnelWelcome();
        }
        else {
          //save kra_user
          await saveUserInfo(this.props.payLoad);

          //Save KYC Status
          await saveLocalData("kycStatus", kra_api_money_state);

          this.setState({ isLoading: false });
          if(kra_user.myuser_password_use_count >= number_of_connection) {
            this.goToRenewPasswordTab()
          } else {
            this.gotoMainTab();
          }
        }
      }
    }

    const { error, errorStatus } = this.props;
    if (error !== undefined && error.length > 0) {
      if(errorStatus === 400 && this.state.numberOfFailed < 3) {
        setTimeout(() => {
          Alert.alert(
            i18n.t('login.wrongPwdTitle'),
            i18n.t('login.wrongPwdDesc', {count: 3 - this.state.numberOfFailed}),
          )
        }, 500)
        this.setState({numberOfFailed: this.state.numberOfFailed + 1})
      }
      if(errorStatus === 400 && this.state.numberOfFailed > 2) {
        setTimeout(() => {
          Alert.alert(
            i18n.t('login.blockedAccountTitle'),
            i18n.t('login.blockedAccountDesc'),
          )
        }, 500)
      }
      if(errorStatus === 403) {
        setTimeout(() => {
          Alert.alert(
            i18n.t('login.blockedAccountTitle'),
            i18n.t('login.blockedAccountDesc'),
          )
        }, 500)
      }
      if(errorStatus === 409) {
        setTimeout(() => {
          Alert.alert(
            i18n.t('login.activateAccountTitle'),
            i18n.t('login.activateAccountDesc'),
            [
              {
                text: i18n.t("login.sendEmail"),
                onPress: () => {
                  this.props.reqActivation(this.state.txtEmail)
                }
              }
            ]
          )
        }, 500)
      }
      if(errorStatus !== 400 && errorStatus !== 403 && errorStatus !== 409) {
        this.props.navigation.navigate("ErrorView", {
          errorText: this.props.error
        }); //dispatch(navigateAction);
      }
      this.props.reqInitSignIn();
      this.props.reqInitAccountsMe();
      this.setState({ isLoading: false, loadingAccountsMe: false });
    }
  };

  hideEmailText = (emailInLocalStorage) => {
    const beforeAt = emailInLocalStorage.split('@')[0]
    const afterAt = emailInLocalStorage.split('@')[1]

    const length1 = beforeAt.length;
    const firstLetter1 = beforeAt.charAt(0);
    const lastLetter1 = beforeAt.charAt(length1-1)

    const length2 = afterAt.length;
    const firstLetter2 = afterAt.charAt(0);
    const lastLetter2 = afterAt.charAt(length2-1)

    let numberOfPoints1="";
    for(let i = 0; i < length1 -2; i++){
      numberOfPoints1 = numberOfPoints1 + "•"
    }
    let numberOfPoints2="";
    for(let j = 0; j < length2 -2; j++){
      numberOfPoints2 = numberOfPoints2 + "•"
    }
    const newTxtEmail = `${firstLetter1}${numberOfPoints1}${lastLetter1}@${firstLetter2}${numberOfPoints2}${lastLetter2}`
    this.setState({newTxtEmail, txtEmail: emailInLocalStorage, firstDelete: true})
  }

  handleFingerprintDismissed = () => {
    this.setState({ popupShowed: false });
  };
  handleFingerprintShowed = () => {
    this.setState({ popupShowed: true });
  };

  render() {
    let buttonEnable = false;
    if (this.state.txtEmail.length != 0 && this.state.txtSecurity.length === 4) {
      buttonEnable = true;
    }
    if (this.state.txtEmail.length === 0 || this.state.txtSecurity.length === 0) {
      buttonEnable = false;
    }

    return (
      <GradientView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled = {Platform.OS === 'ios' ? true : false}
        >



          {this.state.popupShowed && (
            <FingerprintPopup
              style={styles.popup}
              onAuthenticate={()=>this.fingerPrintLogin()}
              handlePopupDismissed={this.handleFingerprintDismissed}
            />
          )}


          <ScrollView
            style={{height: '100%'}}
            contentContainerStyle={{justifyContent: "space-between"}}
          >
            <Loader
              loading={this.state.isLoading}
              typeOfLoad={i18n.t("components.loader.descriptionText")}
            />
            <View style={styles.header}>
              <Image
                style={styles.logo}
                source={require("../../../assets/images/symbol_kraliss.png")}
              />
            </View>

            <View style={styles.center}>
              <KralissInput
                icon={require("../../../assets/images/mail.png")}
                placeHolder={i18n.t("login.placeholderEmail")}
                value={this.state.displayEmail ? this.state.txtEmail : this.state.newTxtEmail}
                onChangeText={this.onChangeEmail}
                keyboardType={"email-address"}
                autoCapitalize
              />
              <KralissCheckBox
                onCheckChanged={this.onCheckChanged}
                isChecked={this.state.bRememberMe}
              />
              <KralissInput
                icon={require("../../../assets/images/lock.png")}
                placeHolder={i18n.t("login.placeholderPassword")}
                value={this.state.txtSecurity}
                onDeleteText={this.onDeleteSecurity}
                showDeleteBtn={this.state.showPwdkey === false ? false : true}
                secureText="true"
                onSecureChange={this.onChangeSecure}
              />
              <TouchableOpacity
                style={styles.textBtn}
                onPress={this.onPressForgotPassword}
              >
                <Text style={styles.forgotPwdBtn}>
                  {i18n.t("login.forgotPassword")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              {this.state.showPwdkey && (
                <KralissPwdKey
                    style={styles.pwdKeyPad}
                    onPressKey={this.onPressPwdKey}
                />
              )}

              <KralissButton
                style={styles.loginBtn}
                onPress={this.onPressLogin}
                title={i18n.t("login.validateButton")}
                enabled={buttonEnable}
              />

              {!this.state.showPwdkey && (
                <View style={styles.footerSignupSection}>
                  <Text style={styles.signupText}>{i18n.t("login.noAccount")}</Text>
                  <TouchableOpacity
                    style={styles.textBtn}
                    // onPress={this.scanFingerPrint}
                    onPress={this.onPressSignup}
                  >
                    <Text style={styles.signupBtnText}>
                      {i18n.t("login.register")}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
                <View>
                    <Text style={styles.versionText}>Version : 2.0.12b00</Text>
                </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 180,
    justifyContent: 'flex-end',
    alignItems: "center"
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  pwdKeyPad: {
    // height: 160,
    width: "98%",
  },
  center: {
      // height: 220,
    justifyContent: "space-around",
    marginTop: 60
  },
  footer: {
    // height: 230,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  forgotPwdBtn: {
    marginLeft: 10,
    marginRight: 0,
    color: "#fff",
    fontSize: RFPercentage(2),
    textAlign: "right"
  },
  footerSignupSection: {
    // height: 60
  },
  loginBtn: {
    width: "100%",
    marginTop: 3,
    height: 55
  },
  signupText: {
    color: "#fff",
    fontSize: RFPercentage(2),
    textAlign: "center"
  },
  signupBtnText: {
    color: "#fff",
    fontSize: RFPercentage(2.5),
    textAlign: "center",
    textDecorationLine: "underline"
  },
    versionText: {
        textAlign: "center",
        paddingVertical: 2,
        fontSize: RFPercentage(1.5)
    },
  textBtn: {
    height: 30,
    justifyContent: "flex-start",
    marginTop: 10
  },
  modal: {
    flex:1,
    // marginHorizontal:24,
    backgroundColor: 'red',
    // opacity:0.4,
    justifyContent: 'center',
    alignItems: 'center',

  },
  innerContainer: {
    // marginTop: '30%',
    padding:50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    fontSize: 22,
    paddingTop: 20,
  },
  popup: {
    width: wp(100) * 0.8,
  }
});

const mapStateToProps = state => {
  const {
    payLoad,
    loading: accountsLoading,
    error: accountsError
  } = state.accountsMeReducer;
  const { auth_token, loading, error: loginError, errorStatus } = state.loginReducer;

  let error = loginError;
  if (accountsError) error = accountsError;

  const {payLoad: confirmPayload, error: confirmError} = state.confirmAccountReducer

  const {payload: emailActivationPayload} = state.activationReducer;
  return {
    payLoad,
    auth_token,
    loading: accountsLoading || loading,
    error,
    confirmPayload,
    confirmError,
    errorStatus,
    emailActivationPayload
  };
};

const mapDispatchToProps = {
  reqLogin,
  reqInitSignIn,
  reqAccountsMe,
  reqInitAccountsMe,
  reqConfirmAccount,
  reqActivation,
  reqInitActivation
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginView);
