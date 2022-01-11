import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import PageControl from "react-native-page-control";
import GradientView from "../../../components/gradientView/GradientView";
import NavHeader from "../../../components/navHeader/NavHeader";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissButton from "../../../components/kralissButton/KralissButton";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import { reqPatchMyUsers, reqPatchUsersInit } from "../../../reducers/patchMyUsers";
import { reqSignup } from "../../../reducers/signup";
import Loader from "../../../components/loader/Loader";
import {
  SecondaryColor,
  PageControlGrayColor
} from "../../../assets/styles/Styles";
//Add i18n
import i18n from "../../../locale/i18n";

export default class TunnelPersonalInfoView extends Component {
  state = {
    IBAN: ""
  };

  onPressFollowing = () => {
    saveLocalData("kraIban", this.state.IBAN);
    this.sendPatchRequest();
  };

  async sendPatchRequest() {
    let _reqdata = {};

    const myuserIsBusiness = await loadLocalData("myuserIsBusiness");

    //civility
    const myuser_email = await loadLocalData("txtEmail");
    _reqdata["email"] = myuser_email;
    //civility
    const myuser_password = await loadLocalData("password");
    _reqdata["password"] = myuser_password;  

    //civility
    const myuser_civility = await loadLocalData("civility");
    _reqdata["civility"] = myuser_civility;

    //common data
    const firstName = await loadLocalData("firstName");
    _reqdata["firstName"] = firstName;
    const lastName = await loadLocalData("lastName");
    _reqdata["lastName"] = lastName;

    const myuserNationality = await loadLocalData("myuserNationality");
    _reqdata["nationality"] = myuserNationality;

    const myuserLanguage = await loadLocalData("myuserLanguage");
    _reqdata["language"] = myuserLanguage;

    if (myuserIsBusiness === true) {
      _reqdata["myuser_birth_city"] = "";
      _reqdata["myuser_residence_city"] = "";
    }

    const idInternationalPhone = await loadLocalData("myuserInternationalPhone");
    if(idInternationalPhone !== null) {
      _reqdata["phoneMobileIntId"] = idInternationalPhone.id;
    }

    const myuserPhoneNumber = await loadLocalData("myuserPhoneNumber");
    if(myuserPhoneNumber !== null) {
      _reqdata["phoneFixed"] = myuserPhoneNumber;
    }

    const idInternationalMobilePhone = await loadLocalData(
      "myuserInternationalMobilePhone"
    );
    if(idInternationalMobilePhone !== null) {
      _reqdata["phoneMobileInt"] = idInternationalMobilePhone.id;
    }


    const myuserMobilePhoneNumber = await loadLocalData(
      "myuserMobilePhoneNumber"
    );

    if(myuserMobilePhoneNumber !== null){
      _reqdata["phoneMobile"] = parseInt(myuserMobilePhoneNumber);
    }

    _reqdata["myuser_is_business"] = myuserIsBusiness;

    const address = await loadLocalData("address");

    const residenceCountry = await loadLocalData("residenceCountry");
    _reqdata["residenceCountry"] = residenceCountry; 
    const adressLabel = await loadLocalData("adressLabel");
    _reqdata["adressLabel"] = adressLabel;

    const addressZipCode = await loadLocalData("addressZipCode");
    _reqdata["addressZipCode"] = parseInt(addressZipCode);

    const adressCity = await loadLocalData("adressCity");
    _reqdata["adressCity"] = adressCity;
    ////

    const userBirthCity = await loadLocalData("userBirthCity");
    _reqdata["birthCity"] = userBirthCity;

    const myuserBirthCountry = await loadLocalData("myuserBirthCountry");
    _reqdata["birthCountry"] = myuserBirthCountry;

    ///


    const idInternational = await loadLocalData("idInternational");
    _reqdata["id_international"] = idInternational;

    const myuserBirthDate = await loadLocalData("myuserBirthdate");
    _reqdata["birthDate"] = myuserBirthDate;

    const godfather = await loadLocalData("godfatherEmail")
    if (godfather !== null) {
      _reqdata["godfather"] = godfather;
    }

    if (myuserIsBusiness === true) {
      // company info
      let _companyInfo = {};
      const companyName = await loadLocalData("companyName");
      _companyInfo["company_name"] = companyName;
      const identificationNumber = await loadLocalData("identificationNumber");
      _companyInfo["identification_number"] = identificationNumber;
      const activityField = await loadLocalData("activityField");
      _companyInfo["activity_field"] = activityField;

      const companyPhoneNumber = await loadLocalData("companyPhoneNumber");
      const idCompanyInternational = await loadLocalData(
        "idCompanyInternational"
      );
      if(companyPhoneNumber !== null) {
        _companyInfo["company_phone_number"] = companyPhoneNumber;
        _companyInfo["id_company_international"] = idCompanyInternational;
      }

      _companyInfo["address"] = address;
      _reqdata["company"] = _companyInfo;
    } 
    _reqdata["kra_iban"] = this.state.IBAN;
    this.props.reqSignup(_reqdata);
  }

  onPressPageIndicator = index => {};
  onPressPass = () => {
    this.sendPatchRequest();
  };

  onAddressSelected = place => {
    this.setState({ addressText: place.address });
  };

  componentDidUpdate = (prevProps, prevState) => {

    if (this.props.payLoad !== undefined) {
      const  id  = this.props.payLoad.id;
      if (id !== undefined) {
        const navigateAction = NavigationActions.navigate({
          routeName: "ConfirmSuccessView",
          params: {
            title: i18n.t("tunnel.patchSuccessTitle"),
            descMessage: i18n.t("tunnel.patchSuccessDesc"),
            route: "Login",
            success: true,
            comingFrom:"Tunnel"
          }
        });
        this.props.navigation.dispatch(navigateAction);
      }
    }

    if (this.props.error) {
      this.props.reqPatchUsersInit()
      this.props.navigation.navigate("ErrorView", {
        errorText: this.props.error,
        info: this.props.info
      });
      /*const navigateAction = NavigationActions.navigate({
        routeName: "ConfirmSuccessView",
        params: {
          title: i18n.t("tunnel.patchSuccessTitle"),
          descMessage: i18n.t("tunnel.patchSuccessDesc"),
          route: "Main"
        }
      });
      this.props.navigation.dispatch(navigateAction);*/
    }
  };

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
  };

  render() {
    const params = this.props.navigation.state;
    const bEnterprise = false; //params.params.enterprise;
    let buttonEnable = true;
    //if (this.state.IBAN.length === 0) buttonEnable = false;
    return (
      <GradientView style={styles.container}>
        <NavHeader
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>{i18n.t("tunnel.personalInfo")}</Text>
        </View>

        <View style={styles.center}>
          <KralissInput
            ID="IBAN"
            placeHolder={i18n.t("tunnel.IBAN")}
            onChangeText={this.onChangeInputText}
            value={this.state.IBAN}
          />
          <Text style={styles.skipDescText}>
            {i18n.t("tunnel.skipStepDesc")}
          </Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.textBtn} onPress={this.onPressPass}>
            <Text style={styles.passBtnText}>{i18n.t("tunnel.pass")}</Text>
          </TouchableOpacity>
          <PageControl
            style={styles.pageIndicator}
            numberOfPages={bEnterprise ? 4 : 3}
            currentPage={bEnterprise ? 3 : 2}
            hidesForSinglePage
            pageIndicatorTintColor={PageControlGrayColor}
            currentPageIndicatorTintColor={SecondaryColor}
            indicatorStyle={{ borderRadius: 5 }}
            currentIndicatorStyle={{ borderRadius: 5 }}
            indicatorSize={{ width: 8, height: 8 }}
            onPageIndicatorPress={this.onPressPageIndicator}
          />
          <KralissButton
            style={styles.sendBtn}
            onPress={this.onPressFollowing}
            title={i18n.t("tunnel.following")}
            enabled={buttonEnable}
          />
        </View>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  header: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    color: "#fff",
    fontSize: RFPercentage(2.3),
    textAlign: "center"
  },
  center: {
    flex: 1,
    justifyContent: "flex-start"
  },
  footer: {
    flexDirection: "column",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  pageIndicator: {
    flex: 1,
    marginTop: 20
  },
  skipDescText: {
    marginTop: 30,
    color: "#8fff",
    fontSize: RFPercentage(2.1)
  },
  sendBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20
  },
  textBtn: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  passBtnText: {
    color: "#fff",
    fontSize: RFPercentage(2.2),
    textAlign: "center"
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error, info } = state.signupReducer;
  return {
    payLoad,
    loading,
    error,
    info
  };
};

const mapDispatchToProps = {
  reqPatchMyUsers,
  reqPatchUsersInit,
  reqSignup
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(TunnelPersonalInfoView);
