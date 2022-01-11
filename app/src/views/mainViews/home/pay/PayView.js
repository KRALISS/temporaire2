import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert,
  PermissionsAndroid
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import {RFPercentage} from "react-native-responsive-fontsize";
import { connect } from "react-redux";

import Loader from "../../../../components/loader/Loader";
import i18n from "../../../../locale/i18n";
import {
  reqQRCodesInit,
  reqUseQRCode,
  reqDeleteQRCodes
} from "../../../../reducers/qrCodes";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import { getDeviceInformations } from "../../../../utils/deviceInfo";
import Geolocation from 'react-native-geolocation-service';
import { RNCamera } from 'react-native-camera';

export default class PayView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mobileInfos: {},
      myConversionRate: 0,
      myUnit: "",
      myUnitAPI:"",
      qrAmount: 0,
      qrId: "",
      qrValidCode: "",
      cashUnit:"",
      cashUnitAPI:"",
      loading: false
    }
  }


 requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
 };

  onSuccess = e => {
    console.log("558",e);
    let scanValue = e.data.replace(/\'/g, '"');
    const qrData = JSON.parse(scanValue);
    if (qrData !== null) {
      const qrId = qrData.qr_id;
      const qrAmount = parseFloat(qrData.qrAmount) * this.state.myConversionRate;
      const cashUnit = qrData.cashUnit;
      const cashUnitAPI = qrData.cashUnitAPI;

      this.setState(
        {
          qrId,
          qrAmount,
          cashUnit,
          cashUnitAPI
        },
        this.showConfirmAlert
      );
    }
  };

  showConfirmAlert = () => {
    const { qrAmount, myUnit } = this.state;
    setTimeout(() => {
      Alert.alert(
        i18n.t("refillLoader.confirmation"),
        i18n.t("pay.confirmRequest", {
          qrAmount: qrAmount.toFixed(2),
          myUnit
        }),
        [
          {
            text: i18n.t("beneficiary.cancel"),
            onPress: () => {
              this.deleteQRCodeRequest();
            }
          },
          {
            text: i18n.t("forgotPassword.validateButton"),
            onPress: () => {
              this.setState({loading: true})
              this.useQRCodeReques();
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  useQRCodeReques = () => {
    const { qrId, cashUnitAPI,myUnitAPI} = this.state;
    this.props.reqUseQRCode({
      requestCode: 0,
      qrCode: "/api/qr_codes/"+qrId,
      currencyStart: myUnitAPI,
      currencyEnd: cashUnitAPI,
      transactionType: "api/type_transactions/1"
      //mobile_infos: this.state.mobileInfos
    });
  };

  showErrorAlert(title, message) {
    setTimeout(() => {
      Alert.alert(
        title,
        message,
        [
          {
            text: i18n.t("passwdIdentify.return"),
            onPress: () => {}
          }
        ],
        { cancelable: true }
      );
    }, 100);
  }

  gotoPayConfirm = statusData => {
    this.props.navigation.navigate("PayConfirm", { data: statusData,myUnit:this.state.myUnit });
  };

  deleteQRCodeRequest = () => {
    this.props.reqDeleteQRCodes(this.state.qrId);
  };

  componentDidMount = async () => {
    await this.requestCameraPermission();
    try {
      const myuserInternational = await loadLocalData("myuserInternational");
      this.setState({
        myUnitAPI: myuserInternational["@id"],
        myUnit: myuserInternational["currencyCode"],
        myConversionRate: 1,
      });
      const value = await getDeviceInformations(Geolocation);
      saveLocalData("mobileInfos", value);
      this.setState({
        mobileInfos: value,
        loading: false
      });
    } catch (error) {
      setTimeout(() => {
        this.showErrorAlert(error.message);
      }, 500)
    }
  };

  componentDidUpdate() {
    const { error, payLoad } = this.props;
    if (error !== undefined) {
      this.setState({loading: false})
      this.props.reqQRCodesInit();
      const { message, error_code } = error;
      let errorTitle = i18n.t("sendMoney.insuffBalance");
      let errorMsg = i18n.t("sendMoney.insuffMsg");
      if (error_code !== undefined) {
        if (error_code === "2") {
          errorTitle = i18n.t("sendMoney.monthThrsholdErrTitle");
          errorMsg = i18n.t("sendMoney.monthThrsholdMsg");
        }
        if (error_code === "3") {
          errorTitle = i18n.t("sendMoney.recipErrorTitle");
          errorMsg = i18n.t("sendMoney.recipErrorMsg");
        }
      }
      setTimeout(() => {
        this.showErrorAlert(errorTitle, errorMsg);
      }, 500)
      /*this.gotoPayConfirm({
        converted_amount: "2.30",
        devise_iso_code: "USD",
        kraliss_amount: "2.00",
        datetime: "2018-10-18T22:18:15.216032Z",
        receiver_name: "Valerie Venirazer",
        receiver_account_number: "1211-1211-5671-6848",
        transaction_number: "11211141214114251315"
      });*/
    }

    if (payLoad !== undefined && payLoad.transfer_informations !== null) {
      this.setState({loading: false})
      this.props.reqQRCodesInit();
      this.props.navigation.navigate("PayConfirm");
      this.gotoPayConfirm(payLoad);
    }
  }

  componentWillUnmount() {
    this.setState({loading: false})
    this.props.reqQRCodesInit();
  }

  render() {
    console.log(this.state)
    return (
      <View style={styles.mainContainer}>
        <Loader
          loading={this.state.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />

        <QRCodeScanner
        onRead={this.onSuccess}
        //flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <Text style={styles.centerText}>
            <Text style={styles.textBold}>Scan the QR code to proceed to payment</Text> 
          </Text>}
        />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => this.props.navigation.navigate("Home")}
          /*this.onSuccess({
              data:
                "{'qr_id': '8','amount': '2','validation_code': '0ecb65b407c4db7c577af8a231fd38dbb814dc75308797d3c33f31ca137419e4'}"
            })
          }*/
        >
          <Image source={require("../../../../assets/images/cross_grey.png")} />
        </TouchableOpacity>
        <Text style={styles.bottomText} numberOfLines={2}>
          {i18n.t("pay.scanDesc")}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, alignItems: "center" },
  fullScreen: { width: "100%", height: "100%" },
  zeroContent: {
    height: 0,
    flex: 0
  },
  backBtn: {
    position: "absolute",
    left: 20,
    top: 40
  },
  bottomText: {
    color: "#fff",
    fontSize: RFPercentage(2.0),
    textAlign: "center",
    position: "absolute",
    bottom: 20
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.useQRCodeReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqQRCodesInit,
  reqUseQRCode,
  reqDeleteQRCodes
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(PayView);
