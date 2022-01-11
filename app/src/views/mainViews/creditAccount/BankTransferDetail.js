import React, {Component} from "react";
import {SafeAreaView,ScrollView, Alert,StyleSheet, Text, TouchableOpacity, View} from "react-native";
import RNLanguages from "react-native-languages";
import {RFPercentage} from "react-native-responsive-fontsize";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import Loader from "../../../components/loader/Loader";
import i18n from "../../../locale/i18n";
import KralissClearCell from "../../../components/kralissListCell/KralissClearCell";

export default class BankTransferDetail extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }


  render(){
    let { amount,conversionRate,unit } = this.props.navigation.state.params;
    return(
      <SafeAreaView
        style={styles.container}
      >
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

            <Text style={[styles.txtSectionTitle,{marginTop:hp(2)}]}>
              {i18n.t("creditMyAccount.accountRefill")}
            </Text>
            <KralissClearCell
              mainTitle={i18n.t("creditMyAccount.accountRefillText")}
            />


            <Text style={styles.txtSectionTitle}>
              {i18n.t("creditMyAccount.amount")}
            </Text>
            <KralissClearCell
              style={{}}
              mainTitle={`${(amount * conversionRate).toFixed(2)} ${unit}`}
            />


            <Text style={styles.txtSectionTitle}>
              {i18n.t("creditMyAccount.amount")}
            </Text>
            <KralissClearCell
              mainTitle={i18n.t("creditMyAccount.kralissIbanNumber")}
            />

            <Text style={styles.txtSectionTitle}>
              {i18n.t("creditMyAccount.bic")}
            </Text>
            <KralissClearCell
              mainTitle={i18n.t("creditMyAccount.kralissBicNumber")}
            />


            <Text style={[styles.txtSectionTitle,{marginTop:hp(4)}]}>
              {i18n.t("creditMyAccount.reference")}
            </Text>
            <Text style={styles.txtStyle}>
              <Text style={{color:"#484848"}}>{i18n.t("creditMyAccount.referenceTextPart1")} </Text>
              <Text style={{color:"#05ACA9",fontWeight:'bold'}}>{i18n.t("creditMyAccount.referenceTextBoldPart1")} </Text>
              <Text style={{color:"#484848"}}>{i18n.t("creditMyAccount.or")} </Text>
              <Text style={{color:"#05ACA9",fontWeight:'bold'}}>{i18n.t("creditMyAccount.referenceTextBoldPart2")} </Text>
              <Text style={{color:"#484848"}}>{i18n.t("creditMyAccount.referenceTextPart2")} </Text>
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    )
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
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    marginTop: hp(4),
    marginBottom: 12
  },
  txtStyle:{
      color: "#484848",
      fontSize: RFPercentage(2.1)
  }
});
