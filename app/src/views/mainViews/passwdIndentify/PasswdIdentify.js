import React, {Component} from "react";
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, AppState, Linking} from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";
import {connect} from "react-redux";
import Loader from "../../../components/loader/Loader";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import {reqConfirmPasswd, reqInitConfirmPasswd} from "../../../reducers/confirmPasswd";
//Add i18n
import i18n from "../../../locale/i18n";
import {loadLocalData} from "../../../utils/localStorage";
import CryptoJS from "react-native-crypto-js";
import FingerprintPopup from "../../../components/fingerPrint/FingerPrintPopUp";
import * as LocalAuthentication from "expo-local-authentication";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

class PasswdIdentify extends Component {


  onPressPwdKey = key => {
    if (this.state.nPwdCurLegnth < 4) {
      let passwords = [...this.state.passwords, key];
      let nPwdCurLegnth = this.state.nPwdCurLegnth + 1;
      this.setState({ passwords, nPwdCurLegnth });
    }
  };

  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { title, nextNavigate, paramData } = params.params;
    this.state = {
      title: title,
      email :"",
      nextNavigate: nextNavigate,
      paramData: paramData,
      showPwdkey: true,
      nPwdCurLegnth: 0,
      nTryCount: 3,
      passwords: [],
      passwordKeys: [1, 2, 3, 4],
      popupShowed:false
    };
  }


  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  detectFingerprintAvailable = () => {
    LocalAuthentication.hasHardwareAsync()
      .then(success => {
        console.log("success",success)
        this.handleFingerprintShowed()
      })
      .catch(error => {
        console.log("asdasd",error)
        this.setState({ errorMessage: error.message, biometric: error.biometric })
      });
  }
  handleAppStateChange = (nextAppState) => {
    if (this.state.appState && this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      LocalAuthentication.cancelAuthenticate()
      this.detectFingerprintAvailable();
    }
    this.setState({ appState: nextAppState });
  }

  componentDidMount() {

    this.detectFingerprintAvailable();
  }

  fingerPrintLogin = async () => {
    let password = await loadLocalData('password')
    let email = await loadLocalData('email')
    var decrypted = CryptoJS.AES.decrypt(password, email).toString(CryptoJS.enc.Utf8);
    this.props.reqConfirmPasswd(email,decrypted);
  }

  componentDidUpdate(prevProps, prevState) {
    const { success, error } = this.props;
    if (success !== undefined && success) {
      this.props.reqInitConfirmPasswd();
      //goto success alert
      this.gotoNextNavigate();
    }
    if (error !== undefined && error.length > 0) {
      this.props.reqInitConfirmPasswd();
      if (this.state.nTryCount - 1 === 0) this.showAlert();
      this.setState({ nTryCount: this.state.nTryCount - 1 });
      //dale- For debug-only, remove the comment below.
      //this.gotoNextNavigate();
    }
  }

  onClearPwd = () => {
    this.setState({ passwords: [], nPwdCurLegnth: 0 });
  };

  onValidate = async (password) => {
    if(this.state.nPwdCurLegnth === 4) {
      this.props.reqConfirmPasswd(await loadLocalData('email'),this.state.passwords.join(""));
    }
  };

  showAlert = () => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("passwdIdentify.accountBlocked"),
        i18n.t("passwdIdentify.pleaseResetPasswd"),
        [
          {
            text: i18n.t("passwdIdentify.return"),
            onPress: () => {
              this.props.navigation.navigate("Login");
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  gotoNextNavigate() {
    this.props.navigation.navigate(this.state.nextNavigate, {
      title: this.state.title,
      paramData: this.state.paramData
    });
  }

  handleFingerprintDismissed = () => {
    this.setState({ popupShowed: false });
  };
  handleFingerprintShowed = () => {
    this.setState({ popupShowed: true });
  };

  render() {
    let buttonEnable = false;
    if (this.state.nPwdCurLegnth === 4) buttonEnable = true;

    return (
        <SafeAreaView style={styles.container}>
          {this.state.popupShowed && (
            <FingerprintPopup
              style={styles.popup}
              onAuthenticate={()=>this.fingerPrintLogin()}
              handlePopupDismissed={this.handleFingerprintDismissed}
            />
          )}
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader
          title={this.state.title}
          onClose={() => this.props.navigation.goBack()}
        />

        <View style={styles.contentContainer}>
          <View style={{ flex: 1 }} />

          <View style={styles.descContainer}>
            <Text style={styles.descText}>
              {i18n.t("passwdIdentify.enterCode")}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={styles.inputFieldArea}
              onPress={() => this.setState({ showPwdkey: true })}
            >
              {this.state.passwordKeys.map(value => {
                return (
                  <Image
                    key={value}
                    style={{ flex: 1, aspectRatio: 1 }}
                    source={
                      value <= this.state.nPwdCurLegnth
                        ? require("../../../assets/images/input_password_filled.png")
                        : require("../../../assets/images/input_password_empty.png")
                    }
                  />
                );
              })}
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: "center" }}>
              {this.state.nPwdCurLegnth > 0 && (
                <TouchableOpacity onPress={this.onClearPwd}>
                  <Image
                    source={require("../../../assets/images/times_circle_regular_grey.png")}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {this.state.nTryCount < 3 &&
                i18n.t("passwdIdentify.pwdDesc", {
                  count: this.state.nTryCount
                })}
            </Text>
            <View style={{ flex: 1 }} />
          </View>

          <View style={styles.keyboardcontainer}>
            {this.state.showPwdkey && (
              <KralissPwdKey
                style={styles.pwdKeyPad}
                onPressKey={this.onPressPwdKey}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={
                buttonEnable ? styles.buttonEnabled : styles.buttonDisabled
              }
              onPress={this.onValidate}
            >
              <Text style={styles.buttonTitle}>
                {i18n.t("login.validateButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  navHeaderContainer: {
    height: 70,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderColor: "#6666",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.05
  },
  navHeaderContentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flex: 1
  },
  headerTitle: {
    color: "#707070",
    textAlign: "center",
    fontSize: RFPercentage(2.5)
  },
  closeBtn: {
    position: "absolute",
    left: 20
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  descContainer: {
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  descText: {
    color: "#484848",
    textAlign: "center",
    fontSize: RFPercentage(2.3)
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  inputFieldArea: {
    flex: 6,
    height: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // height: 30
    },
  errorText: {
      // flex: 6,
      // marginLeft: 15,
      paddingVertical: 3,
    color: "#f00",
      textAlign: "center",
    fontSize: RFPercentage(2.3)
  },
  keyboardcontainer: {
      // flex: 1,
    justifyContent: "center",
      alignItems: 'center',
  },
    pwdKeyPad: {
        // marginBottom: 22,
        // height: 160,
        width: "95%"
    },
  buttonContainer: { height: 60, width: "100%", marginTop: 20 },
  buttonTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: RFPercentage(2.8)
  },
  buttonEnabled: {
    width: "100%",
    flex: 1,
    backgroundColor: "#00aca9",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonDisabled: {
    width: "100%",
    flex: 1,
    backgroundColor: "#c7eceb",
    justifyContent: "center",
    alignItems: "center"
  },
  popup: {
    width: wp(100) * 0.8,
  }
});

const mapStateToProps = state => {
  const { success, loading, error } = state.confirmPasswdReducer;

  return {
    loading,
    success,
    error
  };
};

const mapDispatchToProps = {
  reqInitConfirmPasswd,
  reqConfirmPasswd
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswdIdentify);
