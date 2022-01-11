import React, {Component} from "react";
import {Alert, ScrollView, StyleSheet, Text, View,SafeAreaView} from "react-native";
import {connect} from "react-redux";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import KralissClearCell from "../../../../components/kralissListCell/KralissClearCell";
import {RFPercentage} from "react-native-responsive-fontsize";
import i18n from "../../../../locale/i18n";
import {loadLocalData} from "../../../../utils/localStorage";
import Loader from "../../../../components/loader/Loader";
import {reqConfirmAsk, reqConfirmAskInit} from "../../../../reducers/receiveKraliss";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import KralissMoneyIconCell from "../../../../components/kralissListCell/KralissMoneyIconCell";

export default class ConfirmAskView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;

    const {
      amount,
      conversion_rate,
      devise_iso_code,
      receiver_name,
      receiver_account_number,
      transaction_id,
      transaction_message,
    } = params.params;

    this.state = {
      amount,
      conversion_rate,
      devise_iso_code,
      receiver_name,
      receiver_account_number,
      transaction_id,
      transaction_message
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
        { cancelable: false }
      );
    }, 500);
  }

  confirmingAskMoney = async status => {
    const mobileInfos = await loadLocalData("mobileInfos");
    const { transaction_id } = this.state;
    this.props.reqConfirmAsk(transaction_id, {
      mobile_infos: mobileInfos,
      acceptation_status: status
    });
    this.setState({ status });
  };

  onPressConfirm = () => {
    this.showConfirmAlert("ACCEPTED");
  };
  onPressRefuse = () => {
    this.showConfirmAlert("DECLINED");
  };

  showConfirmAlert = status => {
    const {
      amount,
      conversion_rate,
      devise_iso_code,
      receiver_name
    } = this.state;

    const balanceAmount = amount * conversion_rate;
    let msg = i18n.t("askMoney.acceptConfMsg", {
      amount: balanceAmount.toFixed(2),
      myUnit: devise_iso_code,
      receiver: receiver_name
    });
    if (status === "DECLINED")
      msg = i18n.t("askMoney.refuseConfMsg", {
        amount: balanceAmount.toFixed(2),
        myUnit: devise_iso_code,
        receiver: receiver_name
      });
    setTimeout(() => {
      Alert.alert(
        i18n.t("refillLoader.confirmation"),
        msg,
        [
          {
            text: i18n.t("beneficiary.cancel"),
            onPress: () => {}
          },
          {
            text: i18n.t("forgotPassword.validateButton"),
            onPress: () => {
              this.confirmingAskMoney(status);
            }
          }
        ],
        { cancelable: false }
      );
    }, 500);
  };

  componentDidUpdate() {
    const { error, payLoad, errorStatus } = this.props;
    if (error !== undefined) {
      this.props.reqConfirmAskInit();
      if(errorStatus === 404) {
        this.showErrorAlert(i18n.t('ask.alreadyAskTitle'), i18n.t('ask.alreadyAskDesc'));
      } else {
        this.showErrorAlert(i18n.t('sendMoney.insuffBalance'), i18n.t('sendMoney.insuffMsg'));
      }
    }

    if (payLoad !== undefined && payLoad.length > 0) {
      this.props.reqConfirmAskInit();
      this.props.navigation.navigate("AskMoneySuccess", {
        title: this.state.status === "DECLINED" ?  i18n.t("sendMoney.declineAsk") : i18n.t("sendMoney.successTitle"),
        failed: this.state.status === "DECLINED" ? true : false,
        description: i18n.t("refillLoader.findHistoryDesc"),
        returnNavigate: "Home"
      });
    }
  }

  render() {
    const {
      amount,
      conversion_rate,
      devise_iso_code,
      receiver_name,
      receiver_account_number
    } = this.state;

    const balanceAmount = amount * conversion_rate;

    let buttonEnabled = true;
    return (
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
        <View style={styles.container}>
          <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <WhiteNavHeader
            onBack={() => {
              this.props.navigation.goBack();
            }}
            title={i18n.t("refillLoader.confirmation")} />
          <ScrollView style={styles.textContainer}>
            <Text style={styles.txtMainTitle}>
              {i18n.t("askMoney.summaryOfRequest")}
            </Text>

          <Text style={styles.txtSectionTitle}>{i18n.t("cash.amount")}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={styles.txtBottomDesc}>
              {`${balanceAmount.toFixed(2)} ${devise_iso_code}`}
            </Text>
            <KralissMoneyIconCell
              style={{ position: "absolute", right: 0 }}
              title={`${i18n.t("sendMoney.thats")} ${parseFloat(amount).toFixed(2)}`}
              titleFontSize={{ fontSize: RFPercentage(2.0) }}
            />
          </View>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("transHistory.applicant")}
          </Text>
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("tunnel.lastName")}
            detailContent={receiver_name}
          />
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("sendMoney.accountNumber")}
            detailContent={receiver_account_number}
          />

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.transactionType")}
          </Text>
          <Text style={styles.txtBottomDesc}>
            {i18n.t("askMoney.moneyRequest")}
          </Text>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("transHistory.message")}
          </Text>
          <Text style={styles.txtBottomDesc}>
            {this.state.transaction_message}
          </Text>

          </ScrollView>
          <Text style={styles.txtBottomQuestion}>
            {i18n.t("askMoney.wantProceedRequest")}
          </Text>
          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressConfirm}
            title={i18n.t("login.validateButton")}
          />
          <KralissRectButton
            style={styles.buttonContainer}
            isYellow={true}
            enabled={buttonEnabled}
            onPress={this.onPressRefuse}
            title={i18n.t("notifications.refuse")}
          />
        </View>
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end"
  },
  textContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 30,
    flexDirection: "column",
    flex: 1
  },
  txtMainTitle: {
    color: "#484848",
    fontSize: RFPercentage(2.0),
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center"
  },
  txtBottomQuestion: {
    color: "#484848",
    fontSize: RFPercentage(2.0),
    marginTop: 30,
    marginBottom: 70,
    textAlign: "center"
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
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad, errorStatus } = state.confirmAskReducer;
  return { loading, error, payLoad, errorStatus };
};

const mapDispatchToProps = {
  reqConfirmAsk,
  reqConfirmAskInit
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmAskView);
