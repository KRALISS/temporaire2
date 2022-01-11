import React, { Component } from "react";
import { StyleSheet, ScrollView, Text, View, Alert,SafeAreaView } from "react-native";
import { connect } from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import KralissListCell from "../../../../components/kralissListCell/KralissListCell";
import i18n from "../../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import { reqInitDocMe, reqGetDocMe } from "../../../../reducers/documents";
import Loader from "../../../../components/loader/Loader";
import {
  getStatusText,
  getDocTitleText
} from "../../../../utils/accountInfoUtil";

export default class AccountView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kraKycLevel: 0,
      proofHostID: null,
      proofHostHosting: null,
      proofHostAddress: null,
      proofAddress: null,
      proofIBAN: null,
      proofID: null,
      proofSecondID: null,
      proofCompany: null,
      IBAN: ""
    };
  }

  onPressIBAN = () => {
    this.props.navigation.navigate("IBANInput");
  };

  onPressDocumentItem = (docItem, type,typeNum) => {
    this.props.navigation.navigate("DocDetail", { docItem, type,typeNum });
  };

  onPressDeleteAccount = () => {
    this.props.navigation.navigate("DeleteMyAccount", {
      kraKycLevel: this.state.kraKycLevel
    });
  };

  componentDidMount = async () => {
    this.props.navigation.addListener("willFocus", async route => {
      this.props.reqGetDocMe(2);//Docs with files
      KYCWarning = await loadLocalData("kraKycWarning");   
      kraKycLevel = await loadLocalData("kraKycLevel");
      const myuserIsBusiness = await loadLocalData("myuserIsBusiness");
      if (kraKycLevel === null) kraKycLevel = 0; 
      this.setState({
        kraKycLevel,
        myuserIsBusiness,
        KYCWarning
      });
    });

    const IBAN = await loadLocalData("kraIban");
    this.setState({IBAN})
  };

  componentDidUpdate = (prevProps, prevState) => {
    let { payLoad, error } = this.props;


    if ( payLoad && payLoad !== undefined ) {

      this.props.reqInitDocMe();

      let proofHostID = null,
        proofHostHosting = null,
        proofHostAddress = null,
        proofAddress = null,
        proofIBAN = null,
        proofID = null,
        proofSecondID = null,
        proofCompany = null;

      for (let i = 0; i < payLoad.length; i++) {
        const item = payLoad[i];
        if (item.type === "PROOF_OF_REGISTRATION") //PROOF_OF_REGISTRATION
          proofCompany = item;
        if (item.type === "PROOF_OF_HOST_ID") { //PROOF_OF_HOST_ID
          proofHostID = item;
        }
        if (item.type === "PROOF_OF_HOST_HOSTING") { //PROOF_OF_HOST_HOSTING
          proofHostHosting = item;
        }
        if (item.type === "PROOF_OF_HOST_ADDRESS") {
          proofHostAddress = item;
        }
        if (item.type === "PROOF_OF_ADDRESS") { //PROOF_OF_ADDRESS
          proofAddress = item;
        }
        if (item.type === "PROOF_OF_IBAN") { //PROOF_OF_IBAN
          proofIBAN = item;
        }
        if (item.type === "PROOF_OF_ID") { //PROOF_OF_ID
          proofID = item;
        }
        if (item.type === "/api/type_ressources/16") { //PROOF_OF_ID_SECONDARY
          proofSecondID = item;
        }
      }

      this.setState({
        proofHostID,
        proofHostHosting,
        proofHostAddress,
        proofAddress,
        proofIBAN,
        proofID,
        proofSecondID,
        proofCompany
      });
    }
    if (error !== undefined && error & error.length > 0 ) {
      this.props.reqInitDocMe();
      this.showErrorAlert(error);
    }
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        "",
        errorMsg,
        [
          {
            text: i18n.t("passwdIdentify.return"),
            onPress: () => {}
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  render() {
    let accountStatus,
      status,
      bDisplayExplain = false;
    const {
      proofHostID,
      proofHostHosting,
      proofHostAddress,
      proofAddress,
      proofIBAN,
      proofID,
      proofSecondID,
      proofCompany,
      kraKycLevel,
      KYCWarning
    } = this.state;

    if (kraKycLevel < 2) {
      accountStatus = i18n.t("myAccount.basicUse");
      status = i18n.t("myAccount.notVerified");
      bDisplayExplain = true;
    } else {
      accountStatus = i18n.t("myAccount.unlimituse");
      status = i18n.t("myAccount.verified");
    }
    const { title: prCompanyTxt, showIcon: prCompanyIcon } = getStatusText(
      proofCompany
    );
    const { title: prIDTxt, showIcon: prIDIcon } = getStatusText(proofID);
    const { title: prID2Txt, showIcon: prID2Icon } = getStatusText(proofSecondID);
    const { title: prAddrTxt, showIcon: prAddrIcon } = getStatusText(
      proofAddress
    );
    const { title: prIBANTxt, showIcon: prIBANIcon } = getStatusText(proofIBAN);
    const { title: prHostIDTxt, showIcon: prHostIDIcon } = getStatusText(
      proofHostID
    );
    const {
      title: prHostHostingTxt,
      showIcon: prHostHostingIcon
    } = getStatusText(proofHostHosting);
    const { title: prHostAddrTxt, showIcon: prHostAddrIcon } = getStatusText(
      proofHostAddress
    );

    return (
        <SafeAreaView style={styles.container}>
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
        <WhiteNavHeader
          title={i18n.t("settings.myAccount")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <ScrollView>
          <KralissListCell
            style={styles.marginCell}
            mainTitle={i18n.t("myAccount.accountStatus")}
            detailContent={accountStatus}
            noBottomPadding={true}
          />
          <KralissListCell
            mainTitle={i18n.t("myAccount.status")}
            detailContent={status}
          />

          {bDisplayExplain && (
              <Text
              style={[styles.txtDesc, styles.marginSection, styles.marginLR]}
            >
              {KYCWarning}
            </Text>   
          )}
          {this.state.myuserIsBusiness === true && (
            <KralissListCell
              style={styles.marginSection}
              mainTitle={getDocTitleText("PROOF_OF_REGISTRATION")}
              subTitle={prCompanyTxt}
              showSubTitleIcon={prCompanyIcon}
              hasClosure={true}
              onSelect={() =>
                this.onPressDocumentItem(proofCompany, "PROOF_OF_REGISTRATION",16)
              }
            />
          )}

          <KralissListCell
            style={
              this.state.myuserIsBusiness === true ? null : styles.marginSection
            }
            mainTitle={getDocTitleText("PROOF_OF_ID")}
            subTitle={prIDTxt}
            showSubTitleIcon={prIDIcon}
            hasClosure={true}
            onSelect={() => this.onPressDocumentItem(proofID, "PROOF_OF_ID",1)}
          />
          {
            this.state.myuserIsBusiness === true && 
            <KralissListCell
              mainTitle={getDocTitleText("PROOF_OF_ID_SECONDARY")}
              subTitle={prID2Txt}
              showSubTitleIcon={prID2Icon}
              hasClosure={true}
              onSelect={() => this.onPressDocumentItem(proofSecondID, "PROOF_OF_ID_SECONDARY",16)}
            />
          }
          {this.state.myuserIsBusiness === true && (
            <KralissListCell
              mainTitle={getDocTitleText("PROOF_OF_ADDRESS")}
              subTitle={prAddrTxt}
              showSubTitleIcon={prAddrIcon}
              hasClosure={true}
              onSelect={() =>
                this.onPressDocumentItem(proofAddress, "PROOF_OF_ADDRESS",13)
              }
            />
          )}
          <KralissListCell
            mainTitle={getDocTitleText("PROOF_OF_IBAN")}
            subTitle={prIBANTxt}
            showSubTitleIcon={prIBANIcon}
            hasClosure={true}
            onSelect={() =>
              this.onPressDocumentItem(proofIBAN, "PROOF_OF_IBAN",14)
            }
          />

          <KralissListCell
            style={styles.marginSection}
            sectionTitle={i18n.t("myAccount.livePrivateHome")}
            mainTitle={getDocTitleText("PROOF_OF_HOST_ID")}
            subTitle={prHostIDTxt}
            showSubTitleIcon={prHostIDIcon}
            showSubTitleIcon={prIDIcon}
            hasClosure={true}
            onSelect={() =>
              this.onPressDocumentItem(proofHostID, "PROOF_OF_HOST_ID",11)
            }
          />
          <KralissListCell
            mainTitle={getDocTitleText("PROOF_OF_HOST_HOSTING")}
            subTitle={prHostHostingTxt}
            showSubTitleIcon={prHostHostingIcon}
            hasClosure={true}
            onSelect={() =>
              this.onPressDocumentItem(
                proofHostHosting,
                "PROOF_OF_HOST_HOSTING",
                12
              )
            }
          />
          <KralissListCell
            mainTitle={getDocTitleText("PROOF_OF_HOST_ADDRESS")}
            subTitle={prHostAddrTxt}
            showSubTitleIcon={prHostAddrIcon}
            hasClosure={true}
            isLeftMenu={true}
            onSelect={() =>
              this.onPressDocumentItem(
                proofHostAddress,
                "PROOF_OF_HOST_ADDRESS"
              )
            }
          />

          <KralissListCell
            style={styles.marginSection}
            mainTitle={i18n.t("myAccount.deleteAccount")}
            subTitle={i18n.t("myAccount.permaDeleteAccount")}
            hasClosure={true}
            isLeftMenu={true}
            onSelect={this.onPressDeleteAccount}
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
    flex: 1
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
  const { payLoad, loading, error } = state.docMeReducer;
  return {
    payLoad,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqInitDocMe,
  reqGetDocMe
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountView);
