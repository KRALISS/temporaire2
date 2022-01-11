import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Text,
  View
} from "react-native";
import { connect } from "react-redux";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import KralissClearCell from "../../../../components/kralissListCell/KralissClearCell";
import {RFPercentage} from "react-native-responsive-fontsize";
import i18n from "../../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import Loader from "../../../../components/loader/Loader";
import {
  reqSentKralissInit,
  reqSentKraliss
} from "../../../../reducers/sentKraliss";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import KralissMoneyIconCell from "../../../../components/kralissListCell/KralissMoneyIconCell";

export default class SendConfirmView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;

    const {
      sendAmount,
      benUser,
      sendUnit,
      sendUnitAPI,
      benUnit,
      benUnitAPI,
      message,
      conversionRate
    } = params.params;

    this.state = {
      benUser,
      sendAmount,
      sendUnit,
      sendUnitAPI,
      benUnit,
      benUnitAPI,
      message,
      conversionRate
    };
  }

  showErrorAlert(title, message) {
    setTimeout(() => {
      Alert.alert(
        title,
        message,
        [
          {
            text: i18n.t("passwdIdentify.return"),
            onPress: () => {this.props.navigation.navigate("Home")}
          }
        ],
        { cancelable: true }
      );
    }, 1000);
  }
  onPressConfirm = async () => {
    const mobileInfos = await loadLocalData("mobileInfos");
    const { benUser, sendAmount, message, conversionRate,sendUnitAPI, benUnit, benUnitAPI} = this.state;
    const kralissAmount = sendAmount / conversionRate;
    this.props.reqSentKraliss({
      requestCode: 0,
      amount: kralissAmount,
      message: message,
      currencyStart: sendUnitAPI,
      currencyEnd: benUnitAPI, //euro
      transactionType: "api/type_transactions/5",
      receiverWallet: benUser["@id"] ? benUser["@id"] : "/api/users/"+benUser["id"]
    });
  };

  componentDidUpdate() {
    const { error, payLoad } = this.props;
    if (error !== undefined) {
      this.props.reqSentKralissInit();
      const { message, error_code } = error;
      let errorTitle = i18n.t("sendMoney.insuffBalance");
      let errorMsg = i18n.t("sendMoney.insuffMsg");
      if (error_code !== undefined) {
        if (error_code === "2") {
          errorTitle = i18n.t("sendMoney.monthThrsholdErrTitle");
          errorMsg = i18n.t("sendMoney.monthThrsholdMsg");
        }
        if (error_code === "3") {
          errorTitle = i18n.t("sendMoney.recipErrorTitle");
          errorMsg = i18n.t("sendMoney.recipErrorMsg");
        }
      }
      this.showErrorAlert(errorTitle, errorMsg);
    }

    if (payLoad !== undefined && payLoad.length > 0) {
      this.props.reqSentKralissInit();
      this.props.navigation.navigate("SendSuccess", {
        title: i18n.t("sendMoney.successTitle"),
        description: i18n.t("refillLoader.findHistoryDesc"),
        returnNavigate: "Home"
      });
    }
  }

  render() {
    const { benUser, sendAmount, conversionRate, sendUnit } = this.state;
    const kralissAmount = sendAmount / conversionRate;
    let buttonEnabled = true;
    return (
        <SafeAreaView style={styles.container}>
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader
          title={i18n.t("refillLoader.confirmation")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
          onCancel={() => this.props.navigation.navigate("Home")}
        />
        <View style={styles.textContainer}>
          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.summaryToTransfer")}
          </Text>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.amountToSend")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={styles.txtBottomDesc}>
              {`${sendAmount.toFixed(2)} ${sendUnit}`}
            </Text>
            <KralissMoneyIconCell
              style={{ position: "absolute", right: 0 }}
              title={`${i18n.t("sendMoney.thats")} ${kralissAmount.toFixed(2)}`}
              titleFontSize={{ fontSize: RFPercentage(2.0) }}
            />
          </View>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.beneficiary")}
          </Text>
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("tunnel.lastName")}
            detailContent={
              benUser.typeAccount == "/api/type_accounts/2"
                ? benUser.companyName
                : `${benUser.firstName} ${benUser.lastName}`
            }
          />
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("login.placeholderEmail")}
            detailContent={benUser.email}
          />
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("sendMoney.accountNumber")}
            detailContent={benUser.kra_account_number}
          />

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.transactionType")}
          </Text>
          <Text style={styles.txtBottomDesc}>
            {i18n.t("sendMoney.sendingMoney")}
          </Text>
        </View>
        <KralissRectButton
          style={styles.buttonContainer}
          enabled={buttonEnabled}
          onPress={this.onPressConfirm}
          title={i18n.t("sendMoney.toConfirm")}
        />
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff"
  },
  textContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 30,
    flexDirection: "column",
    flex: 1
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    marginTop: 20,
    marginBottom: 5
  },
  txtBottomDesc: {
    color: "#484848",
    fontSize: RFPercentage(2.0)
  },
  buttonContainer: {
    height: 60,
    width: "100%",
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.sentKralissReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqSentKraliss,
  reqSentKralissInit
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendConfirmView);
