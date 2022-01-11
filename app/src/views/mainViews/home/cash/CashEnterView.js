import React, { Component } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Alert,
  Platform
} from "react-native";
import { connect } from "react-redux";

import Loader from "../../../../components/loader/Loader";
import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import i18n from "../../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import {RFPercentage} from "react-native-responsive-fontsize";
import KralissCurrencyInput from "../../../../components/kralissInput/KralissCurrencyInput";
import KralissMoneyIconCell from "../../../../components/kralissListCell/KralissMoneyIconCell";
import { reqQRCodes, reqQRCodesInit } from "../../../../reducers/qrCodes";
import { getDeviceInformations } from "../../../../utils/deviceInfo";
import Geolocation from 'react-native-geolocation-service';

export default class CashEnterView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { title } = params.params;

    this.state = {
      title: title,
      txtCashAmount: "",
      kralissMoney: 0,
      myUnit: "",
      myUnitAPI:"",
      myConversionRate: 0,
      loading: true
    };
  }

  onPressValidate = () => {
    const { kralissMoney, txtCashAmount, myUnit } = this.state;
    setTimeout(() => {
      Alert.alert(
        i18n.t("refillLoader.confirmation"),
        i18n.t("cash.confirmRequest", {
          txtCashAmount,
          myUnit
        }),
        [
          {
            text: i18n.t("beneficiary.cancel"),
            onPress: () => {}
          },
          {
            text: i18n.t("forgotPassword.validateButton"),
            onPress: () => {
              this.sendQRCodeRequest();
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  sendQRCodeRequest = () => {
    this.props.reqQRCodes({
      //message: this.state.message,
      amount: this.state.kralissMoney
    });
  };

  gotoQRCodeView = qrData => {
    this.props.navigation.navigate("QRCodeView", {
      title: this.state.title,
      cashAmount: parseFloat(this.state.txtCashAmount),
      cashUnit: this.state.myUnit,
      cashUnitAPI: this.state.myUnitAPI,
      kralissMoney: this.state.kralissMoney,
      qrData
    });
  };

  showErrorAlert(title, message) {
    setTimeout(() => {
      Alert.alert(
        title,
        message,
        [
          {
            text: i18n.t("passwdIdentify.return"),
            onPress: () => {}
          }
        ],
        { cancelable: true }
      );
    }, 100);
  }

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);

    let cashValue = value.length === 0 ? 0 : parseFloat(value);
    const kralissMoney = cashValue/this.state.myConversionRate;
    this.setState({
      kralissMoney
    });
  };

  componentDidMount = async () => {
    try {
      const value = await getDeviceInformations(Geolocation);
      saveLocalData("mobileInfos", value);
      const myuserInternational = await loadLocalData("myuserInternational");
      this.setState({
        mobileInfos: value,
        myUnitAPI: myuserInternational["@id"],
        myUnit: myuserInternational["currencyCode"],
        myConversionRate: 1,
        loading: false
      });
    } catch (error) {
      this.showErrorAlert(error.message);
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { error, payLoad } = this.props;
    if (error !== undefined && error.length > 0) {
      this.props.reqQRCodesInit();
      let errorTitle = i18n.t("sendMoney.monthThrsholdErrTitle");
      let errorMsg = i18n.t("sendMoney.monthThrsholdMsg");
      this.showErrorAlert(errorTitle, errorMsg);
    }

    if (payLoad !== undefined && payLoad.id !== null) {
      this.props.reqQRCodesInit();
      this.gotoQRCodeView(payLoad);
    }
  };

  render() {
    const { kralissMoney, txtCashAmount } = this.state;
    let buttonEnabled = false;
    if (kralissMoney >= 0.01) {
      buttonEnabled = true;
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>
        <View style={styles.container}>
          <Loader
            loading={this.state.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <WhiteNavHeader
            title={this.state.title}
            onClose={() => this.props.navigation.navigate("Home")}
          />
          <ScrollView style={styles.textContainer}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.txtSectionTitle, { marginTop: 140 }]}>
                {i18n.t("cash.enterCashAmount")}
              </Text>
              <KralissCurrencyInput
                ID="txtCashAmount"
                placeHolder={"0"}
                valueFontSize={{ fontSize: RFPercentage(5.5) }}
                unitFontSize={{ fontSize: RFPercentage(4.0) }}
                value={txtCashAmount}
                unitValue={this.state.myUnit}
                onChangeText={this.onChangeInputText}
              />
              <KralissMoneyIconCell
                style={styles.moneyInfo}
                title={`${i18n.t("sendMoney.thats")} ${kralissMoney.toFixed(
                  2
                )}`}
                titleFontSize={{ fontSize: RFPercentage(2.5) }}
              />
            </View>
          </ScrollView>

          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressValidate}
            title={i18n.t("login.validateButton")}
          />
        </View>
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
    marginLeft: 40,
    marginRight: 40
  },
  txtSectionTitle: {
    color: "#707070",
    fontSize: RFPercentage(2.0),
    marginBottom: 20
  },
  moneyInfo: {
    marginTop: 20,
    marginBottom: 20
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.postQRCodesReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqQRCodes,
  reqQRCodesInit
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(CashEnterView);
