import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import React, { Component } from "react";
import {RFPercentage} from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import PageControl from "react-native-page-control";
import Moment from "moment";
import GradientView from "../../../../components/gradientView/GradientView";
import NavHeader from "../../../../components/navHeader/NavHeader";
import KralissPicker from "../../../../components/kralissPicker/KralissPicker";
import KralissInput from "../../../../components/kralissInput/KralissInput";
import KralissAddressInput from "../../../../components/kralissInput/KralissAddressInput";
import KralissButton from "../../../../components/kralissButton/KralissButton";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import KralissDatePicker from "../../../../components/kralissPicker/KralissDatePicker";
import {
  SecondaryColor,
  PageControlGrayColor
} from "../../../../assets/styles/Styles";
//Add i18n
import i18n from "../../../../locale/i18n";

export default class TunnelParticular2View extends Component {
  state = {
    civility: "",
    civilityIndex: "",
    lastName: "",
    firstName: "",
    // myuserBirthdate: new Date(),
    myuserNationality: "", //international_iso_code
    myuserNationalityIndex: 0,
    myuserLanguage: "", //international_iso_code
    myuserLanguageIndex: 0,
    userBirthCity:"",
    myuserBirthCountryIndex: 0,
    myuserBirthCountry: "",
    idInternationalPhone: "",
    idInternationalPhoneIndex: 0,
    myuserPhoneNumber: "",
    idInternationalMobilePhone: "", //international_iso_code
    idInternationalMobilePhoneIndex: 0,
    myuserMobilePhoneNumber: "",
    addressText: "",
    addressLabel:"",
    adressCity:"",
    addressZipCode:"",
    residenceCountry: "",
    residenceCountryIndex: 0,

    addressGPlaceValue: undefined,

    internationalPhonesNum: [],
    countries: [],
    internationals: [],
    allInternationals: [],
    languages: []
  };

  onPressFollowing = async () => {
    /// CIVILITY
    if(this.state.civilityIndex === 0) {
      saveLocalData("civility", "Mr")
    } else if (this.state.civilityIndex === 1) {
      saveLocalData("civility", "Mme")
    };
    saveLocalData("firstName", this.state.firstName);
    saveLocalData("lastName", this.state.lastName);

    /// Get all the infos of country
    let listsCountries = await loadLocalData("allInternationals");
    listsCountries = listsCountries.sort(this.sortPropsInternational)


    saveLocalData(
      "myuserNationality",
      listsCountries[this.state.myuserNationalityIndex]["@id"]
    );

    let listsLanguages = await loadLocalData("allLanguages");
    saveLocalData(
      "myuserLanguage",
      listsLanguages[this.state.myuserLanguageIndex]["@id"]
    );
    //////

    saveLocalData(
      "myuserBirthCountry",
      listsCountries[this.state.myuserBirthCountryIndex]["@id"]
    );
    saveLocalData("userBirthCity", this.state.userBirthCity);

/////

    const _birthDay = Moment(this.state.myuserBirthdate, "DD-MM-YYYY").format("YYYY-MM-DD");
    saveLocalData("myuserBirthdate", _birthDay);

    if(this.state.myuserPhoneNumber !== "" && this.state.idInternationalPhone !== "") {
      saveLocalData(
        "idInternationalPhone",
        this.state.internationalPhonesNum[this.state.idInternationalPhoneIndex]
      );
      saveLocalData(
        "myuserInternationalPhone",
        this.findTheGoodInternationnals(this.state.idInternationalPhone)
      );
      saveLocalData("myuserPhoneNumber",
        this.state.myuserPhoneNumber
      );
    }
    saveLocalData(
      "idInternationalMobilePhone",
      // this.state.internationals[this.state.idInternationalMobilePhoneIndex].id
      this.state.internationalPhonesNum[this.state.idInternationalMobilePhoneIndex]
    );
    saveLocalData(
      "myuserMobilePhoneNumber",
      this.state.myuserMobilePhoneNumber
    );
    saveLocalData(
      "myuserInternationalMobilePhone",
      this.findTheGoodInternationnals(this.state.idInternationalMobilePhone)
    );

    saveLocalData(
    "residenceCountry",
      this.state.allInternationalsAPIAuthorized[this.state.residenceCountryIndex]
      ["@id"]
    );

    //saveLocalData("address", this.state.addressGPlaceValue);
    saveLocalData("adressLabel", this.state.addressLabel);
    saveLocalData("addressZipCode", this.state.addressZipCode);
    saveLocalData("adressCity", this.state.adressCity);

    console.log("777",this.state.addressLabel );

    let age;
    if(this.state.myuserBirthdate) {
      age = Math.abs(Moment(this.state.myuserBirthdate, "DD-MM-YYYY").diff(Moment(), 'years'))
    } else {
      age = 0
    }

    if(this.state.idInternationalMobilePhone === "") {
      setTimeout(() => {
        Alert.alert(
          i18n.t('tunnel.indicatifTitle'),
          i18n.t('tunnel.indicatifDesc'),
        )
      }, 500)
    } else if (age < 18) {
      setTimeout(() => {
        Alert.alert(
          i18n.t('tunnel.ageTitle'),
          i18n.t('tunnel.ageDesc'),
        )
      }, 500)
    } else {
      const navigateAction = NavigationActions.navigate({
        routeName: "TunnelPersonalInfoView",
        params: { enterprise: false }
      });
      this.props.navigation.dispatch(navigateAction);
    };
    }


  findTheGoodInternationnals = (indicatifCountry) => {
    const {internationals} = this.state
    for(var i = 0; i < internationals.length; i ++ ) {
      if(indicatifCountry === internationals[i].international_phone) {
        return internationals[i];
      }
    }
  }
  onChangeAdress = (ID, txtAdress) => {

      this.setState({ addressTxt:txtAdress });
  };
  onPressPageIndicator = index => {};

  onAddressSelected = place => {
    this.setState({
      addressText: place.formatted_address,
      addressGPlaceValue: place
    });
  };

  sortPropsInternational = (item1, item2) => {
    if (item1.international_name < item2.international_name) return -1;
    if (item1.international_name > item2.international_name) return 1;
    return 0;
  };

  async componentDidMount() {
    const internationalPhonesNum = await loadLocalData("internationalPhones");
    this.setState({ internationalPhonesNum });
    const countries = await loadLocalData("countries");
    this.setState({ countries });
    const internationals = await loadLocalData("internationals");
    this.setState({ internationals });
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

    const languages = await loadLocalData("languages");
    this.setState({ languages });
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {myuserBirthdate} = this.state;
    if(myuserBirthdate && prevState.myuserBirthdate !== myuserBirthdate) {
      const age = Math.abs(Moment(myuserBirthdate, "DD-MM-YYYY").diff(Moment(), 'years'))
      if(age < 18) {
        setTimeout(() => {
          Alert.alert(
            i18n.t('tunnel.ageTitle'),
            i18n.t('tunnel.ageDesc'),
          )
        }, 500)
      }
    }
  };

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
  };

  render() {
    let buttonEnable = true;
    if (
      this.state.lastName.length === 0 ||
      this.state.firstName.length === 0 ||
      this.state.myuserNationality.length === 0 ||
      this.state.residenceCountry.length === 0
    )
      buttonEnable = true;

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
                {i18n.t("tunnel.legalRepresntative")}
              </Text>
            </View>

            <View style={styles.center}>
              <KralissPicker
                placeHolder={i18n.t("tunnel.civility")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={[i18n.t("tunnel.mister"), i18n.t("tunnel.miss")]}
                value={this.state.civility}
                onSelect={(civility, civilityIndex) => {
                  this.setState({ civility, civilityIndex });
                }}
              />
              <KralissInput
                ID="lastName"
                placeHolder={i18n.t("tunnel.lastName")}
                onChangeText={this.onChangeInputText}
                value={this.state.lastName}
              />
              <KralissInput
                ID="firstName"
                placeHolder={i18n.t("tunnel.firstName")}
                onChangeText={this.onChangeInputText}
                value={this.state.firstName}
              />
              <KralissDatePicker
                placeHolder={i18n.t("tunnel.birthday")}
                value={this.state.myuserBirthdate}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                onSelect={myuserBirthdate => {
                  this.setState({ myuserBirthdate });
                }}
              />
              <KralissPicker
                placeHolder={i18n.t("tunnel.nationality")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={this.state.allInternationals}
                value={this.state.myuserNationality}
                onSelect={(myuserNationality, myuserNationalityIndex) => {
                  this.setState({ myuserNationality, myuserNationalityIndex });
                }}
              />
              <KralissPicker
                placeHolder={i18n.t("tunnel.language")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={this.state.languages}
                value={this.state.myuserLanguage}
                onSelect={(myuserLanguage, myuserLanguageIndex) => {
                  this.setState({ myuserLanguage, myuserLanguageIndex });
                }}
              />
              <KralissPicker
                placeHolder={i18n.t("tunnel.userBirthCountry")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={this.state.allInternationals}
                value={this.state.myuserBirthCountry}
                onSelect={(myuserBirthCountry, myuserBirthCountryIndex) => {
                  this.setState({ myuserBirthCountry, myuserBirthCountryIndex });
                }}
              />

              <KralissInput
                ID="userBirthCity"
                placeHolder={i18n.t("tunnel.userBirthCity")}
                onChangeText={this.onChangeInputText}
                value={this.state.userBirthCity}
              />



              <Text style={styles.phoneSectionText}>
                {i18n.t("tunnel.phoneNumber")}
              </Text>
              <View style={styles.phoneSection}>
                <KralissPicker
                  style={styles.phoneNum1}
                  prefixString={this.state.idInternationalPhoneIndex === 0 ? "+" : " "}
                  placeHolder={i18n.t("tunnel.phoneNumEx1")}
                  confirmBtnTitle={i18n.t("tunnel.done")}
                  cancelBtnTitle={i18n.t("tunnel.cancel")}
                  pickerData={this.state.internationalPhonesNum}
                  value={this.state.idInternationalPhone}
                  onSelect={(idInternationalPhone, idInternationalPhoneIndex) =>
                    this.setState({
                      idInternationalPhone,
                      idInternationalPhoneIndex
                    })
                  }
                />
                <KralissInput
                  ID="myuserPhoneNumber"
                  style={styles.phoneNum2}
                  placeHolder={i18n.t("tunnel.phoneNumEx2")}
                  onChangeText={this.onChangeInputText}
                  keyboardType={"numeric"}
                  value={this.state.myuserPhoneNumber}
                />
              </View>
              <Text style={styles.phoneSectionText}>
                {i18n.t("tunnel.phoneNumbermobile")}
              </Text>
              <View style={styles.phoneSection}>
                <KralissPicker
                  style={styles.phoneNum1}
                  prefixString={this.state.idInternationalMobilePhoneIndex === 0 ? "+" : " "}
                  placeHolder={i18n.t("tunnel.phoneNumEx1")}
                  confirmBtnTitle={i18n.t("tunnel.done")}
                  cancelBtnTitle={i18n.t("tunnel.cancel")}
                  pickerData={this.state.internationalPhonesNum}
                  value={this.state.idInternationalMobilePhone}
                  onSelect={(
                    idInternationalMobilePhone,
                    idInternationalMobilePhoneIndex
                  ) =>
                    this.setState({
                      idInternationalMobilePhone,
                      idInternationalMobilePhoneIndex
                    })
                  }
                />
                <KralissInput
                  ID="myuserMobilePhoneNumber"
                  style={styles.phoneNum2}
                  placeHolder={i18n.t("tunnel.phoneNumEx2")}
                  onChangeText={this.onChangeInputText}
                  keyboardType={"numeric"}
                  value={this.state.myuserMobilePhoneNumber}
                />
              </View>
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
              <PageControl
                style={styles.pageIndicator}
                numberOfPages={3}
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
