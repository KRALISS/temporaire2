import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import {setPermission} from "../../../reducers/notificationPermissions";
import {reqAccountsMe, reqInitAccountsMe} from "../../../reducers/accountsMe";
import {connect} from "react-redux";
import {checkNotifications, openSettings} from 'react-native-permissions';

export default class NotificationsView extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      notif: true,
      //mail: this.props.payLoad && this.props.payLoad.kra_user.myuser_send_mail
    }
  }
  componentDidMount = async () => {
    this.props.reqAccountsMe();

    checkNotifications().then(({status}) => {
      this.setState({notif: status === "blocked" ? false : true})
    });
  };

  componentDidUpdate(prevProps) {
    if(this.props.payLoad && this.props.payLoad !== prevProps.payLoad) {
      this.setState({mail: this.props.payLoad.kra_user.myuser_send_mail})
    }
    if(this.props.accountsError) {
      this.props.reqInitAccountsMe();
    }
    if(this.props.permissions !== prevProps.permissions) {
      this.setState({mail: !this.state.mail})
    }
  }

  // NOTIFICATION BY PUSH
  onPressNotification = () => {
    const {notif} = this.state;
    let strMsgTitle = i18n.t("notifications.enableMsgTitle");
    let strMsgContent = i18n.t("notifications.enableMsg");
    if (notif) {
      strMsgTitle = i18n.t("notifications.disableMsgTitle");
      strMsgContent = i18n.t("notifications.disableMsg");
    }
    setTimeout(() => {
      Alert.alert(
        strMsgTitle,
        strMsgContent,
        [
          {
            text: i18n.t("notifications.refuse"),
            onPress: () => {}
          },
          {
            text: i18n.t("notifications.ok"),
            onPress: () => {
              this.settingNotification();
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  settingNotification = () => {
    this.setState({notif: !this.state.notif})
    setTimeout(() => {
      openSettings().catch(() => console.warn('cannot open settings'));
    }, 500)
  };

  // NOTIFICATION BY EMAIL
  onPressEmail = () => {
    let strMsgTitle = i18n.t("notifications.enableMailTitle");
    let strMsgContent = i18n.t("notifications.enableMail");
    if (this.props.payLoad.kra_user.myuser_send_mail) {
      strMsgTitle = i18n.t("notifications.disableMailTitle");
      strMsgContent = i18n.t("notifications.disableMail");
    }
    setTimeout(() => {
      Alert.alert(
        strMsgTitle,
        strMsgContent,
        [
          {
            text: i18n.t("notifications.refuse"),
            onPress: () => {}
          },
          {
            text: i18n.t("notifications.ok"),
            onPress: () => this.settingMail()
          }
        ],
        { cancelable: true }
      );
    }, 100);
  }

  settingMail = () => {
    const { kra_user } = this.props.payLoad;
    const emailNotif = kra_user.myuser_send_mail;
    this.props.setPermission({myuser_send_mail: !emailNotif});
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
        <WhiteNavHeader
          title={i18n.t("settings.notifications")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />

        <Text style={[styles.txtDesc, styles.marginSection, styles.marginLR]}>
          {i18n.t("settings.notifications")}
        </Text>
        <View style={styles.contentView}>
          <Text
            style={styles.txtMainTitle}
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {i18n.t("settings.email")}
          </Text>
          <TouchableOpacity
            style={styles.mainTouchable}
            onPress={this.onPressEmail}
          >
            <Image
              source={
                this.state.mail
                  ? require("../../../assets/images/radio_enabled.png")
                  : require("../../../assets/images/radio_disabled.png")
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.contentView}>
          <Text
            style={styles.txtMainTitle}
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {i18n.t("settings.pushNotif")}
          </Text>
          <TouchableOpacity
            style={styles.mainTouchable}
            onPress={this.onPressNotification}
          >
            <Image
              source={
                this.state.notif
                  ? require("../../../assets/images/radio_enabled.png")
                  : require("../../../assets/images/radio_disabled.png")
              }
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const {
    payLoad,
    error: accountsError
  } = state.accountsMeReducer;
  return {
    permissions: state.permissions.payLoad,
    payLoad, 
    accountsError
  };
};

const mapDispatchToProps = {
  setPermission,
  reqAccountsMe,
  reqInitAccountsMe
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsView);


const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1
  },
  contentView: {
    paddingLeft: 20,
    paddingRight: 30,
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white"
  },
  marginSection: {
    marginTop: 20
  },
  marginLR: {
    marginLeft: 20,
    marginRight: 20
  },
  mainTouchable: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  txtMainTitle: {
    flex: 1,
    color: "#484848",
    fontSize: RFPercentage(2.1)
  },
  txtDesc: {
    color: "#acacac",
    fontSize: RFPercentage(2.1)
  }
});
