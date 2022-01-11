import React, {Component} from "react";
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import GradientView from "../../../components/gradientView/GradientView";
import KralissVerticalButton from "../../../components/kralissButton/KralissVerticalButton";
import i18n from "../../../locale/i18n";
import {clearPushData, loadLocalData, loadPushData, saveLocalData} from "../../../utils/localStorage";
import {reqDeviceApns} from "../../../reducers/device";
import {reqPushProcessInit} from "../../../reducers/pushProcess";
import {reqConfirmGodfather, reqInitConfirmGodfather} from "../../../reducers/confirmGodfather";

export default class HomeMainView extends Component {
  onPressPayer = () => {
    this.props.navigation.navigate("PasswdIndentify", {
      title: i18n.t("home.pay"),
      nextNavigate: "Pay",
      paramData: ""
    });
    //this.props.navigation.navigate("Pay");
  };

  processPushData = async () => {
    const data = await loadPushData();
    if (data !== null) {
      clearPushData();
      if (data.type === "REQUEST_ASK") {                    //ASK MONEY NOTIFICATION
        this.props.navigation.navigate("ConfirmAsk", data);
      }
      if (data.type === "REQUEST_RESPONSE") {
        this.props.navigation.navigate("TransHistory")      //ASK MONEY RESPONSE NOTIFICATION
      }
      if (data.type === "SEND_RESPONSE") {                  //ALERT THE RECEIVER OF A PAYMENT
        this.props.navigation.navigate("TransHistory")
      }
      if (data.type === "GODFATHER_ASK") {                  //ASKING TO HAVE X AS A GODFATHER
        this.godfatherAsking(data)
      }
      if (data.type === "GODFATHER_RESPONSE") {             //ALERT THE GODFATHER
        //Do nothing for now
      }
    }
  };

  godfatherAsking = (data) => {
    setTimeout(() => {
      Alert.alert(
          i18n.t('home.askGodfather'),
          i18n.t('home.askGodfatherDesc', {name: data.first_name, lastname: data.last_name}),
          [
            {
              text: i18n.t("home.askGodfatherCancel"),
              onPress: () => {
                this.props.confirmGodfather("declined")
              },
              style: 'cancel',
            },
            {text: i18n.t("home.askGodfatherConfirm"), onPress: () => this.props.reqConfirmGodfather(data.email)},
          ],
          {cancelable: false},
      )
    },100)
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { pushChecking, confirmGodfather, error } = this.props;
    if (pushChecking === true) {
      this.props.reqPushProcessInit();
      this.processPushData();
    }
    if (confirmGodfather !== null) {
      this.props.reqInitConfirmGodfather()
      setTimeout(() => {
        Alert.alert(
          i18n.t('home.askConfirmation'),
          i18n.t('home.askConfirmationDesc'),
        )
      },500)
    }
    if (error !== "") {
      this.props.reqInitConfirmGodfather()
      setTimeout(() => {
        Alert.alert(
          i18n.t('home.askConfirmation'),
          i18n.t('home.askConfirmationDesc'),
        )
      },500)
    }
  };

  componentDidMount = async () => {
    try {
      const token = await loadLocalData("token");
      await this.props.reqDeviceApns(token);
      
      const statusKYC = await loadLocalData("kycStatus")
      const statusKYCAlertExpiration = await loadLocalData("statusKYCAlertExpiration");
      if(statusKYC === "INVALID" && (!statusKYCAlertExpiration || statusKYCAlertExpiration < new Date().getTime())) {
        saveLocalData("statusKYCAlertExpiration", new Date().getTime() + (1000 * 60 * 60))
        setTimeout(() => {
          Alert.alert(
              i18n.t('home.information'),
              i18n.t('home.apimoneyKYCdenied'),
          )
        },500)
      }
    } catch (error) {
      console.log(error)
      //this.showErrorAlert(error.message);
    }
    this.processPushData();
  };

  onPressSendMoney = () => {
    this.props.navigation.navigate("BeneficiaryList", {
      title: i18n.t("home.sendMoney"),
      kind: "SendMoney"
    });
  };

  onPressAskMoney = () => {
    this.props.navigation.navigate("BeneficiaryList", {
      title: i18n.t("home.askForMoney"),
      kind: "AskMoney"
    });
  };

  onPressCash = () => {
    this.props.navigation.navigate("PasswdIndentify", {
      title: i18n.t("home.cash"),
      nextNavigate: "CashEnter",
      paramData: ""
    });
  };

  goToContact = () => {
    this.props.navigation.navigate("Contact", {
      original: "homeView"
    });
  }

  render() {
    return (
      <GradientView style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.headerLogo}
            source={require("../../../assets/images/symbol_kraliss.png")}
          />
        </View>

        <View style={styles.center}>
          <Image
            style={styles.imgCross}
            source={require("../../../assets/images/cross_welcome.png")}
          />
          <View style={styles.centerContent}>
            <View style={styles.contentFirstRow}>
              <KralissVerticalButton
                style={styles.btnTopCenter}
                enabled={true}
                image={require("../../../assets/images/payer.png")}
                title={i18n.t("home.pay")}
                onPress={this.onPressPayer}
              />
            </View>
            <View style={styles.contentSecondRow}>
              <KralissVerticalButton
                style={styles.btnLeftMiddle}
                enabled={true}
                image={require("../../../assets/images/envoyer.png")}
                title={i18n.t("home.sendMoney")}
                onPress={this.onPressSendMoney}
              />
              <KralissVerticalButton
                style={styles.btnRightMiddle}
                enabled={true}
                image={require("../../../assets/images/demander.png")}
                title={i18n.t("home.askForMoney")}
                onPress={this.onPressAskMoney}
              />
            </View>
            <View style={styles.contentThirdRow}>
              <KralissVerticalButton
                style={styles.btnBottomCenter}
                enabled={true}
                image={require("../../../assets/images/encaisser.png")}
                title={i18n.t("home.cash")}
                onPress={this.onPressCash}
              />
            </View>
          </View>
          <TouchableOpacity onPress={this.goToContact}>
            <Text style={styles.technical}>{i18n.t("home.technicalIssue")}</Text>
          </TouchableOpacity>
        </View>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  header: {
    marginTop: 20,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  headerLogo: { width: 45, height: 45 },
  imgCross: {
    position: "absolute",
    left: "10%",
    top: "10%",
    width: "80%",
    height: "80%"
  },
  center: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  centerContent: {
    width: "100%",
    height: "80%",
    flexDirection: "column"
  },
  contentFirstRow: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  contentSecondRow: {
    justifyContent: "space-between",
    flex: 0.6,
    width: "100%",
    alignItems: "center",
    flexDirection: "row"
  },

  contentThirdRow: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  btnTopCenter: {
    // width: 150,
    height: 100
  },
  btnLeftMiddle: {
    // width: 150,
    height: 100
  },
  btnRightMiddle: {
    // width: 150,
    height: 100
  },
  btnBottomCenter: {
    // width: 150,
    height: 100
  },
  technical: {
    color: "#fff",
    textDecorationLine: "underline"
  }
});

const mapStateToProps = state => {
  const { pushChecking } = state.pushProcessReducer;
  const {payload: confirmGodfather, error} = state.confirmGodfatherReducer

  return { 
    pushChecking, 
    confirmGodfather, 
    error
  };
};

const mapDispatchToProps = {
  reqPushProcessInit,
  reqDeviceApns,
  reqConfirmGodfather,
  reqInitConfirmGodfather
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeMainView);
