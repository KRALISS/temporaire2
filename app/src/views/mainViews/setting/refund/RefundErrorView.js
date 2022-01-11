import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from "react-native";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import {RFPercentage} from "react-native-responsive-fontsize";
import i18n from "../../../../locale/i18n";
import Loader from "../../../../components/loader/Loader";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";

export default class RefundErrorView extends Component {
  state = {
    IBAN: ""
  };

  onPressConfirm = async () => {
    this.props.navigation.navigate("Setting");
  };

  render() {
    const params = this.props.navigation.state;
    const { kind, refundDate } = params.params;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>
        <SafeAreaView style={styles.container}>
          <WhiteNavHeader
            title={i18n.t("refillLoader.confirmation")}
            onBack={() => {
              this.props.navigation.goBack();
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.txtSectionTitle}>
              {i18n.t("beneficiary.fault")}
            </Text>
            {kind === 1 && (
              <View>
                <Text style={styles.skipDescText}>
                  {i18n.t("refund.error1Desc")}
                </Text>
                <Text style={styles.dateText}>{refundDate}</Text>
              </View>
            )}
            {kind === 2 && (
              <View>
                <Text style={styles.skipDescText}>
                  {i18n.t("refund.error2Desc")}
                </Text>
              </View>
            )}
            {kind === 3 && (
              <View>
                <Text style={styles.skipDescText}>
                  {i18n.t("refund.error3Desc")}
                </Text>
              </View>
            )}
          </View>
          <KralissRectButton
            style={styles.buttonContainer}
            enabled={true}
            onPress={this.onPressConfirm}
            title={i18n.t("passwdIdentify.return")}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#FFF"
  },
  marginCell: {
    marginTop: 12
  },
  textContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20
  },
  txtSectionTitle: {
    color: "#df2416",
    fontSize: RFPercentage(2.0)
  },
  item: {
    marginTop: 30,
    borderBottomColor: "#cecece"
  },
  skipDescText: {
    marginTop: 30,
    color: "#484848",
    fontSize: RFPercentage(2.0)
  },
  dateText: {
    color: "#00aca9",
    fontSize: RFPercentage(2.0),
    marginTop: 30
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#000",
    fontSize: RFPercentage(2.2)
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});
