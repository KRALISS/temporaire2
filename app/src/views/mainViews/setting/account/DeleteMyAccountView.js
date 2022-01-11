import React, { Component } from "react";
import { StyleSheet, ScrollView, Text, View, Alert } from "react-native";
import { connect } from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../../locale/i18n";
import { deleteMyAccount } from "../../../../utils/localStorage";
import { reqPatchAccountsMe } from "../../../../reducers/accountsMe";
import KralissButton from "../../../../components/kralissButton/KralissButton";

export default class DeleteMyAccountView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { kraKycLevel } = params.params;
    this.state = { kraKycLevel };
  }

  confirmDeleteAccount = () => {
    this.props.reqPatchAccountsMe({ kra_deleted: "true" });
    deleteMyAccount();
    this.props.navigation.navigate("Login");
  };

  onPressDeleteAccount = async () => {
    if (this.state.kraKycLevel === 3) {
      setTimeout(() => {
        Alert.alert(
          i18n.t("refillLoader.confirmation"),
          i18n.t("myAccount.deleteConfirmMsg"),
          [
            {
              text: i18n.t("beneficiary.cancel"),
              onPress: () => {}
            },
            {
              text: i18n.t("forgotPassword.validateButton"),
              onPress: () => {
                this.confirmDeleteAccount();
              }
            }
          ],
          { cancelable: true }
        );
      }, 100);
    } else {
      this.showErrorAlert();
    }
  };

  showErrorAlert = () => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("myAccount.missingPieces"),
        i18n.t("myAccount.provideAllDoc"),
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
    return (
      <View style={styles.container}>
        <WhiteNavHeader
          title={i18n.t("myAccount.deleteAccount")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <View style={styles.marginLR}>
          <Text style={[styles.txtDesc, { marginTop: 20 }]}>
            {i18n.t("myAccount.permaDeleteAccount")}
          </Text>
          <KralissButton
            style={styles.deleteBtn}
            onPress={this.onPressDeleteAccount}
            title={i18n.t("myAccount.deleteAccount")}
            enabled={true}
          />
          <Text style={[styles.txtDesc]}>
            {i18n.t("myAccount.permaDeleteAccount")}
          </Text>
          <Text style={[styles.txtDesc]}>
            {i18n.t("myAccount.deleteAttention")}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1
  },
  deleteBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20
  },
  marginCell: {
    marginTop: 12
  },
  marginLR: {
    marginLeft: 20,
    marginRight: 20
  },
  txtDesc: {
    color: "#acacac",
    fontSize: RFPercentage(2.1)
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error } = state.accountsMeReducer;
  return {
    payLoad,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqPatchAccountsMe
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteMyAccountView);
