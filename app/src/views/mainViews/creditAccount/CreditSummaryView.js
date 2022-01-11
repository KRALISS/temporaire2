import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView
} from "react-native";
import RNLanguages from "react-native-languages";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {RFPercentage} from "react-native-responsive-fontsize";
import { connect } from "react-redux";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissClearCell from "../../../components/kralissListCell/KralissClearCell";
import Loader from "../../../components/loader/Loader";

import i18n from "../../../locale/i18n";
import {loadLocalData, saveLocalData} from "../../../utils/localStorage";
import {FEES_WALLET_ID, getCreditcardInit} from "../../../utils/apiMoneyUtil";
import { initCashIn, initCashInInit } from "../../../reducers/refills"

export default class CreditSummaryView extends Component {
  state = { loading: false };

  getLanguageTosendToApiMoney = () => {
    const iphoneLanguage = RNLanguages.language;
    if (iphoneLanguage === "fr-FR") {
      return "fr";
    } else {
      return "en";
    }
  };

  onCallBackFromApiMoney = (response, error) => {
    if (error) {
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.showErrorAlert("", error);
        }, 510);
      });
    } else if(response && response !== "success") {
      const {redirect_url } = response;
        saveLocalData("cashinInfos", response);
        this.props.navigation.navigate("CreditRedirect", { url: redirect_url });
  } else {this.setState({loading: false})}
  };

  showErrorAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: i18n.t("passwdIdentify.return"),
          onPress: () => {}
        }
      ],
    );
  }

  onPressCreditCard = async () => {
    const params = this.props.navigation.state;
    const { amount, commission } = params.params;
    const dateTimeStamp = Date.now();
    const accountId = await loadLocalData("kraAccountId");
    const apiMoneyWalletId = await loadLocalData("kraApiMoneyWalletId");
    const partnerRef = `REFILL-${dateTimeStamp}-${accountId}`;

    const bodyData = {
      partner_ref: partnerRef,
      tag: "refill",
      receiver_wallet_id: apiMoneyWalletId,
      fees_wallet_id: FEES_WALLET_ID,
      amount: (amount).toFixed(2),
      fees: commission.toFixed(2),
      return_url: `http://kraliss.credit?amount=${amount}&fee=${commission}`,
      lang: this.getLanguageTosendToApiMoney()
    };
    saveLocalData("partnerRef", partnerRef);
    this.props.initCashIn(bodyData);
    this.setState({ loading: true });
  };

  onPressBankTransfer = () => {
    const params = this.props.navigation.state;
    let { amount,conversionRate,unit } = params.params;
    this.props.navigation.navigate("BankTransferDetail",{amount,conversionRate,unit})
  };

  componentDidMount = async () => {};

  componentDidUpdate = async (prevProps, prevState) => {
    const {payLoad, error} = this.props;
    if(prevProps.payLoad !== payLoad) {
      this.onCallBackFromApiMoney(payLoad, error)
      this.props.initCashInInit()
    }
    if(prevProps.error !== error) {
      this.onCallBackFromApiMoney(payLoad, error)
      this.props.initCashInInit()
    }
  }

  render() {
    const params = this.props.navigation.state;
    const { amount, commission, conversionRate, unit } = params.params;
    const total = (amount + commission) * conversionRate;

    let buttonEnabled = true;
    return (
          <SafeAreaView
            style={styles.container}
          >
           <Loader
              loading={this.state.loading}
              typeOfLoad={i18n.t("components.loader.descriptionText")}
            />
            <WhiteNavHeader
              title={i18n.t("creditMyAccount.creditMyAccount")}
              onBack={() => {
                this.props.navigation.goBack();
              }}
            />

            <ScrollView
              style={styles.scrollViewStyle}
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <View style={styles.textContainer}>
                {/* <Text style={styles.txtSectionTitle}>
                  {i18n.t("creditMyAccount.summeryOfOrder")}
                </Text> */}
                <KralissClearCell
                  boldContent={true}
                  style={styles.marginCell}
                  mainTitle={i18n.t("creditMyAccount.amountOfRecharge")}
                  detailContent={`${(amount * conversionRate).toFixed(2)} ${unit}`}
                />

                <KralissClearCell
                  boldContent={true}
                  style={styles.marginCell}
                  mainTitle={i18n.t("creditMyAccount.costOfRefill")}
                />

                <KralissClearCell
                  boldContent={true}
                  style={{marginTop:hp(2)}}
                  extraHeaderTextstyle={{color:'#05ACA9'}}
                  extraDetailTextStyle={{color:'#05ACA9'}}
                  mainTitle={i18n.t("creditMyAccount.byCreditCard")}
                  detailContent={`${(commission * conversionRate).toFixed(
                    2
                  )} ${unit}`}
                />

                <KralissClearCell
                  style={{marginTop:hp(1.5)}}
                  mainTitle={i18n.t("creditMyAccount.availabilityOfFunds")}
                  detailContent={i18n.t("creditMyAccount.instantaneous")}
                />


                <KralissClearCell
                  style={{marginTop:hp(1.5)}}
                  mainTitle={i18n.t("creditMyAccount.accessToSponsorship")}
                  detailContent={i18n.t("creditMyAccount.yes")}
                />

                <KralissClearCell
                  style={styles.marginCell}
                  boldContent={true}
                  mainTitle={i18n.t("creditMyAccount.totalCost")}
                  detailContent={`${total.toFixed(2)} ${unit}`}
                />

                <KralissClearCell
                  boldContent={true}
                  style={{marginTop:hp(4)}}
                  extraHeaderTextstyle={{color:'#05ACA9'}}
                  extraDetailTextStyle={{color:'#05ACA9'}}
                  mainTitle={i18n.t("creditMyAccount.byBankTransfer")}
                  detailContent={`${(0 * conversionRate).toFixed(
                    2
                  )} ${unit}`}
                />

                <KralissClearCell
                  style={{marginTop:hp(1.5)}}
                  mainTitle={i18n.t("creditMyAccount.availabilityOfFunds")}
                  detailContent={i18n.t("creditMyAccount.duration")}
                />


                <KralissClearCell
                  style={{marginTop:hp(1.5)}}
                  mainTitle={i18n.t("creditMyAccount.accessToSponsorship")}
                  detailContent={i18n.t("creditMyAccount.no")}
                />

                <KralissClearCell
                  style={styles.marginCell}
                  boldContent={true}
                  mainTitle={i18n.t("creditMyAccount.totalCost")}
                  detailContent={`${(amount * conversionRate).toFixed(2)} ${unit}`}
                />
                {/* <Text style={styles.txtBottomDesc}>
                  {i18n.t("creditMyAccount.clickValidate")}
                </Text> */}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonEnabled}
                  onPress={this.onPressCreditCard}
                >
                  <Text style={styles.buttonTitle}>
                    {i18n.t("creditMyAccount.creditCard")}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonEnabled}
                  onPress={this.onPressBankTransfer}
                >
                  <Text style={styles.buttonTitle}>
                    {i18n.t("creditMyAccount.bankTransfer")}
                  </Text>
                </TouchableOpacity>
              </View >
            </ScrollView>


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
  scrollViewStyle:{
    backgroundColor: "#fff"
  },
  textContainer: {
    // marginLeft: 20,
    // marginRight: 20,
    flexDirection: "column",
    flex: 1
  },
  marginCell: {
    marginTop: hp(3),
  },
  marginSection: {
    marginTop: 20
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    marginTop: 12,
    marginBottom: 12
  },
  txtBottomDesc: {
    color: "#484848",
    fontSize: RFPercentage(2.0),
    marginTop: 25,
    marginBottom: 12
  },
  buttonContainer: {
    height: 55,
    width: "100%",
    marginTop:hp(3),
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
    alignItems: "center",
    height:55,
    borderRadius:5,
  },
  buttonDisabled: {
    width: "100%",
    flex: 1,
    backgroundColor: "#c7eceb",
    justifyContent: "center",
    alignItems: "center"
  }
});

const mstp = state => {
  const {payLoad, error, loading} = state.refillsReducer;
  return {
    payLoad,
    loading,
    error
  }
}

const mdtp = {
  initCashIn,
  initCashInInit
}

module.exports = connect(
  mstp,
  mdtp
)(CreditSummaryView)