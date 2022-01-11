import React, { Component } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput
} from "react-native";
import { connect } from "react-redux";

import Loader from "../../../components/loader/Loader";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissRectButton from "../../../components/kralissButton/KralissRectButton";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import {RFPercentage} from "react-native-responsive-fontsize";
import RoundRectView from "../../../components/gradientView/RoundRectView";
import { reqContacts } from "../../../reducers/contacts";

export default class ContactsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      txtSubject: "",
      txtMsg: ""
    };
  }

  onPressSend = async() => {
    fullName = await loadLocalData("firstName")+" "+ await loadLocalData("lastName");
    email = await loadLocalData("email");

    this.props.reqContacts({
      receiverType: "Technique",
      fullName: fullName,
      email: email,
      object: this.state.txtSubject,
      message: this.state.txtMsg
    });
  };

  onChgInputText = (id, text) => {
    var _stateObj = {};
    _stateObj[id] = text;
    this.setState(_stateObj);
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { payLoad, error } = this.props;
    if (payLoad !== undefined && prevProps.payLoad != payLoad) {
      this.props.navigation.navigate("SendSuccess", {
        title: i18n.t("contacts.succContactTitle"),
        subTitle: i18n.t("contacts.succContactSubTitle"),
        description: "",
        returnNavigate: "Home"
      });
    }
    if (error !== undefined && this.props.error.length > 0) {
      this.showErrorAlert(this.props.error);
    }
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("beneficiary.fault"),
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
  /**/
  render() {
    const { txtSubject, txtMsg } = this.state;
    let buttonEnabled = false;
    if (txtSubject.length > 0 && txtMsg.length > 0) {
      buttonEnabled = true;
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>
        <SafeAreaView style={styles.container}>
          <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
          <WhiteNavHeader
            title={i18n.t("settings.helpContact")}
            onBack={() => this.props.navigation.goBack()}
          />

          <ScrollView style={styles.textContainer}>
            <Text style={styles.sectionText}>
              {i18n.t("contacts.description")}
            </Text>

            <Text style={styles.txtSectionTitle}>
              {i18n.t("contacts.subject")}
            </Text>
            <RoundRectView style={{ marginTop: 10, padding: 15 }}>
              <TextInput
                maxLength={256}
                placeholderTextColor="#cecece"
                placeholder={i18n.t("contacts.subjectPlaceHolder")}
                onChangeText={text => this.onChgInputText("txtSubject", text)}
              />
            </RoundRectView>

            <Text style={styles.txtSectionTitle}>{i18n.t("contacts.msg")}</Text>
            <RoundRectView style={{ marginTop: 10, padding: 15 }}>
              <TextInput
                style={{
                  height: 150,
                  textAlignVertical: "top",
                  fontSize:RFPercentage(1.6)
                }}
                maxLength={4096}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor="#cecece"
                placeholder={i18n.t("contacts.msgPlaceHolder")}
                onChangeText={text => this.onChgInputText("txtMsg", text)}
              />
            </RoundRectView>
            <Text style={styles.txtSectionTitle}>
              {i18n.t("contacts.requiredField")}
            </Text>
          </ScrollView>

          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressSend}
            title={i18n.t("contacts.send")}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end"
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  sectionText: {
    marginTop: 20,
    color: "#484848",
    fontSize: RFPercentage(2.0)
  },
  txtSectionTitle: {
    color: "#484848",
    fontSize: RFPercentage(2.0),
    marginTop: 30
  },
  marginCell: {
    marginTop: 10
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.contactsReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqContacts
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsView);
