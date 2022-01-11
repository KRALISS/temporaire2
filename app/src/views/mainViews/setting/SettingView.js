import React, {Component} from "react";
import {Alert, SafeAreaView, ScrollView, StyleSheet, Text,} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";

import {connect} from "react-redux";
import {NavigationActions} from "react-navigation";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissListCell from "../../../components/kralissListCell/KralissListCell";
import KralissProfileCell from "../../../components/kralissListCell/KralissProfileCell";
import i18n from "../../../locale/i18n";
import {loadLocalData, saveLocalData, clearPasswordData, deleteMyAccount} from "../../../utils/localStorage";
import {RFPercentage} from "react-native-responsive-fontsize";
import {reqInitLogout, reqLogout} from "../../../reducers/logout";
import {reqKYCStatus} from "../../../reducers/accountsMe";
import {reqGetDocMe} from "../../../reducers/documents";
import { View } from "react-native";
export class SettingView extends Component {
  state = {
    accountNumber: "",
    lastName: "",
    firstName: "",
    interPhoneNum: "",
    myPhoneNum: "",
    kraKycLevel: 0,
    documents:[],
    PROOF_OF_ID_Exist:false,
    PROOF_OF_IBAN_Exist:false,
    KYCValidation:false,
    //International for refund
    international: null,
    KYCCheck : false
  };

  onPressProfile = () => {
    // if (this.state.myuserIsBusiness === true)
    //   this.props.navigation.navigate("PersonalInfo", {
    //     type: "COMP_INFO",
    //     myuserIsBusiness: this.state.myuserIsBusiness
    //   });
    // else
      this.props.navigation.navigate("PersonalInfo", {
        type: "PERSON_INFO",
        myuserIsBusiness: this.state.myuserIsBusiness
      });
  };

  onPressCompanyProfile = () => {
    this.props.navigation.navigate("PersonalInfo", {
      type: "COMP_INFO",
      myuserIsBusiness: this.state.myuserIsBusiness
    });
  };

  onPressRefund = async () => {
    let kraKycLevel = await loadLocalData("kraKycLevel");
    if (kraKycLevel === null) kraKycLevel = 0;
    if (
      this.state.international.international_devise_iso_code === "EUR" &&
      kraKycLevel >= 2
    ) {
      this.props.navigation.navigate("RefundEnter");
    } else if (
      this.state.international.international_devise_iso_code !== "EUR"
    ) {
      this.props.navigation.navigate("RefundError", { kind: 3})
    } else {
      this.props.navigation.navigate("RefundError", { kind: 2})
    }
  };

  onPressMyAccount = () => {
    this.props.navigation.navigate("MyAccount");
  };

  onPressNotifications = () => {
    this.props.navigation.navigate("Notifications");
  };

  onPressInvoices = () => {
    this.props.navigation.navigate("Invoices");
  };

  onPressSponsor = () => {
    this.props.navigation.navigate("SponsorshipSummary")
  }

  onPressModifyPasswd = () => {
    this.props.navigation.navigate("ModifyPasswd");
  };

  onPressContacts = () => {
    this.props.navigation.navigate("Contacts");
  };

  onPressExchgRateCGU = () => {
    this.props.navigation.navigate("ExchangeRateCGU");
  };

  onPressLogout = () => {
    setTimeout(()=> {
      Alert.alert(
        i18n.t('settings.logoutAlertTitle'),
        i18n.t('settings.logoutAlertDesc'),
        [
          {
            text: i18n.t("settings.logoutConform"),
            onPress: async () => {
              // await deleteMyAccount()
              //this.props.reqLogout();
              await AsyncStorage.removeItem('auth_token')
              this.props.reqInitLogout();
              const action = NavigationActions.navigate({ routeName: 'Login' });
              this.props.navigation.dispatch(action);
            }
          }
        ],
        { cancelable: true }
      )
    }, 500)
  }
  checkDocsExist= async (docs) =>{
    this.setState({PROOF_OF_ID_Exist:false,PROOF_OF_IBAN_Exist:false})

      for( doc in docs){
        if (docs[doc].type == "PROOF_OF_ID"){
          this.setState({PROOF_OF_ID_Exist:true})
        }
        else if (docs[doc].type == "PROOF_OF_IBAN"){
          this.setState({PROOF_OF_IBAN_Exist:true})
        }
      }
  }
  componentDidMount = async () => {
    this.props.navigation.addListener("willFocus", async route => {
      await this.props.reqKYCStatus();
      this.setState({KYCCheck :true});
      this.props.reqGetDocMe(2); //List of docs
    });

  

    let accountNumber = await loadLocalData("kraAccountNumber");
    const myuserIsBusiness = await loadLocalData("myuserIsBusiness");

    const lastName = await loadLocalData("lastName");
    const firstName = await loadLocalData("firstName");
    const email = await loadLocalData("email");

    const interMobile = await loadLocalData("myuserInternationalMobilePhone"); //
    const interMobileNum = interMobile?.["international_phone"];
    const myMobileNum = await loadLocalData("myuserMobilePhoneNumber"); //myuser_mobile_phone_number

    const interPhone = await loadLocalData("myuserInternationalPhone"); //
    let interPhoneNum = '';
    let myPhoneNum = await loadLocalData("myuserPhoneNumber");
    /*if(myPhoneNum !== null) {
      interPhoneNum = interPhone["international_phone"];
       //myuser_phone_number
    } else {
      interPhoneNum = interMobileNum
      myPhoneNum = myMobileNum
    }*/

    let kraKycLevel = await loadLocalData("kraKycLevel");
    if (kraKycLevel === null) kraKycLevel = 0;
    if (accountNumber === null) accountNumber = "";

    //International Account for refund
    let international = await loadLocalData("myuserInternational");

    if (myuserIsBusiness === true) {
      const birthDate = moment(await loadLocalData("myuserBirthdate")).format(
        "DD/MM/YYYY ");
      const userBusiness = await loadLocalData("myUserBusiness");
      const companyAddress = await loadLocalData("formattedAddress");
      const companyPhoneNumber = await loadLocalData("companyPhoneNumber");
      const companyInternational = await loadLocalData("companyInternational");
      this.setState({
        accountNumber,
        myuserIsBusiness,
        lastName,
        firstName,
        email,
        interPhoneNum,
        myPhoneNum,
        kraKycLevel,
        birthDate,
        userBusiness,
        companyAddress,
        companyPhoneNumber,
        companyInternational
      });
    } else
      this.setState({
        accountNumber,
        myuserIsBusiness,
        lastName,
        firstName,
        email,
        interPhoneNum,
        myPhoneNum,
        kraKycLevel,
        international
      });
  };

  componentDidUpdate = async () => {
    const { payLoad,KYC,documents, error } = this.props;
    if(documents && this.state.documents != documents){
      this.setState({documents});
      await this.checkDocsExist(documents);
      myuserIsBusiness = await loadLocalData("myuserIsBusiness"); 
      if(myuserIsBusiness){
        this.updateKYCWariningBusiness();
      }
      else{
      this.updateKYCWariningStandard();
      }
    }
    
    if (KYC && KYC.Current_kyc_level && KYC.Current_kyc_level != undefined && this.state.KYCCheck  ){
      KYCLevel = parseInt(KYC.Current_kyc_level.split('_').pop());
      await saveLocalData("kraKycLevel",KYCLevel);
      await saveLocalData("kraKycStatus",KYC.status);
      this.setState({kraKycLevel:KYCLevel,kraKycStatus:KYC.status,KycValidationError:KYC.validation_desc,KYCCheck :false})
      if(KYC.status){
        this.setState({KYCValidation:true}) // set to true if a KYC already validation exist
      }
    }

    if(payLoad !== undefined) {
      await AsyncStorage.removeItem('auth_token')
      this.props.reqInitLogout();
      const action = NavigationActions.navigate({ routeName: 'Login' });
      this.props.navigation.dispatch(action);
    }
  }

  updateKYCWariningStandard = async () =>{
    await saveLocalData("kycValidationInProgress",false);


    const {PROOF_OF_ID_Exist,PROOF_OF_IBAN_Exist,KYCValidation,kraKycStatus,KycValidationError}=this.state;
    if(!KYCValidation || kraKycStatus == "CANCELLED"){ // if there is no KYC validation demand then docs are missing

      if(PROOF_OF_ID_Exist && !PROOF_OF_IBAN_Exist){
        await saveLocalData("kraKycWarning",i18n.t("myAccount.kycLevelDetailMissingIBAN"));
        this.setState({KYCWarning : i18n.t("myAccount.kycLevelDetailMissingIBAN") })

      }
      else if(!PROOF_OF_ID_Exist && PROOF_OF_IBAN_Exist){
        await saveLocalData("kraKycWarning",i18n.t("myAccount.kycLevelDetailMissingProofOfIdentity"));
        this.setState({KYCWarning : i18n.t("myAccount.kycLevelDetailMissingProofOfIdentity") })

      }    
      else if(!PROOF_OF_ID_Exist && !PROOF_OF_IBAN_Exist){
        await saveLocalData("kraKycWarning",i18n.t("myAccount.kycLevelDetail"));
        this.setState({KYCWarning : i18n.t("myAccount.kycLevelDetail") })
      }
      else{
        await saveLocalData("kraKycWarning",i18n.t("myAccount.kycValidationInProgress"));
        this.setState({KYCWarning : i18n.t("myAccount.kycValidationInProgress") })
      }
    }
    else{
      if(kraKycStatus == "TO_VALIDATE"){
        await saveLocalData("kycValidationInProgress",true);
        await saveLocalData("kraKycWarning",i18n.t("myAccount.kycValidationInProgress"));
        this.setState({KYCWarning : i18n.t("myAccount.kycValidationInProgress") })

      }
      else if(kraKycStatus == "INVALID"){
        await saveLocalData("kraKycWarning",KycValidationError);
        this.setState({KYCWarning : KycValidationError })

      }
      else if(kraKycStatus == "VALID"){
        await saveLocalData("kraKycWarning","");
        this.setState({KYCWarning : "" })

      }
      else{
        await saveLocalData("kraKycWarning",i18n.t("myAccount.kycValidationInProgress"));
        this.setState({KYCWarning : i18n.t("myAccount.kycValidationInProgress") })
      }
    }

  }

  updateKYCWariningBusiness = async () =>{
    await saveLocalData("kycValidationInProgress",false);


    const {KYCValidation,kraKycStatus,KycValidationError}=this.state;
    if(!KYCValidation || kraKycStatus == "CANCELLED"){ // if there is no KYC validation demand then docs are missing

        await saveLocalData("kraKycWarning",i18n.t("myAccount.kycLevelDetailBusiness"));
        this.setState({KYCWarning : i18n.t("myAccount.kycLevelDetailBusiness") })
      
    }
    else{
      if(kraKycStatus == "TO_VALIDATE"){
        await saveLocalData("kycValidationInProgress",true);
        await saveLocalData("kraKycWarning",i18n.t("myAccount.kycValidationInProgress"));
        this.setState({KYCWarning : i18n.t("myAccount.kycValidationInProgress") })

      }
      else if(kraKycStatus == "INVALID"){
        await saveLocalData("kraKycWarning",KycValidationError);
        this.setState({KYCWarning : KycValidationError })

      }
      else if(kraKycStatus == "VALID"){
        await saveLocalData("kraKycWarning","");
        this.setState({KYCWarning : "" })

      }
      else{
        await saveLocalData("kraKycWarning",i18n.t("myAccount.kycValidationInProgress"));
        this.setState({KYCWarning : i18n.t("myAccount.kycValidationInProgress") })
      }
    }

  }

  render() {
    const { myuserIsBusiness, firstName, lastName, email, kraKycLevel,KYCWarning } = this.state;
    let profSecondLine, profThirdLine;
    let companyFirstName, companySecLine, companyThirdLine;
    let bDisplayExplain = false;

    if (myuserIsBusiness) {
      const {
        birthDate,
        userBusiness,
        companyAddress,
        companyPhoneNumber,
        companyInternational
      } = this.state;
      profSecondLine = `${i18n.t("settings.bornOn")} ${birthDate}`;
      profThirdLine = email;
      companyFirstName = userBusiness;
      companySecLine = companyAddress;
      if( this.state.companyPhoneNumber !== null) {
        companyThirdLine = `${companyInternational} ${companyPhoneNumber}`;
      } else {
        companyThirdLine = `${i18n.t("settings.noPhoneNumber")}`
      }

    } else {
      profSecondLine = email;
      profThirdLine = `${this.state.interPhoneNum} ${this.state.myPhoneNum}`;
    }
    if(kraKycLevel < 2) {
      bDisplayExplain = true;
    }

    return (
        <SafeAreaView style={styles.container}>
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
        <WhiteNavHeader title={i18n.t("settings.settings")} />
        <ScrollView>
          {bDisplayExplain &&  
              <Text
              style={[styles.txtDesc, styles.marginSection, styles.marginLR]}
            >
              {KYCWarning}
            </Text>    
            
          }


          <KralissListCell
            style={styles.marginCell}
            sectionTitle={i18n.t("settings.personalInfo")}
            mainTitle={i18n.t("settings.accountNumber")}
            detailContent={this.state.accountNumber}
          />

          <KralissProfileCell
            style={styles.marginCell}
            firstName={firstName}
            lastName={lastName}
            secondInfo={profSecondLine}
            thirdInfo={profThirdLine}
            onSelect={this.onPressProfile}
          />

          {myuserIsBusiness && (
            <KralissProfileCell
              style={styles.marginSection}
              sectionTitle={i18n.t("settings.companyInfo")}
              firstName={companyFirstName}
              lastName={""}
              secondInfo={companySecLine}
              thirdInfo={companyThirdLine}
              onSelect={this.onPressCompanyProfile}
            />
          )}

          <KralissListCell
            style={styles.marginSection}
            sectionTitle={i18n.t("settings.generalInfo")}
            mainTitle={i18n.t("settings.myAccount")}
            subTitle={
              (this.state.kraKycLevel === 3 || this.state.kraKycLevel === 2)
                ? i18n.t("settings.verifiedStatus")
                : i18n.t("settings.unverifiedStatus")
            }
            onSelect={this.onPressMyAccount}
            hasClosure={true}
          />

          <KralissListCell
            mainTitle={i18n.t("settings.myBills")}
            subTitle={i18n.t("settings.finishHistory")}
            hasClosure={true}
            onSelect={this.onPressInvoices}
          />

          <KralissListCell
            mainTitle={i18n.t("settings.notifications")}
            subTitle={i18n.t("settings.settingNotif")}
            hasClosure={true}
            onSelect={this.onPressNotifications}
          />

          <KralissListCell
            style={styles.marginCell}
            sectionTitle={i18n.t("settings.actions")}
            mainTitle={i18n.t("settings.refund")}
            subTitle={i18n.t("settings.removeMoney")}
            hasClosure={true}
            onSelect={this.onPressRefund}
          />
          <KralissListCell
            mainTitle={i18n.t("settings.sponsorship")}
            subTitle={i18n.t("settings.sponsorshipDesc")}
            hasClosure={true}
            onSelect={this.onPressSponsor}
          />
          <KralissListCell
            mainTitle={i18n.t("settings.changePasswd")}
            subTitle={i18n.t("settings.resettingPasswd")}
            hasClosure={true}
            onSelect={this.onPressModifyPasswd}
          />

          <KralissListCell
            style={styles.marginCell}
            mainTitle={i18n.t("settings.helpContact")}
            hasClosure={true}
            onSelect={this.onPressContacts}
          />

          <KralissListCell
            // style={{ marginBottom: 20 }}
            mainTitle={i18n.t("settings.exchgrate")}
            hasClosure={true}
            onSelect={this.onPressExchgRateCGU}
          />

          <KralissListCell
            style={{ marginBottom: 20, marginTop: 12 }}
            mainTitle={i18n.t("settings.logoutTxt")}
            hasClosure={false}
            onSelect={this.onPressLogout}
          />
        </ScrollView>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
  },
  marginCell: {
    marginTop: 12
  },
  marginSection: {
    marginTop: 20
  },
  marginLR: {
    marginLeft: 20,
    marginRight: 20
  },
  txtDesc: {
    color: "#DC143C",
    fontSize: RFPercentage(2.1)
  }
});


const mapStateToProps = state => {
  const { payLoad, loading, error } = state.logoutReducer;
  const { payLoad:KYC } = state.accountsMeReducer;
  const { payLoad:documents } = state.docMeReducer;

  return {
    KYC,
    documents,
    payLoad,
    loading,
    error,
  };
};

const mapDispatchToProps = {
  reqInitLogout,
  reqLogout,
  reqKYCStatus,
  reqGetDocMe,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingView);
