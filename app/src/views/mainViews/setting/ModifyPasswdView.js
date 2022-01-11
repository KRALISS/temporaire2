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
import CryptoJS from "react-native-crypto-js";

import Loader from "../../../components/loader/Loader";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissRectButton from "../../../components/kralissButton/KralissRectButton";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import {RFPercentage} from "react-native-responsive-fontsize";
import KralissGreyInput from "../../../components/kralissInput/KralissGreyInput";
import KralissMoneyIconCell from "../../../components/kralissListCell/KralissMoneyIconCell";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import { reqAuthPasswd, reqAuthPasswdInit } from "../../../reducers/authPasswd";

export default class ModifyPasswdView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      txtOldPasswd: "",
      txtNewPasswd: "",
      txtConfPasswd: "",
      bShowPwdKey: false
    };
  }

  onPressValidate = async () => {
    const email = await loadLocalData("email");
    const pwdEncrypted = await loadLocalData("password");
    const password = CryptoJS.AES.decrypt(pwdEncrypted, email).toString(CryptoJS.enc.Utf8);
    if (this.state.txtOldPasswd !=  password){
      this.showErrorAlert(i18n.t("settings.errorPassword"));
      this.props.reqAuthPasswdInit()
    }
    else{
      this.props.reqAuthPasswd(this.state.txtNewPasswd);
    }

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

  componentDidUpdate = async (prevProps, prevState) => {
    const { success, error } = this.props;
    if (success === true) {
      const email = await loadLocalData("email");
      const encryptedPwd = CryptoJS.AES.encrypt(this.state.txtNewPasswd,email).toString();
      saveLocalData("password", encryptedPwd);

      this.props.reqAuthPasswdInit()
      this.props.navigation.navigate("SettingSuccess", {
        title: i18n.t("contacts.succResetTitle"),
        description: "",
        returnNavigate: "Setting"
      });
    }
    if (error !== undefined && this.props.error.length > 0) {
      this.showErrorAlert(i18n.t("settings.errorPassword"));
      this.props.reqAuthPasswdInit()
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
      bShowPwdKey,
      txtOldPasswd,
      txtNewPasswd,
      txtConfPasswd
    } = this.state;
    let buttonEnabled = false;
    let differentPasswordError =false ;
    if (
      txtNewPasswd.length > 0 &&
      txtOldPasswd.length > 0 &&
      txtNewPasswd === txtConfPasswd
    ) {
      buttonEnabled = true;
    }
    if (
      txtNewPasswd.length == 4 &&
      txtConfPasswd.length == 4 &&
      txtNewPasswd != txtConfPasswd
    ) {
      differentPasswordError = true;
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>
        <SafeAreaView style={styles.container}>
          <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>

          <WhiteNavHeader
            title={i18n.t("settings.changePasswd")}
            onBack={() => this.props.navigation.goBack()}
          />
          <ScrollView style={styles.textContainer}>
            <Text style={styles.sectionText}>
              {i18n.t("modifyPasswd.modifyDesc")}
            </Text>
            <Text style={styles.txtSectionTitle}>
              {i18n.t("modifyPasswd.inputOldPasswd")}
            </Text>
            <KralissGreyInput
              ID="txtOldPasswd"
              secureText="true"
              placeHolder={i18n.t("modifyPasswd.oldPasswd")}
              value={txtOldPasswd}
              onSecureChange={this.onSecureChange}
              onDeleteText={this.onDeleteSecurity}
              showDeleteBtn={bShowPwdKey === false ? false : true}
            />
            <Text style={styles.txtSectionTitle}>
              {i18n.t("modifyPasswd.newPasswd")}
            </Text>
            <KralissGreyInput
              ID="txtNewPasswd"
              secureText="true"
              placeHolder={i18n.t("modifyPasswd.newPasswd")}
              value={txtNewPasswd}
              onSecureChange={this.onSecureChange}
              onDeleteText={this.onDeleteSecurity}
              showDeleteBtn={bShowPwdKey === false ? false : true}
            />

            <KralissGreyInput
              style={styles.marginCell}
              ID="txtConfPasswd"
              secureText="true"
              placeHolder={i18n.t("modifyPasswd.confirmPasswd")}
              value={txtConfPasswd}
              onSecureChange={this.onSecureChange}
              onDeleteText={this.onDeleteSecurity}
              showDeleteBtn={bShowPwdKey === false ? false : true}
            />
            {differentPasswordError && <Text
              style={[styles.txtDesc, styles.marginSection, styles.marginLR]}
            >
              {i18n.t("modifyPasswd.passwordMatchError")}
            </Text>  
            }
          </ScrollView>
          {bShowPwdKey && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <KralissPwdKey
                  style={styles.pwdKeyPad}
                  onPressKey={this.onPressPwdKey}
              />
            </View>
          )}
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
  },
  txtDesc: {
    color: "#DC143C",
    fontSize: RFPercentage(2.1)
  },
  marginSection: {
    marginTop: 20
  },
  marginLR: {
    marginLeft: 20,
    marginRight: 20
  }
});

const mapStateToProps = state => {
  const { loading, error, success } = state.authPasswdReducer;
  return { loading, error, success };
};

const mapDispatchToProps = {
  reqAuthPasswd,
  reqAuthPasswdInit
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyPasswdView);
