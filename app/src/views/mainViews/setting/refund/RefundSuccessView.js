import React, { Component } from "react";
import { StyleSheet, Image, Text, View } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

import i18n from "../../../../locale/i18n";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";

export default class RefundSuccessView extends Component {
  constructor(props) {
    super(props);
  }

  onPressReturn = async () => {
    this.props.navigation.navigate("Setting");
  };

  componentDidMount = async () => {};

  render() {
    return (
      <View style={styles.container}>
        <WhiteNavHeader title={i18n.t("refillLoader.confirmation")} />
        <View style={styles.textContainer}>
          <Text style={styles.txtMainDesc}>
            {i18n.t("refund.successDesc1")}
          </Text>
          <Image
            source={require("../../../../assets/images/check_circle.png")}
          />
          <Text style={styles.txtMainDesc}>
            {i18n.t("refund.successDesc2")}
          </Text>
        </View>

        <View style={styles.bottomConatiner}>
          <Text style={styles.txtDesc}>
            {i18n.t("refillLoader.findHistoryDesc")}
          </Text>
          <KralissRectButton
            style={styles.buttonContainer}
            enabled={true}
            onPress={this.onPressReturn}
            title={i18n.t("passwdIdentify.return")}
          />
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
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  txtMainDesc: {
    color: "#484848",
    fontSize: RFPercentage(2.2),
    textAlign: "center",
    marginTop: 25,
    marginBottom: 12
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    marginTop: 20,
    marginBottom: 5
  },
  bottomConatiner: {
    height: 150,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  buttonContainer: {
    height: 60
  },
  txtDesc: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    textAlign: "center",
    marginBottom: 32,
    marginLeft: 40,
    marginRight: 40
  }
});
