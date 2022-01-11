import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { connect } from "react-redux";
import { Item } from "native-base";
import {RFPercentage} from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../../locale/i18n";

import {reqAddGodsons, reqInitAddGodsons} from '../../../../reducers/addGodsons'

import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";

export default class AddGodsonsView extends Component {
  state = {
    email: ""
  };

  onPressValidate = async  () => {
    let txtEmail = this.state.email;
    // txtEmail = txtEmail.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    await this.props.reqAddGodsons(txtEmail.toLowerCase())
  };

  isDisabled = () => {
    const regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"),'i')@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return !regexEmail.test(this.state.email);
  }

  onChangeInputText = (ev) => {
    this.setState({email: ev.toLowerCase()})
  };

  componentDidUpdate = () => {
      const {payload, error, errorInfo} = this.props;
      if(payload !== null) {
        this.props.reqInitAddGodsons();
        this.props.navigation.navigate("SettingSuccess", {
          title: i18n.t("sponsorship.success"),
          subTitle: i18n.t("sponsorship.successSubtitle"),
          description: "",
          returnNavigate: "Setting"
        });
      }

      if(error !== "" && errorInfo === "This user already has godfather") {
        this.props.reqInitAddGodsons();
        setTimeout(()=> {
          Alert.alert(
            i18n.t('sponsorship.alreadySponsoredTitle'),
            i18n.t('sponsorship.alreadySponsoredDesc'),
          )
        }, 100)
      } else if(error !== "") {
        this.props.reqInitAddGodsons();
        this.props.navigation.navigate("Error");
      }
  }

  render() {
    let buttonEnable = true;
    if (this.state.email.length === 0) buttonEnable = false;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>
        <View style={styles.container}>
          <WhiteNavHeader
            title={i18n.t("sponsorship.addFilleul")}
            onBack={() => {
              this.props.navigation.goBack();
            }}
          />
          <View style={{ paddingLeft: 20, paddingRight: 20, marginTop: 30 }}>
            <Text style={styles.skipDescText}>
              {i18n.t("sponsorship.addFilleulText1")}
            </Text>

            <Item style={styles.item}>
              <TextInput
                ID="email"
                style={styles.textInput}
                placeholderTextColor="#cecece"
                placeholder={i18n.t("sponsorship.addFilleulPlaceholder")}
                value={this.state.email}
                onChangeText={this.onChangeInputText}
              />
            </Item>

            <Text style={styles.skipDescText}>
              {i18n.t("sponsorship.addFilleulText2")}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={
                !this.isDisabled() ? styles.buttonEnabled : styles.buttonDisabled
              }
              onPress={this.onPressValidate}
              disabled={this.isDisabled()}
            >
              <Text style={styles.buttonTitle}>
                {i18n.t("login.validateButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  item: {
    marginTop: 30,
    borderBottomColor: "#cecece"
  },
  skipDescText: {
    marginTop: 30,
    color: "#484848",
    fontSize: RFPercentage(2.0)
  },
  yourIBANText: {
    marginTop: 30,
    color: "#707070",
    fontSize: RFPercentage(2.0)
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#000",
    fontSize: RFPercentage(2.2)
  },
  buttonContainer: {
    height: 60,
    width: "100%",
    position: "absolute",
    bottom: 0
  },
  buttonTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: RFPercentage(2.8)
  },
  buttonEnabled: {
    width: "100%",
    flex: 1,
    backgroundColor: "#00aca9",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonDisabled: {
    width: "100%",
    flex: 1,
    backgroundColor: "#c7eceb",
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  const { payload, loading, error, errorInfo } = state.addGodsonReducer;
  return {
    payload,
    loading,
    error,
    errorInfo
  };
};

const mapDispatchToProps = {
    reqAddGodsons,
    reqInitAddGodsons
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGodsonsView);
