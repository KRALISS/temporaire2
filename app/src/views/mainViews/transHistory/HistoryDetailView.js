import React, {Component} from "react";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";
import {RFPercentage} from "react-native-responsive-fontsize";
import moment from "moment";
import RNLanguages from 'react-native-languages';

import HorzGradientView from "../../../components/gradientView/HorzGradientView";
import KralissMoneyIconCell from "../../../components/kralissListCell/KralissMoneyIconCell";
import KralissClearCell from "../../../components/kralissListCell/KralissClearCell";
import i18n from "../../../locale/i18n";
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const statusBarHeight = getStatusBarHeight();

export default class HistoryDetailView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { data,accountIdAPI,receiverUnit,senderUnit} = params.params;
    this.state = { historyData: data ,accountIdAPI:accountIdAPI,receiverUnit,senderUnit};
  }

  render() {
    const phoneLanguage = RNLanguages.language;
    const { historyData: item ,accountIdAPI,receiverUnit,senderUnit} = this.state;
    let mainTitle = "";
    let mainAmount = "",
      subAmount = "",
      transType;
    let dateTime = ""
    if(phoneLanguage.includes("fr")) {
      dateTime = moment(item.createdAt).format(
        "DD/MM/YYYY HH:mm:ss"
      );
    } else {
      dateTime = moment(item.createdAt).format(
        "DD/MM/YYYY a hh:mm:ss"
      );
    }
    let userInfoTitle = "",
      tradeUserName,
      tradeUserAccount;
    let beforeTransKraAmount = 0,
      beforeTransAmount = 0,
      afterTransKraAmount = 0,
      afterTransAmount = 0;

    let IBANBeneficiary = "";

    let message = null;

    let amountTitle = "",
      amountField1Title,
      amountField2Title;
    let amountField1Value, amountField2Value, exchgRate;

    let beforeKraTxt = "";
    let beforeAmountTxt = "";
    let afterKraTxt = "";
    let afterAmountTxt = "";

    afterTransKraAmount = parseFloat(item.balance);

    if (item.transaction_type === "REFILL") {
      mainTitle = i18n.t("transHistory.recharge");
      transType = i18n.t("transHistory.recharge");
      mainAmount = `+ ${item.amount} ${
        senderUnit
      }`;
      subAmount = `+ ${item.amount}`;
      beforeTransKraAmount = afterTransKraAmount - parseFloat(item.amount);
      beforeTransAmount = beforeTransKraAmount * 1;
      beforeKraTxt =  `${i18n.t("sendMoney.thats")} ${beforeTransKraAmount}`;
      beforeAmountTxt = `${beforeTransAmount} ${senderUnit}`;
      afterTransAmount = parseFloat(item.amount);
      afterKraTxt = `${i18n.t("sendMoney.thats")} ${afterTransKraAmount}`;
      afterAmountTxt = `${afterTransAmount} ${senderUnit}`
    }


    if (item.transaction_type === "REFUND") {
      mainTitle = i18n.t("transHistory.refund");
      transType = i18n.t("transHistory.refund");
      mainAmount = `- ${item.amount} ${
        senderUnit
      }`;
      subAmount = `- ${item.amount}`;
      beforeTransKraAmount = afterTransKraAmount + parseFloat(item.amount);
      beforeTransAmount = beforeTransKraAmount * 1;
      IBANBeneficiary = item.refund_iban;
      beforeKraTxt =  `${i18n.t("sendMoney.thats")} ${beforeTransKraAmount}`;
      beforeAmountTxt = `${beforeTransAmount} ${senderUnit}`;
      afterTransAmount = parseFloat(item.amount);
      afterKraTxt = `${i18n.t("sendMoney.thats")} ${afterTransKraAmount}`;
      afterAmountTxt = `${afterTransAmount} ${senderUnit}`
    }
    
    if (
      item.transactionType === "/api/type_transactions/1" || // mobile_payment
      item.transactionType === "/api/type_transactions/5"  // sending_money
    ) {
      if (item.senderWallet === accountIdAPI) { // money sent
        afterTransKraAmount = parseFloat(item.balance);

        if(item.transactionType === "/api/type_transactions/1") {
          transType = i18n.t("transHistory.payment");
        } else {
          transType = i18n.t("transHistory.send");
        }
        let transAmount = parseFloat(item.amount) * 1;
        mainTitle = item.receiverFullName;
        mainAmount = `- ${transAmount.toFixed(2)} ${senderUnit}`;
        subAmount = `- ${item.amount}`;
        userInfoTitle = i18n.t("sendMoney.beneficiary");
        tradeUserName = item.receiverFullName;
        tradeUserAccount = item.receiverAccountKraliss;
        amountField1Title = i18n.t("transHistory.transmittter");
        amountField2Title = i18n.t("transHistory.receipient");
        const kraTransAmount = parseFloat(item.amount);
        amountField1Value = `${(kraTransAmount * 1).toFixed(2)} ${senderUnit}`;
        amountField2Value = `${(kraTransAmount * 1).toFixed(2)} ${receiverUnit}`;
        beforeTransKraAmount = afterTransKraAmount + parseFloat(item.amount);
        beforeTransAmount = beforeTransKraAmount * 1;
        beforeTransAmount = beforeTransAmount.toFixed(2)
        beforeKraTxt = `${i18n.t("sendMoney.thats")} ${beforeTransKraAmount.toFixed(2)}`;
        beforeAmountTxt = `${beforeTransAmount} ${senderUnit}`;
        afterTransAmount = afterTransKraAmount * 1;
        afterTransAmount = afterTransAmount.toFixed(2)
        afterKraTxt = `${i18n.t("sendMoney.thats")} ${afterTransKraAmount.toFixed(2)}`;
        afterAmountTxt = `${afterTransAmount} ${senderUnit}`
      } else { // Money received
        if(item.transactionType === "/api/type_transactions/1") {
          transType = i18n.t("transHistory.cashIn");
        } else {
          transType = i18n.t("transHistory.receive");
        }
        afterTransKraAmount = parseFloat(item.balanceReceiver);
        let transAmount = parseFloat(item.amount) * 1;
        mainTitle = item.senderFullName;
        mainAmount = `+ ${transAmount.toFixed(2)} ${receiverUnit}`;
        subAmount = `+ ${item.amount}`;
        userInfoTitle = i18n.t("transHistory.transmittter");
        tradeUserName = item.senderFullName;
        tradeUserAccount = item.senderAccountKraliss;
        amountField1Title = i18n.t("transHistory.applicant");
        amountField2Title = i18n.t("transHistory.payer");
        const kraTransAmount = parseFloat(item.amount);
        amountField1Value = `${(kraTransAmount * 1).toFixed(2)} ${receiverUnit}`;
        amountField2Value = `${(kraTransAmount * 1).toFixed(2)} ${senderUnit}`;
        beforeTransKraAmount = afterTransKraAmount - parseFloat(item.amount);
        beforeTransAmount = beforeTransKraAmount * 1;
        beforeTransAmount = beforeTransAmount.toFixed(2)
        beforeKraTxt = `${i18n.t("sendMoney.thats")} ${beforeTransKraAmount.toFixed(2)}`;
        beforeAmountTxt = `${beforeTransAmount} ${receiverUnit}`;
        afterTransAmount = afterTransKraAmount * 1;
        afterTransAmount = afterTransAmount.toFixed(2)
        afterKraTxt = `${i18n.t("sendMoney.thats")} ${afterTransKraAmount.toFixed(2)}`;
        afterAmountTxt = `${afterTransAmount} ${receiverUnit}`
      }
      amountTitle = i18n.t("cash.amount");

      //COMMON
      if (1 === 1) {
          exchgRate = "-";
      } else {
        const rateValue = 1 /1;
        exchgRate = `${rateValue.toFixed(2)}`;
      }
      if(item.message === "") {
        message = i18n.t("transHistory.noMessage")
      } else {
        message = item.message;
      }

    }

    const transNumber = item.id;
    return (
      <View style={styles.container}>
        <HorzGradientView style={{ height: hp(20) + statusBarHeight }}>
          <View style={styles.navBar}>
            <TouchableOpacity
              style={styles.btnBack}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image source={require("../../../assets/images/chevron.png")} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.headerDesc}>{mainTitle}</Text>
            <Text style={styles.headerBalance}>{mainAmount}</Text>
            <View style={styles.headerMoneyInfo}>
              <Text style={styles.headerDesc}>
                {`${i18n.t("sendMoney.thats")} ${subAmount}`}
              </Text>
              <Image
                style={{ marginLeft: 5, marginTop: 2 }}
                source={require("../../../assets/images/kraliss_logo_grey.png")}
              />
            </View>
          </View>
        </HorzGradientView>
        <ScrollView style={styles.mainContent}>
          <Text style={styles.txtSectionTitle}>{i18n.t("cash.date")}</Text>
          <Text style={styles.txtSectionDesc}>{dateTime}</Text>

          {userInfoTitle !== "" && (
            <View>
              <Text style={styles.txtSectionTitle}>{userInfoTitle}</Text>
              <KralissClearCell
                mainTitle={i18n.t("tunnel.lastName")}
                detailContent={tradeUserName}
              />
              <KralissClearCell
                style={{ marginTop: 5 }}
                mainTitle={i18n.t("sendMoney.accountNumber")}
                detailContent={tradeUserAccount}
              />
            </View>
          )}

          {amountTitle !== "" && (
            <View>
              <Text style={styles.txtSectionTitle}>{amountTitle}</Text>
              <KralissClearCell
                mainTitle={amountField1Title}
                detailContent={amountField1Value}
              />
              <KralissClearCell
                style={{ marginTop: 5 }}
                mainTitle={amountField2Title}
                detailContent={amountField2Value}
              />
              <KralissClearCell
                style={{ marginTop: 5 }}
                mainTitle={i18n.t("transHistory.exchgRate")}
                detailContent={exchgRate}
              />
            </View>
          )}

          {IBANBeneficiary !== "" && (
            <View>
              <Text style={styles.txtSectionTitle}>
                {i18n.t("transHistory.IBANBenef")}
              </Text>
              <Text style={styles.txtSectionDesc}>{IBANBeneficiary}</Text>
            </View>
          )}

          <Text style={styles.txtSectionTitle}>
            {i18n.t("cash.transactionNumber")}
          </Text>
          <Text style={styles.txtSectionDesc}>{transNumber}</Text>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.transactionType")}
          </Text>
          <Text style={styles.txtSectionDesc}>{transType}</Text>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("transHistory.beforeBalance")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={styles.txtBottomDesc}>{beforeAmountTxt}</Text>
            <KralissMoneyIconCell
              style={{ position: "absolute", right: 0 }}
              title={beforeKraTxt}
              titleFontSize={{ fontSize: RFPercentage(2.0) }}
            />
          </View>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("transHistory.afterBalance")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={styles.txtBottomDesc}>{afterAmountTxt}</Text>
            <KralissMoneyIconCell
              style={{ position: "absolute", right: 0 }}
              title={afterKraTxt}
              titleFontSize={{ fontSize: RFPercentage(2.0) }}
            />
          </View>
          {message !== null && (
            <View>
              <Text style={styles.txtSectionTitle}>
                {i18n.t("transHistory.message")}
              </Text>
              <Text style={styles.txtSectionDesc}>{message}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff"
  },
  navBar: {
    flexDirection: "row",
    // marginTop: statusBarHeight,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  btnBack: {
    height: 45,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  headerContainer: { marginTop: 20, height: 100, alignItems: "center" },
  headerBalance: {
    marginTop: 10,
    color: "#fff",
    fontSize: RFPercentage(4.0)
  },
  headerDesc: { fontSize: RFPercentage(2.0), color: "#fff" },
  headerMoneyInfo: { marginTop: 10, flexDirection: "row" },

  mainContent: { flex: 1, paddingLeft: 20, paddingRight: 20 },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    marginTop: 20,
    marginBottom: 5
  },
  txtSectionDesc: {
    color: "#484848",
    fontSize: RFPercentage(2.0)
  }
});
