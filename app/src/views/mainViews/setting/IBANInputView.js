import React, { Component } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { Item } from "native-base";
import {RFPercentage} from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../locale/i18n";
import Loader from "../../../components/loader/Loader";
import {
  reqInitAccountsMe,
  reqPatchAccountsMe
} from "../../../reducers/accountsMe";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";

export default class IBANInputView extends Component {
  state = {
    IBAN: ""
  };

  onPressValidate = () => {
    this.props.reqPatchAccountsMe({ kra_iban: this.state.IBAN });
  };

  onChangeInputText = value => {
    this.setState({ IBAN: value });
  };

  componentWillMount = async () => {
    const IBAN = await loadLocalData("kraIban");
    if (IBAN !== null) {
      this.setState({ IBAN });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.success !== undefined && this.props.success.length > 0) {
      //Set IBAN value
      this.props.reqInitAccountsMe();
      this.props.navigation.navigate("SettingSuccess", {
        title: i18n.t("settings.ibanSuccess"),
        subTitle: i18n.t("settings.ibanSuccessSubtitle"),
        description: "",
        returnNavigate: "Setting"
      });
      saveLocalData("kraIban", this.state.IBAN);
    }
    if (this.props.error !== undefined && this.props.error.length > 0) {
      this.props.reqInitAccountsMe();
      this.showErrorAlert(this.props.error);
    }
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        "",
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
    let buttonEnable = true;
    if (this.state.IBAN.length === 0) buttonEnable = false;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>
        <SafeAreaView style={styles.container}>
          <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
          <View style={styles.subContainer}>
            <WhiteNavHeader
                title={i18n.t("tunnel.IBAN")}
                onBack={() => {
                  this.props.navigation.goBack();
                }}
            />
            <View style={{paddingLeft: 20, paddingRight: 20, marginTop: 30}}>
              <Text style={styles.skipDescText}>
                {i18n.t("personalInfo.yourIBAN")}
              </Text>

              <Item style={styles.item}>
                <TextInput
                    style={styles.textInput}
                    placeholderTextColor="#cecece"
                    placeholder={i18n.t("tunnel.IBAN")}
                    value={this.state.IBAN}
                    onChangeText={this.onChangeInputText}
                />
              </Item>

              <Text style={styles.skipDescText}>
                {i18n.t("tunnel.skipStepDesc")}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={
                buttonEnable ? styles.buttonEnabled : styles.buttonDisabled
              }
              onPress={this.onPressValidate}
            >
              <Text style={styles.buttonTitle}>
                {i18n.t("login.validateButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1
  },
  subContainer: {
    flex: 1
  },
  marginCell: {
    marginTop: 12
  },
  marginSection: {
    marginTop: 20
  },
  item: {
    marginTop: 30,
    borderBottomColor: "#cecece"
  },
  skipDescText: {
    marginTop: 30,
    color: "#484848",
    fontSize: RFPercentage(2.0)
  },
  yourIBANText: {
    marginTop: 30,
    color: "#707070",
    fontSize: RFPercentage(2.0)
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#000",
    fontSize: RFPercentage(2.2)
  },
  buttonContainer: {
    height: 60,
    // position: "absolute",
    // bottom: 0
  },
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
  }
});

const mapStateToProps = state => {
  const { success, payLoad, loading, error } = state.accountsMeReducer;
  return {
    success,
    payLoad,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqPatchAccountsMe,
  reqInitAccountsMe
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(IBANInputView);
