import { TouchableOpacity, StyleSheet, View, Text, Image, ScrollView } from "react-native";
import React, { Component } from "react";
import {RFPercentage} from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { reqResetPasswd,reqInitResetPasswd } from "../../../reducers/resetPasswd"
import GradientView from "../../../components/gradientView/GradientView";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissButton from "../../../components/kralissButton/KralissButton";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import {removeAxiosAuth} from "../../../utils/networkUtils";

//Add i18n
import i18n from "../../../locale/i18n";

export default class ResetPasswdView extends Component {
  state = {
    txtEmail: "",
    txtSecurity: "",
    txtConfSecurity: "",
    passwordLength: 0,
    passwordConfirmLength: 0,
    curSelSecurityID: "",
    showPwdkey: false,
    uid: "",
    token: ""
  };

  componentDidMount() {
    const param = this.props.navigation.state;
    this.setState({ txtEmail: param.params.email });
    this.setState({ uid: param.params.uid });
    this.setState({ token: param.params.token });
    this.props.reqInitResetPasswd();
  }

  componentDidUpdate() {
    const { payLoad } = this.props
    if(payLoad !== null) {
      const navigateAction = NavigationActions.navigate({
        routeName: "Login"
      });
      this.props.navigation.dispatch(navigateAction);
    }
  }

  onSecureChange = ID => {
    this.setState({ curSelSecurityID: ID });
    this.setState({ showPwdkey: true });
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

  onPressSend = () => {
    removeAxiosAuth(); // Remove Authorization header when doing the API login call
    const {uid, token, txtSecurity, txtConfSecurity} = this.state
    this.props.reqResetPasswd(uid, token, txtSecurity, txtConfSecurity)
  };

  onPressSignup = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "SignupView"
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    return (
      <GradientView style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/symbol_kraliss.png")}
          />
        </View>
        <ScrollView
          style={{height: '70%'}}
          contentContainerStyle={{flex:1, justifyContent: "space-between"}}
        >
          <View style={styles.center}>
            <KralissInput
              icon={require("../../../assets/images/mail.png")}
              placeHolder={i18n.t("resetPassword.placeholderEmail")}
              value={this.state.txtEmail}
              editible={false}
              keyboardType={"email-address"}
              autoCapitalize
            />
            <KralissInput
              ID="1"
              icon={require("../../../assets/images/lock.png")}
              placeHolder={i18n.t("resetPassword.new")}
              value={this.state.txtSecurity}
              onDeleteText={this.onDeleteSecurity}
              showDeleteBtn={true}
              secureText="true"
              onSecureChange={this.onSecureChange}
            />
            <KralissInput
              ID="2"
              icon={require("../../../assets/images/lock.png")}
              placeHolder={i18n.t("resetPassword.confirmNew")}
              value={this.state.txtConfSecurity}
              onDeleteText={this.onDeleteSecurity}
              showDeleteBtn={true}
              secureText="true"
              onSecureChange={this.onSecureChange}
            />
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
              onPress={this.onPressSend}
              title="Valider"
              enabled={true}
            />

            {!this.state.showPwdkey && (
              <View style={styles.footerSignupSection}>
                <Text style={styles.signupText}>
                  {i18n.t("resetPassword.noAccount")}
                </Text>
                <TouchableOpacity
                  style={styles.textBtn}
                  onPress={this.onPressSignup}
                >
                  <Text style={styles.signupBtnText}>
                    {i18n.t("resetPassword.register")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: "30%",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  center: {
    flex: 1,
    justifyContent: "center"
  },
  forgotPwdBtn: {
    marginLeft: 10,
    marginRight: 0,
    color: "#fff",
    fontSize: RFPercentage(2),
    textAlign: "right"
  },
  pwdKeyPad: {
    marginBottom: 10,
    height: 160,
    width: "98%"
  },
  footer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center"
  },
  footerSignupSection: {
    height: 60,
    marginBottom: 20
  },
  loginBtn: {
    width: "100%",
    height: 55,
    marginBottom: 10
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
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 10
  }
});

const mapStateToProps = state => {
  const {payLoad, error,loading} = state.resetPasswdReducer
  return {payLoad, error, loading}
}

const mapDispatchToProps = {
  reqResetPasswd,
  reqInitResetPasswd
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ResetPasswdView)