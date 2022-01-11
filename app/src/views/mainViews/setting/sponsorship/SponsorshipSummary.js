import React, { Component } from "react";
import { StyleSheet, ScrollView, Text, View, Image, Alert,SafeAreaView } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import KralissListCell from "../../../../components/kralissListCell/KralissListCell";
import i18n from "../../../../locale/i18n";
import { connect } from "react-redux";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";

import {
  reqInitAccountsMe,
  reqAccountsMe
} from "../../../../reducers/accountsMe";
import {
  reqSponsorMonthSummary, initSponsorMonthSummary
} from "../../../../reducers/sponsorMonthSummary";

import KralissButton from "../../../../components/kralissButton/KralissButton";
import Loader from "../../../../components/loader/Loader"
import { kraliss_account } from "../../../../utils/config";

class SponsorshipSummaryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nbOfFilleul: 0,
      gains: "0",
      gainsKraliss: "",
      haveASponsor: false,
      sponsor: {
        name: "",
        email: "",
        accountNumber: ""
      },
      godsons: [],
      stopper: false
    };
  }

  componentDidMount = async () => {
    this.props.reqAccountsMe()
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const { payLoad, payLoadSponsorEmail, errorSponsorEmail } = this.props;
    const { stopper } = this.state;
    // GET THE INFO FOR THE PAGE
    if (payLoad !== undefined && stopper === false) {
      this.setState({stopper: true})
      const user = payLoad.kra_user;
      // Nb of godson
      const numberOfFilleul = user.myuser_godsons.length;
      this.setState({ nbOfFilleul: numberOfFilleul });

      // Gains
      let gains = 0;
      if (user.rewards_by_godsons.length > 0) {
        const godsons = user.rewards_by_godsons;
        for (let i = 0; i < godsons.length; i++) {
          gains = gains + godsons[i].amount;
        }
      }
      const gainFormated = `${(gains * user.myuser_international.international_conversion_rate).toFixed(2)} ${
        user.myuser_international.international_devise_iso_code
      }`;
      this.setState({ gains: gainFormated });

      const gainsKraliss = gains
      this.setState({ gainsKraliss });

      // Godfather
      if (user.myuser_godfather !== null) {
        let name =
          user.myuser_godfather.first_name +
          " " +
          user.myuser_godfather.last_name;
        // let email = user.myuser_godfather.username;
        let accountNumber = user.myuser_godfather.kra_account_number;
        if(accountNumber === kraliss_account) {
          name = "KRALISS";
          // email = "KRALISS";
          accountNumber = "KRALISS";
        }
        this.setState({
          haveASponsor: true,
          sponsor: { name, /*email, */accountNumber }
        });
      }

      // Godsons
      if (user.rewards_by_godsons.length > 0) {
        const godsons = user.rewards_by_godsons;
        let godsonsArray = [];
        for (let i = 0; i < godsons.length; i++) {
          const amount = `${(godsons[i].amount * user.myuser_international.international_conversion_rate).toFixed(2)} ${
            user.myuser_international.international_devise_iso_code
          }`;
          const amountFormated =
            godsons[i].amount;

          const email = godsons[i].username;
          const info = user.myuser_godsons.find(el => el.username === email);
          const godson = {
            username: info.first_name + " " + info.last_name,
            amountFormated: amountFormated,
            amount: amount
          };
          godsonsArray.push(godson);
        }
        this.setState({ godsons: godsonsArray });
      }

      this.props.reqInitAccountsMe();
    }

    // SEND SUMMARY
    if(payLoadSponsorEmail !== null) {
      this.props.initSponsorMonthSummary();
      setTimeout(()=> {
        Alert.alert(
          i18n.t('sponsorship.summarySentConfirmTitle'),
          i18n.t('sponsorship.summarySentConfirmDesc'),
        )
      }, 500)
    }
    if(errorSponsorEmail !== null) {
      this.props.initSponsorMonthSummary();
      setTimeout(()=> {
        Alert.alert(
          i18n.t('sponsorship.summarySentErrorTitle'),
          i18n.t('sponsorship.summarySentErrorDesc'),
        )
      }, 500)
    }
  };

  onPressAddFilleul = () => {
    this.props.navigation.navigate("AddGodsons")
  }

  onPressSendSummary = () => {

    const {nbOfFilleul, gainsKraliss} = this.state;
    if(nbOfFilleul > 0 && gainsKraliss > 0) {

      this.props.reqSponsorMonthSummary();
    }
    if(nbOfFilleul === 0) {
      setTimeout(()=> {
        Alert.alert(
          i18n.t('sponsorship.summaryNoGodsonTitle'),
          i18n.t('sponsorship.summaryNoGodsonDesc'),
        )
      }, 500)
    }
    if(gainsKraliss === 0 && nbOfFilleul > 0) {
      setTimeout(()=> {
        Alert.alert(
          i18n.t('sponsorship.summaryNomoneyGainTitle'),
          i18n.t('sponsorship.summaryNomoneyGainDesc'),
        )
      }, 500)
    }
  }

  render() {
    const { godsons } = this.state;
    return (
        <SafeAreaView style={styles.container}>
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>

        <WhiteNavHeader
          title={i18n.t("settings.sponsorship")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <ScrollView>
          <KralissListCell
            style={styles.marginCell}
            sectionTitle={i18n.t("sponsorship.summary")}
            mainTitle={i18n.t("sponsorship.numberOfFillieul")}
            detailContent={this.state.nbOfFilleul}
          />
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              backgroundColor: "#fff",
              paddingLeft: 10
            }}
          >
            <View
              style={{
                flex: 1.5,
                marginLeft: 10,
                marginTop: 10,
                marginBottom: 20
              }}
            >
              <Text style={customStyles.rowMainTitle}>
                {i18n.t("sponsorship.gains")}
              </Text>
              <Text style={customStyles.rowSubTitle}>{}</Text>
            </View>
            <View
              style={{
                flex: 1,
                marginLeft: 10,
                alignItems: "flex-end",
                marginRight: 20
              }}
            >
              <Text style={{ marginTop: 20, color: "#484848" }}>
                {this.state.gains}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={customStyles.rowSubTitle}>
                  {Number(this.state.gainsKraliss).toFixed(2)}
                </Text>
                <Image
                  style={{ marginLeft: 5, marginTop: 5 }}
                  source={require("../../../../assets/images/kraliss_logo_grey.png")}
                />
              </View>
            </View>
          </View>
          <View style={{marginLeft: 20, marginRight:20}}>
            <KralissButton
              style={styles.deleteBtn}
              onPress={this.onPressSendSummary}
              title={i18n.t("sponsorship.summarySend")}
              enabled={true}
            />
            </View>
          <KralissListCell
            style={styles.marginCell}
            sectionTitle={i18n.t("sponsorship.yourSponsor")}
            mainTitle={i18n.t("sponsorship.name")}
            detailContent={this.state.sponsor.name}
          />
          {/* <KralissListCell
            mainTitle={i18n.t("sponsorship.email")}
            detailContent={this.state.sponsor.email}
          /> */}
          <KralissListCell
            // style={{ marginTop: -20 }}
            mainTitle={i18n.t("sponsorship.accountNumber")}
            detailContent={this.state.sponsor.accountNumber}
          />
            <View style={{marginLeft: 20, marginRight:20}}>
            <KralissButton
              style={styles.deleteBtn}
              onPress={this.onPressAddFilleul}
              title={i18n.t("sponsorship.addFilleul")}
              enabled={true}
            />
            </View>

          <Text style={styles.headerSection}>
            {i18n.t("sponsorship.filleuils")}
          </Text>
          {godsons.length > 0 &&
            godsons.map((godson, index) => (
              <View key={index}>
                <KralissListCell
                  style={styles.marginCell}
                  mainTitle={`${i18n.t("sponsorship.filleulTitle")}${index +
                    1}`}
                  detailContent={godson.username}
                />
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    backgroundColor: "#fff",
                    paddingLeft: 10
                  }}
                >
                  <View
                    style={{
                      flex: 1.5,
                      marginLeft: 10,
                      marginTop: 10,
                      marginBottom: 20
                    }}
                  >
                    <Text style={customStyles.rowMainTitle}>
                      {i18n.t("sponsorship.gains")}
                    </Text>
                    <Text style={customStyles.rowSubTitle}>{}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      alignItems: "flex-end",
                      marginRight: 20
                    }}
                  >
                    <Text style={{ marginTop: 20, color: "#484848" }}>
                      {godson.amount}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={customStyles.rowSubTitle}>
                        {Number(godson.amountFormated).toFixed(2)}
                      </Text>
                      <Image
                        style={{ marginLeft: 5, marginTop: 5 }}
                        source={require("../../../../assets/images/kraliss_logo_grey.png")}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
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
    marginTop: 12,
    marginBottom: -20
  },
  marginSection: {
    marginTop: 20
  },
  headerSection: {
    marginTop: 25,
    marginLeft: 25,
    marginBottom: 12,
    color: "#ACACAC"
  },
  deleteBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20,
  },
});

const customStyles = StyleSheet.create({
  rowMainTitle: {
    color: "#484848",
    fontSize: RFPercentage(2.1),
    marginTop: 5
  },
  rowSubTitle: {
    fontSize: RFPercentage(2.0),
    marginTop: 5,
    color: "#acacac"
  }
});

const mapStateToProps = state => {
  const { loading, payLoad, error } = state.accountsMeReducer;
  const { loading: loadingSponsorEmail, payLoad: payLoadSponsorEmail, error: errorSponsorEmail} = state.sponsorMonthSummaryReducer;
  return {
    loading,
    payLoad,
    error,
    loadingSponsorEmail,
    payLoadSponsorEmail,
    errorSponsorEmail
  };
};

const mapDispatchToProps = {
  reqAccountsMe,
  reqInitAccountsMe,
  reqSponsorMonthSummary,
  initSponsorMonthSummary
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SponsorshipSummaryView);
