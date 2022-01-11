import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import Spinner from "react-native-spinkit";
import { connect } from "react-redux";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import {RFPercentage} from "react-native-responsive-fontsize";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import { reqRefillsInit, reqRefills } from "../../../reducers/refills";
import { reqRefillsFailed } from "../../../reducers/recharges";

export default class RefillLoaderView extends Component {
  state = { loading: false };

  onPressValidate = async () => {

  };

  componentDidMount = async () => {
    const params = this.props.navigation.state;
    const { amount, fee } = params.params;

    const partnerRef = await loadLocalData("partnerRef");
    const mobileInfos = await loadLocalData("mobileInfos");
    const apiMoneyId = await loadLocalData("cashinInfos");

    const bodyData = {
      mobile_infos: mobileInfos,
      amount: Number(amount),
      fee_amount: Number(fee),
      transaction_partner_ref: partnerRef,
      transaction_api_money_id: apiMoneyId.id
    };

    this.props.reqRefills(bodyData);
  };

  componentDidUpdate(prevProps) {
    const { error, success } = this.props;
    if (error && error.length > 0) {
      //show error
      //this.showErrorAlert("Error", this.error);
      this.props.navigation.navigate("CreditAccount", { cantPerform: true });
      this.props.reqRefillsInit();
      this.props.reqRefillsFailed();
    }

    if (success) {
      this.props.reqRefillsInit();
      this.props.navigation.navigate("RefillSuccess", {
        title: i18n.t("refillLoader.confirmation"),
        description: i18n.t("refillLoader.findHistoryDesc"),
        returnNavigate: "CreditAccount"
      });
    }
  }

  render() {
    let buttonEnabled = !this.props.loading;
    return (
      <View style={styles.container}>
        <WhiteNavHeader title={i18n.t("refillLoader.confirmation")} />
        <View style={styles.textContainer}>
          <Text style={styles.txtMainDesc}>
            {i18n.t("refillLoader.waitForAMinutes")}
          </Text>
          <Spinner
            isVisible={true}
            size={30}
            type="FadingCircleAlt"
            color="#484848"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.txtDesc}>
            {i18n.t("refillLoader.findHistoryDesc")}
          </Text>
          <TouchableOpacity
            style={buttonEnabled ? styles.buttonEnabled : styles.buttonDisabled}
            onPress={this.onPressValidate}
          >
            <Text style={styles.buttonTitle}>
              {i18n.t("passwdIdentify.return")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "column",
    justifyContent: "center",
    flex: 3,
    alignItems: "center"
  },
  txtMainDesc: {
    color: "#484848",
    fontSize: RFPercentage(2.2),
    marginTop: 25,
    marginBottom: 12
  },
  buttonContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  txtDesc: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    textAlign: "center",
    marginBottom: 32,
    marginLeft: 40,
    marginRight: 40
  },
  buttonTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: RFPercentage(2.8)
  },
  buttonEnabled: {
    width: "100%",
    height: 60,
    backgroundColor: "#00aca9",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonDisabled: {
    width: "100%",
    height: 60,
    backgroundColor: "#c7eceb",
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  const { success, loading, error } = state.refillsReducer;
  return {
    success,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqRefills,
  reqRefillsInit,
  reqRefillsFailed
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(RefillLoaderView);
