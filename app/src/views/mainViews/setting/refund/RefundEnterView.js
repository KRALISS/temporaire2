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

import i18n from "../../../../locale/i18n";
import {
  loadLocalData,
  saveLocalData,
  saveUserInfo
} from "../../../../utils/localStorage";
import {RFPercentage} from "react-native-responsive-fontsize";
import {
  reqAccountsMe,
  reqInitAccountsMe
} from "../../../../reducers/accountsMe";
import { getDeviceInformations } from "../../../../utils/deviceInfo";
import Geolocation from 'react-native-geolocation-service';
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import KralissCurrencyInput from "../../../../components/kralissInput/KralissCurrencyInput";
import KralissClearCell from "../../../../components/kralissListCell/KralissClearCell";

export default class RefundEnterView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      txtRefundDisplay: "",
      txtRefundKra: "",
      myUnit: "",
      myConversionRate: 0,
      myBalanceKra: 0,
      myBalanceDisplay: 0,
      refundFeeKra: 0,
      refundFeeDisplay: 0
    };
  }

  onPressValidate = () => {
    const { myUnit, myConversionRate, myBalanceKra, myBalanceDisplay, refundFeeKra, refundFeeDisplay } = this.state;

    this.props.navigation.navigate("RefundConfirm", {
      txtRefundDisplay : parseFloat(this.state.txtRefundDisplay),
      txtRefundKra : parseFloat(this.state.txtRefundKra),
      myUnit,
      myConversionRate : parseFloat(this.state.myConversionRate),
      myBalanceKra : parseFloat(this.state.myBalanceKra),
      myBalanceDisplay : parseFloat(this.state.myBalanceDisplay),
      refundFeeKra : parseFloat(this.state.refundFeeKra),
      refundFeeDisplay : parseFloat(this.state.refundFeeDisplay)
    });
  };

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
    const txtRefundKra = value / this.state.myConversionRate;
    this.setState({txtRefundKra})
  };

  loadUserInternational = async () => {
    try {
      let myBalanceKra = await loadLocalData("kraBalance");
      const myuserInternational = await loadLocalData("myuserInternational");
      myBalanceDisplay = (parseFloat(myBalanceKra) * myuserInternational["international_conversion_rate"]).toFixed(2)
      let refundFeeKra = 0;
      let refundFeeDisplay = 0;
      if (myuserInternational["international_devise_iso_code"] !== "EUR") {
        refundFeeKra = 18;
        refundFeeDisplay = 18 * myuserInternational["international_conversion_rate"];
      }
      this.setState({
        myUnit: myuserInternational["international_devise_iso_code"],
        myConversionRate: myuserInternational["international_conversion_rate"],
        myBalanceKra: parseFloat(myBalanceKra),
        myBalanceDisplay,
        refundFeeKra,
        refundFeeDisplay
      });
    } catch (error) {
      this.showErrorAlert(error.message);
    }
  };

  componentDidMount = async () => {
    this.props.reqAccountsMe();
    try {
      const value = await getDeviceInformations(Geolocation);
      saveLocalData("mobileInfos", value);
    } catch (error) {
      this.showErrorAlert(error.message);
    }
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if(this.props.payLoad) {
      const { kra_user } = this.props.payLoad;
      if (kra_user !== undefined) {
        //save kra_user
        await saveUserInfo(this.props.payLoad);
        this.loadUserInternational();
        this.props.reqInitAccountsMe();
      }
      const { error } = this.props;
      if (error !== undefined && error.length > 0) {
        this.props.reqInitAccountsMe();
        this.showErrorAlert(this.props.error);
      }
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
      txtRefundDisplay,
      myUnit,
      myConversionRate,
      myBalanceDisplay,
      refundFeeDisplay
    } = this.state;

    let refundAmount = txtRefundDisplay.length === 0 ? 0 : parseFloat(txtRefundDisplay);
    let myBalanceAmount = parseFloat(myBalanceDisplay);
    let afterAmount = myBalanceAmount - (refundFeeDisplay + refundAmount);

    let buttonEnabled = false;
    if (refundAmount > 0 && afterAmount >= 0) {
      buttonEnabled = true;
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>
        <View style={styles.container}>
          <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <WhiteNavHeader
            title={i18n.t("settings.refund")}
            onBack={() => this.props.navigation.goBack()}
          />
          <ScrollView style={styles.textContainer}>
            <Text style={styles.txtTitle}>{i18n.t("settings.refund")}</Text>
            <Text style={styles.txtTitleDesc}>
              {i18n.t("refund.refundDesc")}
            </Text>
            <View style={{ flex: 1, marginRight: 60, marginBottom: 40 }}>
              <Text style={styles.txtSectionTitle}>
                {i18n.t("refund.enterRefundAmount")}
              </Text>
              <KralissCurrencyInput
                ID="txtRefundDisplay"
                placeHolder={"0"}
                valueFontSize={{ fontSize: RFPercentage(5.5) }}
                unitFontSize={{ fontSize: RFPercentage(4.0) }}
                value={txtRefundDisplay}
                unitValue={myUnit}
                onChangeText={this.onChangeInputText}
              />
            </View>
            <KralissClearCell
              style={styles.marginCell}
              mainTitle={i18n.t("refund.curBalance")}
              detailContent={`${myBalanceAmount.toFixed(2)} ${myUnit}`}
            />
            <KralissClearCell
              style={styles.marginCell}
              mainTitle={i18n.t("refund.refundAmount")}
              detailContent={`${refundAmount.toFixed(2)} ${myUnit}`}
            />
            <KralissClearCell
              style={styles.marginCell}
              mainTitle={i18n.t("refund.refundFee")}
              detailContent={`${refundFeeDisplay.toFixed(2)} ${myUnit}`}
            />
            <KralissClearCell
              style={styles.marginCell}
              boldContent={true}
              mainTitle={i18n.t("refund.afterBalance")}
              detailContent={`${afterAmount.toFixed(2)} ${myUnit}`}
            />
          </ScrollView>

          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressValidate}
            title={i18n.t("forgotPassword.validateButton")}
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
    marginLeft: 20,
    marginRight: 20
  },
  marginCell: {
    marginTop: 12
  },
  txtTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    marginBottom: 20,
    marginTop: 20
  },
  txtTitleDesc: {
    color: "#484848",
    fontSize: RFPercentage(2.0)
  },
  txtSectionTitle: {
    color: "#707070",
    fontSize: RFPercentage(2.0),
    marginTop: 20,
    marginBottom: 20
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error } = state.accountsMeReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqAccountsMe,
  reqInitAccountsMe
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(RefundEnterView);
