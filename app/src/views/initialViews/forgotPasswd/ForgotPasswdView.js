import { TouchableOpacity, StyleSheet, View, Text, AsyncStorage } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
import Joi from "react-native-joi";
import { NavigationActions } from "react-navigation";
import GradientView from "../../../components/gradientView/GradientView";
import NavHeader from "../../../components/navHeader/NavHeader";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissButton from "../../../components/kralissButton/KralissButton";
import { reqForgotPasswd } from "../../../reducers/forgotPasswd";
import {removeAxiosAuth} from "../../../utils/networkUtils";

//Add i18n
import i18n from "../../../locale/i18n";

class ForgotPasswdView extends Component {
  state = {
    txtEmail: ""
  };
  schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
  });

  onChangeEmail = (ID, txtEmail) => {
    this.setState({ txtEmail });
  };

  validateCallBack = async (err, value) => {
    removeAxiosAuth(); // Remove Authorization header when doing the API login call
    if (err === null) {
      this.props.reqForgotPasswd(this.state.txtEmail);
      const navigateAction = NavigationActions.navigate({
        routeName: "ConfirmEmailSent",
        params: { email: this.state.txtEmail }
      });
      this.props.navigation.dispatch(navigateAction);
    } else {
      this.props.navigation.navigate("ErrorView", {
        errorText: err.details[0].message
      });
    }
  };

  onPressLogin = () => {
    Joi.validate(
      { email: this.state.txtEmail },
      this.schema,
      this.validateCallBack
    );
  };

  onPressSignup = () => {
    this.props.navigation.navigate("SignupView");
  };

  render() {
    let buttonEnable = true;
    if (this.state.txtEmail.length === 0) buttonEnable = false;
    return (
      <GradientView style={styles.container}>
        <NavHeader
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {i18n.t("forgotPassword.header")}
          </Text>
        </View>
        <View style={styles.center}>
          <KralissInput
            icon={require("../../../assets/images/mail.png")}
            placeHolder={i18n.t("forgotPassword.placeholderEmail")}
            value={this.state.txtEmail}
            onChangeText={this.onChangeEmail}
            keyboardType={"email-address"}
            autoCapitalize
          />
          <KralissButton
            style={styles.sendBtn}
            onPress={this.onPressLogin}
            title={i18n.t("forgotPassword.validateButton")}
            enabled={buttonEnable}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.footerSignupSection}>
            <Text style={styles.signupText}>
              {i18n.t("forgotPassword.noAccount")}
            </Text>
            <TouchableOpacity
              style={styles.textBtn}
              onPress={this.onPressSignup}
            >
              <Text style={styles.signupBtnText}>
                {i18n.t("forgotPassword.register")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  header: {
    width: "100%",
    flex: 0.5,
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  headerText: {
    color: "#fff",
    fontSize: RFPercentage(2.2),
    textAlign: "left"
  },
  center: {
    flex: 1,
    justifyContent: "center"
  },
  footer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  footerSignupSection: {
    height: 60,
    marginBottom: 20
  },
  sendBtn: {
    width: "100%",
    height: 55,
    marginTop: 20
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
  const { loading, error } = state.forgotPasswdReducer;
  return { loading };
};

const mapDispatchToProps = {
  reqForgotPasswd
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswdView);
