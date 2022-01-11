import React, { Component } from "react";
import { StyleSheet, Image, ScrollView, Text, View } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";
import Moment from "moment";

import i18n from "../../../../locale/i18n";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import KralissClearCell from "../../../../components/kralissListCell/KralissClearCell";
import KralissMoneyIconCell from "../../../../components/kralissListCell/KralissMoneyIconCell";

export default class PayConfirmView extends Component {
  state = { loading: false };

  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { data,myUnit } = params.params;
    this.state = { payData: data,myUnit };
  }

  onPressReturn = async () => {
    this.props.navigation.navigate("Home");
  };

  componentDidMount = async () => {};

  render() {
    const { payData,myUnit } = this.state;
    const dateTime = Moment(payData.createdAt).format("DD/MM/YYYY a hh:mm:ss");

    let buttonEnabled = !this.props.loading;
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.txtMainDesc}>{i18n.t("pay.confirmTitle")}</Text>
          <Image
            source={require("../../../../assets/images/check_circle.png")}
          />
        </View>
        <ScrollView style={{ flex: 1, marginLeft: 20, marginRight: 20 }}>
          <Text style={styles.txtSectionTitle}>{i18n.t("cash.amount")}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={styles.txtBottomDesc}>
              {`${payData.amount} ${myUnit}`}
            </Text>
            <KralissMoneyIconCell
              style={{ position: "absolute", right: 0 }}
              title={`${i18n.t("sendMoney.thats")} ${payData.amount}`}
              titleFontSize={{ fontSize: RFPercentage(2.0) }}
            />
          </View>

          <Text style={styles.txtSectionTitle}>{i18n.t("cash.date")}</Text>
          <Text style={styles.txtBottomDesc}>{dateTime}</Text>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.beneficiary")}
          </Text>
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("tunnel.lastName")}
            detailContent={payData.receiverFullName}
          />
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("sendMoney.accountNumber")}
            detailContent={payData.receiver_account_number}
          />

          <Text style={styles.txtSectionTitle}>
            {i18n.t("cash.transactionNumber")}
          </Text>
          <Text style={styles.txtBottomDesc}>{payData.id}</Text>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.transactionType")}
          </Text>
          <Text style={styles.txtBottomDesc}>{i18n.t("pay.payment")}</Text>
        </ScrollView>

        <View style={styles.bottomConatiner}>
          <Text style={styles.txtDesc}>
            {i18n.t("refillLoader.findHistoryDesc")}
          </Text>
          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
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
    marginTop: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  txtMainDesc: {
    color: "#484848",
    fontSize: RFPercentage(2.2),
    marginTop: 25,
    marginBottom: 12
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
  bottomConatiner: {
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
