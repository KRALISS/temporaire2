import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
  View,
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import KralissClearCell from "../../../../components/kralissListCell/KralissClearCell";
import {RFPercentage} from "react-native-responsive-fontsize";
import i18n from "../../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import Loader from "../../../../components/loader/Loader";
import {
  reqReceiveKralissInit,
  reqReceiveKraliss
} from "../../../../reducers/receiveKraliss";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import KralissMoneyIconCell from "../../../../components/kralissListCell/KralissMoneyIconCell";

export default class AskConfirmView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;

    const {
      askAmount,
      recipUser,
      askUnit,
      askUnitAPI,
      recipUnitAPI,
      message,
      conversionRate
    } = params.params;

    this.state = {
      askAmount,
      recipUser,
      askUnit,
      askUnitAPI,
      recipUnitAPI,
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
            onPress: () => {}
          }
        ],
        { cancelable: true }
      );
    }, 100);
  }
  onPressConfirm = async () => {
    const mobileInfos = await loadLocalData("mobileInfos");
    const { recipUser, askAmount, message, conversionRate,askUnitAPI, recipUnitAPI} = this.state;
    const kralissAmount = askAmount / conversionRate;
    this.props.reqReceiveKraliss({
      requestCode: 0,
      amount: kralissAmount,
      message: message,
      currencyStart: askUnitAPI,
      currencyEnd: recipUnitAPI, 
      transactionType: "api/type_transactions/6",
      receiverWallet: recipUser["@id"] ? recipUser["@id"] : "/api/users/"+recipUser["id"]
    });
  };

  componentDidUpdate() {
    const { error, payLoad } = this.props;
    if (error !== undefined) {
      this.props.reqReceiveKralissInit();
      this.showErrorAlert("", error);
    }

    if (payLoad !== undefined && payLoad.length > 0) {
      this.props.reqReceiveKralissInit();
      this.props.navigation.navigate("AskMoneySuccess", {
        title: i18n.t("askMoney.askTitle"),
        subTitle: i18n.t("askMoney.askSuccDesc"),
        description: "",
        returnNavigate: "Home"
      });
    }
  }

  render() {
    const { recipUser, askAmount, conversionRate, askUnit } = this.state;
    const kralissAmount = askAmount / conversionRate;

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
            {i18n.t("askMoney.amountToAsk")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={styles.txtBottomDesc}>
              {`${askAmount.toFixed(2)} ${askUnit}`}
            </Text>
            <KralissMoneyIconCell
              style={{ position: "absolute", right: 0 }}
              title={`${i18n.t("sendMoney.thats")} ${kralissAmount.toFixed(2)}`}
              titleFontSize={{ fontSize: RFPercentage(2.0) }}
            />
          </View>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("transHistory.receipient")}
          </Text>
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("tunnel.lastName")}
            detailContent={
              recipUser.typeAccount == "/api/type_accounts/2"
                ? recipUser.companyName
                : `${recipUser.firstName} ${recipUser.lastName}`
            }
          />
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("login.placeholderEmail")}
            detailContent={recipUser.email}
          />
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("sendMoney.accountNumber")}
            detailContent={recipUser.kra_account_number}
          />

          <Text style={styles.txtSectionTitle}>
            {i18n.t("transHistory.message")}
          </Text>
          <Text style={styles.txtBottomDesc}>
            {this.state.message}
          </Text>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.transactionType")}
          </Text>
          <Text style={styles.txtBottomDesc}>
            {i18n.t("askMoney.moneyRequest")}
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
  const { loading, error, payLoad } = state.receiveKralissReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqReceiveKralissInit,
  reqReceiveKraliss
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(AskConfirmView);
