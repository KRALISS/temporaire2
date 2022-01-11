import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform
} from "react-native";
import React, { Component } from "react";
import {RFPercentage} from "react-native-responsive-fontsize";
import PageControl from "react-native-page-control";
import GradientView from "../../../../components/gradientView/GradientView";
import NavHeader from "../../../../components/navHeader/NavHeader";
import KralissPicker from "../../../../components/kralissPicker/KralissPicker";
import KralissInput from "../../../../components/kralissInput/KralissInput";
import KralissAddressInput from "../../../../components/kralissInput/KralissAddressInput";
import KralissButton from "../../../../components/kralissButton/KralissButton";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import {
  SecondaryColor,
  PageControlGrayColor
} from "../../../../assets/styles/Styles";
//Add i18n
import i18n from "../../../../locale/i18n";

export default class TunnelEnterprise2View extends Component {
  state = {
    companyName: "",
    identificationNumber: "",
    activityField: "",
    addressText: "",
    addressGPlaceValue: undefined,
    idCompanyInternational: 0,
    internationalPhone: "",
    companyPhoneNumber: "",
    internationalPhonesNum: [],
    internationals: [],
    countries: [],
    companyActivities:[],
    addressLabel:"",
    adressCity:"",
    addressZipCode:"",

    residenceCountry: "",
    residenceCountryIndex: 0,

    indexActivityField: 0
  };

  translateForAPI = index => {
    const data = [
      "Agroalimentaire",
      "Banque / Assurance",
      "Bois / Papier / Carton / Imprimerie",
      "BTP / Matériaux de construction",
      "Chimie / Parachimie",
      "Commerce / Négoce / Distribution",
      "Edition / Communication / Multimédia",
      "Electronique / Electricité",
      "Etudes et conseils",
      "Industrie pharmaceutique",
      "Informatique / Télécoms",
      "Machine et équipements / Automobile",
      "Métallurgie / Travail du métal",
      "Plastique / Caoutchouc",
      "Services aux entreprises",
      "Textile / Habillement / Chaussure",
      "Transport / Logistique",
      "Autre"
    ]
    return data[index];
  }

  onPressFollowing = async () => {
    saveLocalData("companyName", this.state.companyName);
    saveLocalData("identificationNumber", this.state.identificationNumber);

    const activity = this.translateForAPI(this.state.indexActivityField)

    let listsCountries = await loadLocalData("allInternationals");

    saveLocalData(
      "residenceCountry",
      this.state.allInternationalsAPIAuthorized[this.state.residenceCountryIndex]["@id"]
          
      );

    let allCompanyActivities = await loadLocalData("allCompanyActivities");

    saveLocalData(
        "activityField",
          allCompanyActivities[this.state.indexActivityField]["@id"]
        );
    saveLocalData("address", this.state.addressGPlaceValue);
    saveLocalData("formattedAddress", this.state.addressText);

    saveLocalData("adressLabel", this.state.addressLabel);
    saveLocalData("addressZipCode", this.state.addressZipCode);
    saveLocalData("adressCity", this.state.adressCity);

    if(this.state.companyPhoneNumber !== "" && this.state.internationalPhone !== "") {
      saveLocalData(
        "idCompanyInternational",
        this.findTheGoodInternationnalsId(this.state.internationalPhone)
      );
      saveLocalData("companyPhoneNumber", this.state.companyPhoneNumber);
    }

    this.props.navigation.navigate("TunnelEnterprise3View");
  };

  findTheGoodInternationnalsId = (indicatifCountry) => {
    const {internationals} = this.state
    for(var i = 0; i < internationals.length; i ++ ) {
      if(indicatifCountry === internationals[i].international_phone) {
        return internationals[i].id;
      }
    }
  }

  onPressPageIndicator = index => {};

  onAddressSelected = place => {
    this.setState({
      addressText: place.formatted_address,
      addressGPlaceValue: place
    });
  };

  async componentDidMount() {
    const internationalPhonesNum = await loadLocalData("internationalPhones");
    this.setState({ internationalPhonesNum });
    const internationals = await loadLocalData("internationals");
    this.setState({ internationals });
    const countries = await loadLocalData("countries");
    this.setState({ countries });
    let allInternationals = await loadLocalData("allInternationals");
    allInternationals = allInternationals.sort(this.sortPropsInternational)
    let nameAllInternationals = [];
    let nameAllInternationalsAuthorized = [];
    let allInternationalsAuthorized = [];

    for(let i in allInternationals) {
      nameAllInternationals.push(allInternationals[i]["label"])
      if(allInternationals[i]["authorizedCountry"]){
        allInternationalsAuthorized.push(allInternationals[i])
        nameAllInternationalsAuthorized.push(allInternationals[i]["label"])
      }
    }
    this.setState({ 
      allInternationals: nameAllInternationals ,
      allInternationalsAuthorized:nameAllInternationalsAuthorized,
      allInternationalsAPIAuthorized:allInternationalsAuthorized
    })

    const companyActivities = await loadLocalData("companyActivities");
    this.setState({ companyActivities });
  }

  componentDidUpdate = (prevProps, prevState) => {};

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
  };

  render() {
    let buttonEnable = true;
    if (
      this.state.companyName.length === 0 ||
      this.state.identificationNumber.length === 0 ||
      this.state.activityField.length === 0 ||
      //this.state.adressLabel.length === 0 ||
      this.state.residenceCountry.length === 0
    ) 
      buttonEnable = false;
    return (
      <GradientView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled = {Platform.OS === 'ios' ? true : false}
        >
          <ScrollView>
            <NavHeader
              onBack={() => {
                this.props.navigation.goBack();
              }}
            />
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {i18n.t("tunnel.companyInfo")}
              </Text>
            </View>

            <View style={styles.center}>
              <KralissInput
                ID="companyName"
                placeHolder={i18n.t("tunnel.companyName")}
                onChangeText={this.onChangeInputText}
                value={this.state.company_name}
              />
              <KralissInput
                ID="identificationNumber"
                placeHolder={i18n.t("tunnel.numberSiret")}
                onChangeText={this.onChangeInputText}
                value={this.state.identification_number}
              />
              <KralissPicker
                placeHolder={i18n.t("tunnel.fieldActivity")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={this.state.companyActivities}
                value={this.state.activityField}
                onSelect={(activityField, index) => {
                  this.setState({ activityField, indexActivityField: index });
                }}
              />
              <KralissPicker
                placeHolder={i18n.t("tunnel.residenceCountry")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={this.state.allInternationalsAuthorized}
                value={this.state.residenceCountry}
                onSelect={(residenceCountry, residenceCountryIndex) => {
                  this.setState({ residenceCountry, residenceCountryIndex });
                }}
              />
              <KralissInput
                ID="addressLabel"
                placeHolder={i18n.t("tunnel.addressLabel")}
                onChangeText={this.onChangeInputText}
                value={this.state.addressLabel}
              />
              <KralissInput
                ID="adressCity"
                placeHolder={i18n.t("tunnel.adressCity")}
                onChangeText={this.onChangeInputText}
                value={this.state.adressCity}
              />
              <KralissInput
                ID="addressZipCode"
                placeHolder={i18n.t("tunnel.addressZipCode")}
                onChangeText={this.onChangeInputText}
                keyboardType={"numeric"}
                value={this.state.addressZipCode}
              />
              <Text style={styles.phoneSectionText}>
                {i18n.t("tunnel.phoneNumber")}
              </Text>
              <View style={styles.phoneSection}>
                <KralissPicker
                  style={styles.phoneNum1}
                  prefixString={this.state.idCompanyInternational === 0 ? "+" : " "}
                  placeHolder={i18n.t("tunnel.phoneNumEx1")}
                  confirmBtnTitle={i18n.t("tunnel.done")}
                  cancelBtnTitle={i18n.t("tunnel.cancel")}
                  pickerData={this.state.internationalPhonesNum}
                  value={this.state.internationalPhone}
                  onSelect={(internationalPhone, idCompanyInternational) =>
                    this.setState({
                      internationalPhone,
                      idCompanyInternational
                    })
                  }
                />
                <KralissInput
                  ID="companyPhoneNumber"
                  style={styles.phoneNum2}
                  placeHolder={i18n.t("tunnel.phoneNumEx2")}
                  onChangeText={this.onChangeInputText}
                  keyboardType={"numeric"}
                  value={this.state.companyPhoneNumber}
                />
              </View>
              <PageControl
                style={styles.pageIndicator}
                numberOfPages={4}
                currentPage={1}
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
          </ScrollView>
        </KeyboardAvoidingView>
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
  phoneSectionText: {
    marginTop: 30,
    color: "#fff",
    fontSize: RFPercentage(2.3),
    textAlign: "left"
  },
  center: {
    flex: 1,
    justifyContent: "flex-start"
  },
  pageIndicator: {
    flex: 1,
    marginTop: 50
  },
  phoneSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  phoneNum1: {
    flex: 0.3
  },
  phoneNum2: { flex: 0.7, marginLeft: 10 },
  sendBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20
  }
});
