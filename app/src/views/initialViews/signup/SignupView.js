import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  View,
  Keyboard,
  Text,
  Image,
  Linking,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import  AsyncStorage  from "@react-native-community/async-storage";
import { connect } from "react-redux";
import React, { Component } from "react";
import {RFPercentage} from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import Joi from "react-native-joi";
import CheckBox from 'react-native-modest-checkbox';
import GradientView from "../../../components/gradientView/GradientView";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissCheckBox from "../../../components/kralissCheckBox/KralissCheckBox";
import KralissButton from "../../../components/kralissButton/KralissButton";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import Loader from "../../../components/loader/Loader";
import { reqSignup, reqInitSignup } from "../../../reducers/signup";
import i18n from "../../../locale/i18n";

import {removeAxiosAuth} from "../../../utils/networkUtils";
import {saveLocalData, saveAuthToken} from "../../../utils/localStorage";
import setAuthToken from "../../../utils/networkUtils";


import {reqInitSignIn, reqLogin} from "../../../reducers/login";
import {reqAccountsMe, reqInitAccountsMe} from "../../../reducers/accountsMe";

class SignupView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtEmail: "",
      txtConfEmail: "",
      txtSecurity: "",
      txtConfSecurity: "",
      curSelSecurityID: "",
      bMailConfirmed: false,
      bRememberMe: false,
      showPwdkey: false,
      passwordLength: 0,
      passwordConfirmLength: 0,
      url: "https://www.kraliss.com/cgu",
      checked: false,

      stp1: false,
      stp2: false
    };
  }


  schema = Joi.object().keys({
    password: Joi.string().min(4),
    email: Joi.string().email()
  });

  onChangeEmail = (ID, txtEmail) => {
    // const format = txtEmail.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    this.setState({ txtEmail });
    this.setState({ showPwdkey: false });
  };

  onChangeConfEmail = (ID, txtConfEmail) => {
    // const format = txtConfEmail.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    this.setState({ txtConfEmail });
    this.setState({ showPwdkey: false });
  };

  emailConfirming = () => {
    if (this.state.txtConfEmail === this.state.txtEmail) {
      const result = Joi.validate({ email: this.state.txtEmail }, this.schema);
      if (result.error === null) this.setState({ bMailConfirmed: true });
      else this.setState({ bMailConfirmed: false });
    } else {
      this.setState({ bMailConfirmed: false });
    }
  };

  onChangeSecure = ID => {
    this.setState({ curSelSecurityID: ID });
    this.setState({ showPwdkey: true });
    Keyboard.dismiss();
  };

  onDeleteSecurity = ID => {
    if (ID === "1") {
      this.setState({ txtSecurity: "", passwordLength: 0 })
    }
    else {
      this.setState({ txtConfSecurity: "", passwordConfirmLength: 0 })
    };
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
    const { curSelSecurityID, passwordLength, passwordConfirmLength } = this.state;
    if (curSelSecurityID === "1") {
      if(passwordLength < 4) {
        this.setState({ txtSecurity: this.state.txtSecurity + key, passwordLength: passwordLength + 1 });
      }
    } else {
      if(passwordConfirmLength < 4) {
        this.setState({ txtConfSecurity: this.state.txtConfSecurity + key, passwordConfirmLength: passwordConfirmLength + 1 });
      }
    }
  };

  validateCallBack = (err, value) => {
    removeAxiosAuth(); // Remove Authorization header when doing the API login call
    if (this.state.bRememberMe === true) {
      saveLocalData("rememberMeBtn", true);
      saveLocalData("rememberMeContent", this.state.txtEmail);
    } else {
      saveLocalData("rememberMeBtn", false);
    }
    if(this.state.txtSecurity !== this.state.txtConfSecurity) {
        this.notIdenticalPassword()
    } else if (err === null && (this.state.txtSecurity === this.state.txtConfSecurity)) {
      /*this.props.reqSignup({
        email: (this.state.txtEmail).toLowerCase(),
        username: (this.state.txtEmail).toLowerCase(),
        password: this.state.txtSecurity
      });*/
      saveLocalData("txtEmail", this.state.txtEmail);
      saveLocalData("password", this.state.txtSecurity);
      this.props.navigation.navigate("TunnelWelcomeView")

    } else { 
      this.props.navigation.navigate("ErrorView", {
        errorText: err.details[0].message
      });
    }
  };

  onPressSignup = async () => {
    this.emailConfirming();
    Joi.validate(
      {
        email: this.state.txtEmail,
        password: this.state.txtSecurity
      },
      this.schema,
      this.validateCallBack
    );
  };

  onPressOpenTermsAndService = () => {
    Linking.canOpenURL(this.state.url).then(supported => {
      if (supported) {
        Linking.openURL(this.state.url);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };

  notIdenticalPassword = () => {
    setTimeout(() => {
        Alert.alert(
            i18n.t("signup.titleNotIdentical"),
            i18n.t("signup.descNotIdentical"),
            [
                {
                    text:i18n.t("components.errorView.return"),
                    onPress: () => {}
                }
            ],
            { cancelable: true }
        );
    }, 500);
  }

  showCheckEmailAlert = () => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("signup.confirm"),
        i18n.t("signup.emailSentMessage"),
        [
          {
            text: i18n.t("confirmResetPassword.done"),
            onPress: () => {
              this.props.reqInitSignup();
              const navigateAction = NavigationActions.navigate({
                routeName: "Login"
              });
              this.props.navigation.dispatch(navigateAction);
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("signup.accountExistTitle"),
        i18n.t("signup.accountExistDesc"),
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

  gotoTunnelWelcome = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "TunnelWelcomeView"
    });
    this.props.navigation.dispatch(navigateAction);
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { id } = this.props;
    if (id !== undefined && id !== "" && prevProps.id !== id) {
      // this.showCheckEmailAlert();
      this.props.reqLogin({
        email: (this.state.txtEmail).toLowerCase(),
        password: this.state.txtSecurity
      });
      saveLocalData("email", this.state.txtEmail);
    }

    if (this.props.error !== null && this.props.error !== "") {
      if(this.props.errorInfo === "A user with that username already exists.") {
        this.showErrorAlert()
      } else {
        this.props.navigation.navigate("ErrorView", {
          errorText: this.props.error
        });
      }
      this.props.reqInitSignup();
    }

    //Error handling for signin and signup
    if(this.props.loginError !== undefined || this.props.accountsError !== undefined) {
      this.props.navigation.navigate("ErrorView", {
        errorText: this.props.error
      });
      this.props.reqInitSignIn();
      this.props.reqInitAccountsMe();
      this.setState({stp1: false})
    }

    // //Handling Sign in
    // if(prevProps.auth_token !== this.props.auth_token && this.state.stp1 === false) {
    //   console.log("JE ME LOGIN")
    //   this.setState({stp1: true})
    //   saveAuthToken(this.props.auth_token.auth_token);
    //   setAuthToken(this.props.auth_token.auth_token);
    //   this.props.reqAccountsMe();
    //   this.props.reqInitSignIn();
    // }
    // //Handling Account info
    // if(this.props.payLoad !== undefined) {
    //   const { kra_user } = this.props.payLoad;
    //   if(kra_user !== undefined) {
    //     this.props.reqInitAccountsMe()
    //     if(kra_user.myuser_first_sign_in === true) {
    //       this.gotoTunnelWelcome()
    //     }
    //   }
    // }
  };

  onCheckChanged = (type) => {
    if(type === "tos") {
      this.setState({checked: !this.state.checked})
    } else {
      this.setState({bRememberMe: !this.state.bRememberMe})
    }

  }

  render() {
    //console.log(this.props.loading);
    let buttonEnable = true;
    if (
      this.state.txtEmail.length === 0 ||
      this.state.txtSecurity.length === 0 ||
      this.state.txtConfEmail.length === 0 ||
      this.state.txtConfSecurity.length === 0
    ) {
      buttonEnable = false;
    }
    if(this.state.txtEmail !== this.state.txtConfEmail) {
      buttonEnable = false
    }
    if(this.state.checked === false) {
      buttonEnable = false
    }

    return (
      <GradientView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled = {Platform.OS === 'ios' ? true : false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => this.props.navigation.navigate('Login')}
            >
              <Image source={require("../../../assets/images/chevron.png")} />
            </TouchableOpacity>
            <Image
              style={styles.logo}
              source={require("../../../assets/images/symbol_kraliss.png")}
            />
            <Text style={styles.titleText}>{i18n.t("signup.registration")}</Text>
          </View>
          <ScrollView
            style={{height: '78%'}}
            contentContainerStyle={{justifyContent: "space-between"}}
          >
            <View style={styles.center}>
              <KralissInput
                placeHolder={i18n.t("login.placeholderEmail")}
                value={this.state.txtEmail}
                onChangeText={this.onChangeEmail}
                keyboardType={"email-address"}
                autoCapitalize
              />
              <KralissInput
                confirmIcon={require("../../../assets/images/check_circle_solid.png")}
                placeHolder={i18n.t("signup.placeholderConfirmEmail")}
                isConfirmed={this.state.bMailConfirmed}
                value={this.state.txtConfEmail}
                onChangeText={this.onChangeConfEmail}
                keyboardType={"email-address"}
                autoCapitalize
              />
              <KralissCheckBox
                onCheckChanged={this.onCheckChanged}
                isChecked={this.state.bRememberMe}
              />
              <KralissInput
                ID="1"
                placeHolder={i18n.t("login.placeholderPassword")}
                value={this.state.txtSecurity}
                onDeleteText={this.onDeleteSecurity}
                showDeleteBtn={true}
                secureText="true"
                onSecureChange={this.onChangeSecure}
              />
              <KralissInput
                ID="2"
                placeHolder={i18n.t("signup.placeholderConfirmPasswd")}
                value={this.state.txtConfSecurity}
                onDeleteText={this.onDeleteSecurity}
                showDeleteBtn={true}
                secureText="true"
                onSecureChange={this.onChangeSecure}
              />
            </View>

            <View style={styles.footer}>
              {this.state.showPwdkey && (
                <KralissPwdKey
                  style={{ height: 160, width: "98%" }}
                  onPressKey={this.onPressPwdKey}
                />
              )}
              {/* {!this.state.showPwdkey && ( */}
                <View style={styles.footerSignupSection}>
                  <Text style={styles.signupText}>
                    {i18n.t("signup.IAcceptByRegsitering")}
                  </Text>
                  <View style={{display:"flex", flexDirection:"row", width:"100%"}}>
                    <CheckBox
                      checked={this.state.checked}
                      style={{marginTop:4, marginRight:5}}
                      onChange={(checked) => this.onCheckChanged("tos")}
                      label=""
                    />
                    <TouchableOpacity
                      style={styles.textBtn}
                      onPress={this.onPressOpenTermsAndService}
                    >
                      <Text style={styles.signupBtnText}>{i18n.t("signup.TS")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              {/* )} */}
              <KralissButton
                style={styles.loginBtn}
                onPress={this.onPressSignup}
                title={i18n.t("login.validateButton")}
                enabled={buttonEnable}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Loader loading={this.props.loading} />
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: "22%",
    justifyContent: "center",
    alignItems: "center"
  },
  backBtn: {
    position: "absolute",
    left: 0
  },
  logo: {
    width: 45,
    height: 45
  },
  titleText: {
    color: "#fff",
    fontSize: RFPercentage(4.5),
    textAlign: "center"
  },
  pwdKeyPad: {
    height: "50%",
    width: "100%"
  },
  center: {
    height: 280,
    justifyContent: "space-around",
    paddingBottom: 12
  },
  footer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  forgotPwdBtn: {
    marginLeft: 10,
    marginRight: 0,
    color: "#fff",
    fontSize: RFPercentage(2),
    textAlign: "right"
  },
  footerSignupSection: {
    height: 60
  },
  loginBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20
  },
  signupText: {
    color: "#fff",
    fontSize: RFPercentage(2),
    textAlign: "center"
  },
  signupBtnText: {
    color: "#fff",
    fontSize: RFPercentage(2),
    textAlign: "center",
    textDecorationLine: "underline"
  },
  textBtn: {
    height: 30,
    justifyContent: "flex-start",
    marginTop: 10,
    marginLeft: -5
  }
});

const mapStateToProps = state => {
  const { id, loading, error, errorInfo } = state.signupReducer;
  const { auth_token, loading: loginLoading, error: loginError } = state.loginReducer;
  const {
    payLoad,
    loading: accountsLoading,
    error: accountsError
  } = state.accountsMeReducer;

  return {
    id,
    loading,
    error,
    errorInfo,
    auth_token,
    loginLoading,
    loginError,
    payLoad,
    accountsLoading,
    accountsError
  };
};

const mapDispatchToProps = {
  reqSignup,
  reqInitSignup,
  reqLogin, 
  reqInitSignIn,
  reqAccountsMe,
  reqInitAccountsMe,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupView);
