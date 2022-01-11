import React, {Component} from "react";
import {SafeAreaView, ScrollView, StyleSheet, View} from "react-native";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissListCell from "../../../components/kralissListCell/KralissListCell";
import i18n from "../../../locale/i18n";
import {loadLocalData} from "../../../utils/localStorage";
import moment from "moment";

export default class PersonalInfoView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { type, myuserIsBusiness } = params.params;
    let navTitle = i18n.t("settings.personalInfo");
    if (type === "COMP_INFO") {
      navTitle = i18n.t("personalInfo.companyInfo");
    } else if (type === "LEGAL_INFO") {
      navTitle = i18n.t("personalInfo.legalInfo");
    }
    this.state = {
      accountNumber: "",
      lastName: "",
      firstName: "",
      country: "",
      birthDate: "",
      interPhoneNum: "",
      myPhoneNum: "",
      interMobileNum: "",
      myMobileNum: "",
      address: "",
      IBAN: "",
      navTitle,
      type,
      myuserIsBusiness,
      Infotype:"",
      EditEnabled:true,
    };
  }

  onPressIBAN = () => {
    this.props.navigation.navigate("IBANInput");
  };

  onPressChangeInfo = (type) => {
    this.props.navigation.navigate("ModifyUserDetails", {
      type: type,
    });
  };

  componentDidMount = async () => {
    let accountNumber = await loadLocalData("kraAccountNumber");
    if (accountNumber === null) accountNumber = "";

    const lastName = await loadLocalData("lastName");
    const firstName = await loadLocalData("firstName");

    const userInternational = await loadLocalData("myuserInternational"); //


    const birthDate = moment(await loadLocalData("myuserBirthdate")).format(
      "DD/MM/YYYY ");
    ////
    const countries = await loadLocalData("countries", countries);
    const myuserBirthCountryAPI = await loadLocalData("myuserBirthCountry");
    const myuserBirthCountry = countries[parseInt(myuserBirthCountryAPI.split('/').pop())-1];

    const myuserAddressCountryAPI = await loadLocalData("myuserAddressCountry");
    const country = countries[parseInt(myuserAddressCountryAPI.split('/').pop())-1];
    const userBirthCity = await loadLocalData("userBirthCity");


    ////

    const interPhone = await loadLocalData("myuserInternationalPhone"); //
    let interPhoneNum = null;
    let myPhoneNum = null
    if (interPhone !== null) {
      interPhoneNum = interPhone["international_phone"];
      myPhoneNum = await loadLocalData("myuserPhoneNumber"); //myuser_phone_number
    }

    const interMobile = await loadLocalData("myuserInternationalMobilePhone"); //
    const interMobileNum = await loadLocalData("interMobileNum");
    const myMobileNum = await loadLocalData("myuserMobilePhoneNumber"); //myuser_mobile_phone_number

    const address = await loadLocalData("formattedAddress"); //formatted address​
    const email = await loadLocalData("email");

    const IBAN = await loadLocalData("kraIban");

    if (this.state.myuserIsBusiness) {
      const companyName = await loadLocalData("companyName");
      const identificationNumber = await loadLocalData("identificationNumber");
      const activityField = await loadLocalData("activityField");
      const companyPhoneNumber = await loadLocalData("companyPhoneNumber");
      const companyInternational = await loadLocalData("companyInternational");
      const functionInSociety = await loadLocalData("functionInSociety");
      this.setState({
        accountNumber,
        lastName,
        firstName,
        country,
        birthDate,
        interPhoneNum,
        myPhoneNum,
        interMobileNum,
        myMobileNum,
        address,
        IBAN,
        companyName,
        identificationNumber,
        activityField,
        companyPhoneNumber,
        companyInternational,
        email,
        functionInSociety
      });
    } else
      this.setState({
        email,
        accountNumber,
        lastName,
        firstName,
        country,
        birthDate,
        interPhoneNum,
        myPhoneNum,
        interMobileNum,
        myMobileNum,
        address,
        IBAN,
        myuserBirthCountry,
        userBirthCity
      });
  };

  componentDidUpdate = async(prevProps, prevState) => {
    kycValidationInProgress = await loadLocalData("kycValidationInProgress");
    if(kycValidationInProgress && this.state.EditEnabled  ){
      this.setState({EditEnabled: false});
    }
  
  }

  render() {
    const {
      email,
      type,
      accountNumber,
      lastName,
      firstName,
      country,
      birthDate,
      interPhoneNum,
      myPhoneNum,
      interMobileNum,
      myMobileNum,
      address,
      IBAN,
      companyName,
      identificationNumber,
      activityField,
      companyPhoneNumber,
      companyInternational,
      functionInSociety,
      navTitle,
      myuserIsBusiness,
      userBirthCity,
      myuserBirthCountry,
      EditEnabled
    } = this.state;

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>

        <WhiteNavHeader
          title={navTitle}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <ScrollView>
          <KralissListCell
            style={styles.marginCell}
            mainTitle={i18n.t("settings.accountNumber")}
            detailContent={accountNumber}
          />
          {type === "COMP_INFO" && (
            <View>
              <KralissListCell
                style={styles.marginCell}
                mainTitle={i18n.t("personalInfo.companyName")}
                detailContent={companyName}
              />
              <KralissListCell
                mainTitle={i18n.t("personalInfo.numberSIRET")}
                detailContent={identificationNumber}
                noTopPadding={true}
              />
              <KralissListCell
                mainTitle={i18n.t("personalInfo.fieldOfActivity")}
                detailContent={activityField}
                noTopPadding={true}
              />
            </View>
          )}

          {type !== "COMP_INFO" && (
            <View>
              <KralissListCell
                EditIcon={EditEnabled}
                onPress={() => this.onPressChangeInfo('email')}
                style={styles.marginCell}
                mainTitle={i18n.t("tunnel.email")}
                detailContent={email}
              />
              <KralissListCell
                EditIcon={EditEnabled}
                onPress={() => this.onPressChangeInfo('lastName')}
                style={styles.marginCell}
                mainTitle={i18n.t("tunnel.lastName")}
                detailContent={lastName}
              />
              <KralissListCell
                EditIcon={EditEnabled}
                onPress={() => this.onPressChangeInfo('firstName')}
                mainTitle={i18n.t("tunnel.firstName")}
                detailContent={firstName}
                noTopPadding={true}
              />
              <KralissListCell
              EditIcon={EditEnabled}
              onPress={() => this.onPressChangeInfo('userBirthCountry')}
              mainTitle={i18n.t("tunnel.userBirthCountry")}
              detailContent={myuserBirthCountry}
              noTopPadding={true}
            />
            <KralissListCell
              EditIcon={EditEnabled}
              onPress={() => this.onPressChangeInfo('userBirthCity')}
              mainTitle={i18n.t("tunnel.userBirthCity")}
              detailContent={userBirthCity}
              noTopPadding={true}
            />

            </View>

          )}


          <KralissListCell
            EditIcon={EditEnabled}
            onPress={() => this.onPressChangeInfo('country')}
            mainTitle={i18n.t("tunnel.country")}
            detailContent={country}
            noTopPadding={true}
          />


          {type !== "COMP_INFO" && (
            <KralissListCell
              mainTitle={i18n.t("tunnel.birthday")}
              detailContent={birthDate}
              noTopPadding={true}
            />
          )}

          {type === "LEGAL_INFO" && (
            <KralissListCell
              mainTitle={i18n.t("personalInfo.companyFixedTelephone")}
              detailContent={functionInSociety}
              noTopPadding={true}
            />
          )}

          {type === "COMP_INFO" && (
            <KralissListCell
              mainTitle={i18n.t("personalInfo.companyFixedTelephone")}
              detailContent={companyPhoneNumber === null ? i18n.t("settings.noPhoneNumber") : `${companyInternational} ${companyPhoneNumber}`}
              noTopPadding={true}
            />
          )}
          {type !== "COMP_INFO" && (
            <View>
              <KralissListCell
                EditIcon={EditEnabled}
                onPress={() => this.onPressChangeInfo('fixedTelephone')}            
                mainTitle={i18n.t("personalInfo.fixedTelephone")}
                detailContent={myPhoneNum === null ? i18n.t("settings.noPhoneNumber") : `${interPhoneNum} ${myPhoneNum}`}
                noTopPadding={true}
              />
              <KralissListCell
                EditIcon={EditEnabled}
                onPress={() => this.onPressChangeInfo('mobileNumber')}
                mainTitle={i18n.t("personalInfo.mobileNumber")}
                detailContent={(interMobileNum | myMobileNum) === null || undefined ? i18n.t("settings.noPhoneNumber") :`${interMobileNum} ${myMobileNum}`}
                noTopPadding={true}
              />
            </View>
          )}
          {(type !== "LEGAL_INFO" && (type === "COMP_INFO" || (type==="PERSON_INFO" && myuserIsBusiness === false))) && (
            <View>
              <KralissListCell
                ID="address"
                EditIcon={EditEnabled}
                onPress={this.onPressChangeInfo}
                mainTitle={i18n.t("tunnel.address")}
                detailContent={address}
                noTopPadding={true}
              />


            </View>
          )}
        </ScrollView>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1
  },
  marginCell: {
    marginTop: 12
  },
  marginSection: {
    marginTop: 20
  }
});
