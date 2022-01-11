/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  Linking,
  StyleSheet,
  StatusBar,
  Text,
  View,
  PushNotificationIOS,
  AppState
} from "react-native";
import { Root } from "native-base";
import GradientView from "../../components/gradientView/GradientView";
import GuestNavigation from "../initialViews/navigations/guest";
import MainTabNavigator from "../mainViews/navigations/mainTab";
import { createAppContainer, createSwitchNavigator, NavigationActions } from "react-navigation";
var PushNotification = require("react-native-push-notification");
import { connect } from "react-redux";
import { reqPushProcess } from "../../reducers/pushProcess";
import { getExchanges } from "../../reducers/exchanges"
import { savePushData, saveLocalData } from "../../utils/localStorage";
import { innactivityTime } from '../../utils/config'
import OfflineNotice from "../../components/offlineNotice/OfflineNotice";

const MainNavigator = createAppContainer(createSwitchNavigator(
  {
    Guest: { screen: GuestNavigation },
    Main: { screen: MainTabNavigator }
  },
  {
    initialRouteName: "Guest",
    headerMode: "none"
  }
));

const exceptionRoute = [
  "Login",
  "SignupView",
  "ForgotPasswd",
  "ConfirmEmailSent",
  "ResetPasswd",
  "RenewPasswd",
  "ErrorView",
  "TunnelWelcomeView",
  "TunnelEnterprise2View",
  "TunnelEnterprise3View",
  "TunnelPersonalInfoView",
  "TunnelParticular2View",
  "ConfirmSuccessView",
  "RefillLoader",
  "CreditRedirect"
];

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    // this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  Navigator = null;
  Timeout = null;

  onRegister = async token => {
    saveLocalData("token", token.token);
  };

  onNotification = notification => {
    let data;
    if(Platform.OS === 'ios') {
       data = notification.data;
    } else {
      data = notification
    }
    // process the notification
    savePushData(data);
    this.props.reqPushProcess();
    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  };

  initPushNotification = () => {
    //console.log("Token:");
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: this.onRegister,

      // (required) Called when a remote or local notification is opened or received
      onNotification: this.onNotification,

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: "1028185588291",

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  };

  componentDidMount = () => {
    // AppState.addEventListener('change', this.handleAppStateChange); //  test notification
    this.initPushNotification();
    this.resetTimeout();
    setTimeout(() => {
      PushNotification.createChannel(
        {
          channelId: "myApp-channel-id", // (required)
          channelName: "myApp-channel", // (required)
          channelDescription: "A custom channel to categorise myApp notifications", // (optional) default: undefined.
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );
      PushNotification.getChannels(function (channel_ids) {
        console.log('les channels :', channel_ids); // ['channel_id_1']
      });
    }, 1000)
  };

  componentWillUnmount = () => {
    // AppState.removeEventListener('change', this.handleAppStateChange);  //  test notification
  }

  // handleAppStateChange = (appState) => {
  //   if (appState === 'background') {
  //     let date = new Date(Date.now() + 5000);

  //     if (Platform.OS === 'ios') {
  //       date = date.toISOString();
  //     }

  //     PushNotification.localNotificationSchedule({
  //       message: "My Notification Message",
  //       date,
  //     });
  //   }
  // }
  componentDidUpdate = () => {

  }

  resetTimeout = () => {
    if(this.Timeout) clearTimeout(this.Timeout);
    this.Timeout = setTimeout(() => {
      const action = NavigationActions.navigate({ routeName: 'Login' });
      if(this.Navigator) this.Navigator.dispatch(action);
    }, innactivityTime);
  }

  getRouteName = (nav) => {
    if(!nav) return null
    const route = nav.routes[nav.index];
    if(route.routes) return this.getRouteName(route)
    return route.routeName;
  }

  render() {
    console.disableYellowBox = true;
    return (
      <Root onTouchStart={(e) => {
        if(e.nativeEvent) this.resetTimeout();
      }}>
          <OfflineNotice/>
          <StatusBar barStyle="light-content" />
          <MainNavigator
            ref = {(nav) => this.Navigator = nav}
            onNavigationStateChange={(prevState, currentState) => {
              const current = this.getRouteName(currentState);
              const prev = this.getRouteName(prevState);
              const isExceptionRoute = exceptionRoute.includes(current);
              if(prev !== current && !isExceptionRoute) this.props.getExchanges(1,10)
            }}
          />
          <OfflineNotice/>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.deviceApnsReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqPushProcess,
  getExchanges
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
