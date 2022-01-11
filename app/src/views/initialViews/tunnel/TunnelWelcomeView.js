import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform,  Keyboard} from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
import PageControl from "react-native-page-control";
import RNLanguages from "react-native-languages";
import GradientView from "../../../components/gradientView/GradientView";
import NavHeader from "../../../components/navHeader/NavHeader";
import KralissPicker from "../../../components/kralissPicker/KralissPicker";
import KralissButton from "../../../components/kralissButton/KralissButton";
import KralissInput from "../../../components/kralissInput/KralissInput";
import { reqInternationals,reqLanguages } from "../../../reducers/internationals";
import { reqCompanyActivities } from "../../../reducers/companyActivities";
import Loader from "../../../components/loader/Loader";
import { saveLocalData } from "../../../utils/localStorage";
import {
  SecondaryColor,
  PageControlGrayColor
} from "../../../assets/styles/Styles";
//Add i18n
import i18n from "../../../locale/i18n";

class TunnelWelcomeView extends Component {
  state = {

    countryIndex: 0,
    country: "",
    userMode: i18n.t("tunnel.particular"),
    userModeIndex: 0,
    countries: [],
    languages:[],
    companyActivities :[],
    internationals: [],
    curSelSecurityID: "",
    bMailConfirmed: false,
    bRememberMe: false,
    showPwdkey: false,
    passwordLength: 0,
    passwordConfirmLength: 0,
    url: "https://www.kraliss.com/cgu",
    checked: false,

    stp1: false,
    stp2: false
  };



  onPressFollowing = () => {
    const { internationals } = this.state;

    /*saveLocalData(
      "idInternational",
      internationals[this.state.countryIndex].id
    );
    saveLocalData(
      "myuserInternational",
      internationals[this.state.countryIndex]
    );*/


    if (this.state.userModeIndex === 1) {
      saveLocalData("myuserIsBusiness", true);
      /*saveLocalData(
        "myInternationalData",
        internationals[this.state.countryIndex]
      );*/
      this.props.navigation.navigate("TunnelEnterprise2View");
    } else {
      saveLocalData("myuserIsBusiness", false);
      this.props.navigation.navigate("TunnelParticular2View");
    }
  };

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
  };

  onPressPageIndicator = index => {};

  componentDidMount() {
    this.props.reqInternationals();
    this.props.reqLanguages();
    this.props.reqCompanyActivities();
  }

  sortPropsInternational = (item1, item2) => {
    if (item1.international_name < item2.international_name) return -1;
    if (item1.international_name > item2.international_name) return 1;
    return 0;
  };
  sortPropsInternationalFr = (item1, item2) => {
    if (item1.international_name_fr < item2.international_name_fr) return -1;
    if (item1.international_name_fr > item2.international_name_fr) return 1;
    return 0;
  };

  componentDidUpdate = (prevProps, prevState) => {
    let  internationals  = this.props["internationals"];
    let  languagesAPI  = this.props["languages"];
    let  compagnyActivitiesAPI  = this.props["companyActivities"];

    if (this.props.internationals &&
      this.props.internationals.length > 0 &&
      this.state.countries.length === 0
    ) {
      saveLocalData("allInternationals", internationals)

      const iphoneLanguage = RNLanguages.language;
      let correctCountryLanguage = ""
      if (iphoneLanguage === "fr-FR") {
        correctCountryLanguage = "labelFr"
      } else {
        correctCountryLanguage = "label"
      }
      let countries = internationals
        .map(item => item[correctCountryLanguage])
      this.setState({ countries });
      if (iphoneLanguage === "fr-FR") { 
        internationals = internationals.sort(this.sortPropsInternationalFr);
      } else {
        internationals = internationals.sort(this.sortPropsInternational);
      }
      this.setState({ internationals: internationals });
      saveLocalData("internationals", internationals);

      const international_phones = internationals
        .map(item => item["phoneCode"])
        .sort(function(a, b) {
          return (
            a.length - b.length || a.localeCompare(b) // sort by length, if equal then
          ); // sort by dictionary order
        });

      saveLocalData("countries", countries);
      saveLocalData("internationalPhones", international_phones);
    }
    if (this.props.languages &&
      this.props.languages.length > 0 &&
      this.state.languages.length === 0
    ){
      saveLocalData("allLanguages", languagesAPI);
      let languages = languagesAPI
        .map(item => item["label"])
        .sort();
      this.setState({ languages });
      saveLocalData("languages", languages);


    }
    if (this.props.companyActivities &&
      this.props.companyActivities.length > 0 &&
      this.state.companyActivities.length === 0
    ){
      saveLocalData("allCompanyActivities", compagnyActivitiesAPI);
      let companyActivities = compagnyActivitiesAPI
        .map(item => item["label"])
        .sort();
      this.setState({ companyActivities });
      saveLocalData("companyActivities", companyActivities);

    }
    if (this.props.error) {
      this.props.navigation.navigate("ErrorView", {
        errorText: this.props.error
      }); //dispatch(navigateAction);
    }
  };

  render() {
    let buttonEnable = true;
    if (this.state.userMode.length === 0)
      buttonEnable = false; //achanger
    return (
      <GradientView style={styles.container}>
          {/* <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />*/}
          <NavHeader
            onBack={() => {
              this.props.navigation.goBack();
            }}
          />
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {i18n.t("tunnel.welcomeToKraliss")}
            </Text>
          </View>
          <ScrollView
          style={{height:'100%'}}
          contentContainerStyle={{justifyContent: "space-between"}}
          >
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            enabled= {Platform.OS === 'ios' ? true : false}
          >
            <View style={styles.center}>


               <KralissPicker
                placeHolder={i18n.t("tunnel.particularEnterprise")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={[
                  i18n.t("tunnel.particular"),
                  i18n.t("tunnel.enterprise")
                ]}
                value={this.state.userMode}
                onSelect={(userMode, userModeIndex) =>
                  {console.log(userMode, userModeIndex);
                  this.setState({ userMode, userModeIndex })}
                }
              />
               {/* <View style={styles.sponsorSection}>
                <Text style={{ color: "#fff", fontSize: 15, marginBottom: 10 }}>
                  {i18n.t("settings.sponsorship")}
                </Text>
                <KralissInput
                  ID="email"
                  placeHolder={i18n.t("sponsorship.addGodfather")}
                  onChangeText={this.onChangeInputText}
                  value={this.state.email}
                  style={{marginBottom: 20}}
                />
              </View> */}
            </View>

          </KeyboardAvoidingView>

          <View style={styles.footer}>
            <PageControl
              numberOfPages={3}
              currentPage={0}
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
              title={i18n.t("forgotPassword.validateButton")}
              enabled={buttonEnable}
            />
          </View>
        </ScrollView>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    // alignItems: "center"
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
    fontSize: RFPercentage(4.2),
    textAlign: "center"
  },
  center: {
    flex: 1,
    justifyContent: "flex-start"
  },
  footer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  sendBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20
  },
  sponsorSection: {
    marginTop: 50
  }
});

const mapStateToProps = state => {
  const { loading, error, internationals,payLoad2 } = state.internationalsReducer;
  const { companyActivities} = state.companyActivitiesReducer;

  return { loading, error, internationals: internationals,languages:payLoad2,companyActivities:companyActivities };
};

const mapDispatchToProps = {
  reqInternationals,
  reqLanguages,
  reqCompanyActivities
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(TunnelWelcomeView);
