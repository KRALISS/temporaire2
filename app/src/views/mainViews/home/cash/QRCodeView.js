import React, { Component } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Text,
  View,
  Alert,
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";

import Loader from "../../../../components/loader/Loader";
import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import i18n from "../../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import KralissCurrencyInput from "../../../../components/kralissInput/KralissCurrencyInput";
import KralissMoneyIconCell from "../../../../components/kralissListCell/KralissMoneyIconCell";
import { reqDeleteQRCodes } from "../../../../reducers/qrCodes";
import { reqQRStatus, reqQRStatusInit } from "../../../../reducers/qrStatus";
import QRCode from 'react-native-qrcode-svg';
const timer = require("react-native-timer");

export default class QRCodeView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { title, cashAmount, cashUnit,cashUnitAPI, kralissMoney, qrData } = params.params;

    this.state = {
      title: title,
      cashAmount,
      cashUnit,
      cashUnitAPI,
      kralissMoney,
      qrData
    };
  }

  deleteQRCodeRequest = () => {
    this.props.reqDeleteQRCodes(this.state.qrData.id);
  };

  requestQRStatus = () => {
    timer.setTimeout(
      this,
      "reqQRStats",
      () => {
        this.props.reqQRStatus({ qr_code_id: this.state.qrData.id });
      },
      2000
    );
  };

  gotoCashConfirmView = statusData => {
    this.props.navigation.navigate("CashConfirm", { data: statusData });
  };

  backToCashEnterView = () => {
    this.deleteQRCodeRequest();
    this.props.navigation.goBack();
  };

  backToHome = () => {
    this.deleteQRCodeRequest();
    this.props.navigation.navigate("Home");
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

  componentDidMount = () => {
    this.requestQRStatus();
  };

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { error, payLoad } = this.props;
    if (error !== undefined && error.length > 0) {
      this.props.reqQRStatusInit();
      const { code, status } = error;
      if (code !== undefined) {
        if (code === "0") {
          this.backToCashEnterView();
        }
        if (code === "1") {
          this.requestQRStatus();
        }
      }
    }

    if (payLoad !== undefined && payLoad.status !== null) {
      if (payLoad.status === "pending") {
        this.props.reqQRStatusInit();
        this.requestQRStatus();
      } else if (payLoad.status === "ok") {
        this.props.reqQRStatusInit();
        this.gotoCashConfirmView(payLoad.transfer_informations);
      }
    }
  };

  render() {
    const { kralissMoney, cashAmount, cashUnit,cashUnitAPI } = this.state;

    return (
        <SafeAreaView style={styles.container}>
        <WhiteNavHeader
          title={this.state.title}
          onBack={this.backToCashEnterView}
          onCancel={this.backToHome}
        />
        <View style={styles.mainContent}>
          <QRCode
            value={JSON.stringify({ qr_id: this.state.qrData.id, qrAmount: cashAmount, cashUnit:cashUnit,cashUnitAPI:cashUnitAPI })}
            size= {300}
          />
          <Text style={[styles.txtSectionTitle, { marginTop: 40 }]}>
            {i18n.t("cash.amountRequested")}
          </Text>
          <Text style={[styles.txtTxtAmount, { marginTop: 10 }]}>
            {`${cashAmount.toFixed(2)} ${cashUnit}`}
          </Text>
          <KralissMoneyIconCell
            style={styles.moneyInfo}
            title={`${i18n.t("sendMoney.thats")} ${kralissMoney.toFixed(2)}`}
            titleFontSize={{ fontSize: RFPercentage(3) }}
          />
        </View>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff"
  },
  mainContent: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  txtSectionTitle: {
    color: "#adadad",
    fontSize: RFPercentage(2.0)
  },
  txtTxtAmount: {
    color: "#adadad",
    fontSize: RFPercentage(5.0)
  },
  moneyInfo: {
    marginTop: 10
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.sentQRStatusReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqDeleteQRCodes,
  reqQRStatus,
  reqQRStatusInit
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(QRCodeView);
