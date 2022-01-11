import { TouchableOpacity, StyleSheet, View, Text, Image, Alert } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import GradientView from "../../../components/gradientView/GradientView";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissButton from "../../../components/kralissButton/KralissButton";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";

import { reqAuthPasswd, reqAuthPasswdInit } from "../../../reducers/authPasswd";

//Add i18n
import i18n from "../../../locale/i18n";

class RenewPasswdView extends Component {
  state = {
    txtPrevSecuriy: "",
    txtSecurity: "",
    txtConfSecurity: "",
    curSelSecurityID: "",
    showPwdkey: false,
  };

  onSecureChange = ID => {
    this.setState({ curSelSecurityID: ID });
    // this.setState({ showPwdkey: true });
  };

  onDeleteSecurity = ID => {
    if (ID === "1") this.setState({ txtPrevSecuriy: "" });
    else if (ID === "2") this.setState({ txtSecurity: "" });
    else this.setState({ txtConfSecurity: "" });
    // this.setState({ showPwdkey: false });
  };

  onPressPwdKey = key => {
    const { curSelSecurityID, txtPrevSecuriy, txtSecurity, txtConfSecurity } = this.state;
    if (curSelSecurityID === "1") {
      if(txtPrevSecuriy.length < 4 ) {
        this.setState({ txtPrevSecuriy: this.state.txtPrevSecuriy + key });
      }
    } else if (curSelSecurityID === "2") {
      if(txtSecurity.length < 4 ) {
        this.setState({ txtSecurity: this.state.txtSecurity + key });
      }
    } else if (curSelSecurityID === "3") {
      if(txtConfSecurity.length < 4) {
        this.setState({ txtConfSecurity: this.state.txtConfSecurity + key });
      }
    }
  };

  onPressSend = () => {
    const {txtPrevSecuriy, txtSecurity} = this.state;
    this.props.reqAuthPasswd({
      current_password: txtPrevSecuriy,
      new_password: txtSecurity,
      re_new_password: txtSecurity
    })
  };
  onPressSignup = () => {

  };

  goToMainTab = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "Main"
    });
    this.props.navigation.dispatch(navigateAction);
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const { success, error } = this.props;
    if(success === true) {
      this.goToMainTab();
    }
    if (error !== undefined && this.props.error.length > 0) {
      this.props.reqAuthPasswdInit()
      this.showErrorAlert(this.props.error);
    }
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

  render() {

    let {txtPrevSecuriy, txtSecurity, txtConfSecurity, enable} = this.state
    let btnEnabled = txtPrevSecuriy && txtSecurity && txtSecurity === txtConfSecurity
    return (
      <GradientView style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/symbol_kraliss.png")}
          />
          <Text style={styles.headerText}>
            {i18n.t("renewPassword.headerText")}
          </Text>
        </View>

        <View style={styles.center}>
          <KralissInput
            ID="1"
            placeHolder={i18n.t("renewPassword.former")}
            value={this.state.txtPrevSecuriy}
            onDeleteText={this.onDeleteSecurity}
            showDeleteBtn={true}
            secureText="true"
            onSecureChange={this.onSecureChange}
          />
          <KralissInput
            ID="2"
            placeHolder={i18n.t("renewPassword.new")}
            value={this.state.txtSecurity}
            onDeleteText={this.onDeleteSecurity}
            showDeleteBtn={true}
            secureText="true"
            onSecureChange={this.onSecureChange}
          />
          <KralissInput
            ID="3"
            placeHolder={i18n.t("renewPassword.newConfirm")}
            value={this.state.txtConfSecurity}
            onDeleteText={this.onDeleteSecurity}
            showDeleteBtn={true}
            secureText="true"
            onSecureChange={this.onSecureChange}
          />
        </View>

        <View style={styles.footer}>
          <KralissPwdKey
            style={styles.pwdKeyPad}
            onPressKey={this.onPressPwdKey}
          />
          <KralissButton
              style={styles.loginBtn}
              onPress={this.onPressSend}
              title="Valider"
              enabled={btnEnabled}
          />
        </View>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flex: 0.5,
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerText: {
    color: "#fff",
    textAlign: "center"
  },
  logo: {
    marginTop: 30,
    width: 45,
    height: 45
  },
  center: {
    flex: 1,
    justifyContent: "center"
  },
  pwdKeyPad: {
      // height: 160,
      marginBottom: 22,
      // height: 160,
      width: "95%",
  },
  footer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  loginBtn: {
    width: "100%",
    height: 55
  }
});

const mapStateToProps = state => {
  const { loading, error, success } = state.authPasswdReducer;
  return { loading, error, success};
}

const mapDispatchToProps = {
  reqAuthPasswd,
  reqAuthPasswdInit
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(RenewPasswdView);
