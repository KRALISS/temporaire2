import React from "react";
import {Image, View} from "react-native";
import {createBottomTabNavigator, createStackNavigator} from "react-navigation";

import i18n from "../../../locale/i18n";

import HomeView from "../home/HomeView";
import PayView from "../home/pay/PayView";
import PayConfirmView from "../home/pay/PayConfirmView";

import SendMoneyView from "../home/sendMoney/SendMoneyView";
import SendConfirmView from "../home/sendMoney/SendConfirmView";
import AskMoneyView from "../home/askMoney/AskMoneyView";
import AskConfirmView from "../home/askMoney/AskConfirmView";
import ConfirmAskView from "../home/askMoney/ConfirmAskView";

import CashEnterView from "../home/cash/CashEnterView";
import QRCodeView from "../home/cash/QRCodeView";
import CashConfirmView from "../home/cash/CashConfirmView";

import BeneficiaryList from "../processBeneficiary/BeneficiaryList";
import AddBeneficiaryView from "../processBeneficiary/AddBeneficiaryView";

import TransHistoryView from "../transHistory/TransHistoryView";
import HistoryDetailView from "../transHistory/HistoryDetailView";

import CreditAccountView from "../creditAccount/CreditAccountView";
import CreditSummaryView from "../creditAccount/CreditSummaryView";
import RefillLoaderView from "../creditAccount/RefillLoaderView";
import OperationSuccessView from "../operationSuccess/OperationSuccessView";
import KralissWebView from "../webView/KralissWebView";
import BankTransferDetail from "../creditAccount/BankTransferDetail";

import SettingView from "../setting/SettingView";
import PersonalInfoView from "../setting/PersonalInfoView";
import IBANInputView from "../setting/IBANInputView";
import RefundEnterView from "../setting/refund/RefundEnterView";
import RefundConfirmView from "../setting/refund/RefundConfirmView";
import RefundIBANView from "../setting/refund/RefundIBANView";
import RefundSuccessView from "../setting/refund/RefundSuccessView";
import RefundErrorView from "../setting/refund/RefundErrorView";
import AccountView from "../setting/account/AccountView";
import DocDetailView from "../setting/account/DocDetailView";
import DeleteMyAccountView from "../setting/account/DeleteMyAccountView";
import DocPreview from "../setting/account/DocPreview";
import NotificationsView from "../setting/NotificationsView";
import InvoicesView from "../setting/InvoicesView";
import ExchangeRateCGUView from "../setting/ExchangeRateCGUView";
import ModifyPasswdView from "../setting/ModifyPasswdView";
import ModifyUserDetailsView from "../setting/ModifyUserDetailsView";

import ContactsView from "../setting/ContactsView";
import SponsorshipSummaryView from '../setting/sponsorship/SponsorshipSummary';
import AddGodsonsView from "../setting/sponsorship/AddGodsonsView"

import PasswdIdentify from "../passwdIndentify/PasswdIdentify";

import ErrorView from "../../../components/errorView/ErrorView"
import MessagesList from "../messagesViews/MessagesList";
import ChatView from "../messagesViews/ChatView";
import NewMessage from "../messagesViews/NewMessage";
import NotificationBadge from "../../../components/notificationBadge/NotificationBadge";
import NotificationsDetails from "../messagesViews/Notifications";


const HomeTab = createStackNavigator(
  {
    Home: {
      screen: HomeView
    },
    PasswdIndentify: {
      screen: PasswdIdentify
    },
    Pay: {
      screen: PayView
    },
    PayConfirm: {
      screen: PayConfirmView
    },
    BeneficiaryList: {
      screen: BeneficiaryList
    },
    AddBeneficiary: {
      screen: AddBeneficiaryView
    },
    AskMoney: { screen: AskMoneyView },
    AskConfirm: { screen: AskConfirmView },
    AskMoneySuccess: { screen: OperationSuccessView },
    ConfirmAsk: { screen: ConfirmAskView },
    SendMoney: {
      screen: SendMoneyView
    },
    SendConfirm: {
      screen: SendConfirmView
    },
    CashEnter: {
      screen: CashEnterView
    },
    QRCodeView: {
      screen: QRCodeView
    },
    CashConfirm: {
      screen: CashConfirmView
    },
    SendSuccess: { screen: OperationSuccessView },
    TransHistory: { screen: TransHistoryView},
    Contact: { screen: ContactsView }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

HomeTab.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (
    routeName === "PasswdIndentify" ||
    routeName === "BeneficiaryList" ||
    routeName === "AddBeneficiary" ||
    routeName === "SendMoney" ||
    routeName === "SendConfirm" ||
    routeName === "SendSuccess" ||
    routeName === "CashEnter" ||
    routeName === "QRCodeView" ||
    routeName === "CashConfirm" ||
    routeName === "Pay" ||
    routeName === "PayConfirm" ||
    routeName === "AskMoney" ||
    routeName === "AskConfirm" ||
    routeName === "AskMoneySuccess" ||
    routeName === "ConfirmAsk"
  ) {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

const CreditAccountTab = createStackNavigator(
  {
    CreditAccount: {
      screen: CreditAccountView
    },
    CreditSummary: {
      screen: CreditSummaryView
    },
    CreditRedirect: {
      screen: KralissWebView
    },
    RefillLoader: {screen: RefillLoaderView},
    RefillSuccess: {screen: OperationSuccessView},
    BankTransferDetail:{
      screen:BankTransferDetail
    }
  },
  {
    initialRouteName: "CreditAccount",
    headerMode: "none"
  }
);

CreditAccountTab.navigationOptions = ({ navigation }) => {
  let {routeName} = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (
    routeName === "CreditSummary" ||
    routeName === "CreditRedirect" ||
    routeName === "RefillLoader" ||
    routeName === "BankTransferDetail" ||
    routeName === "RefillSuccess"
  ) {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

const TransHistoryTab = createStackNavigator(
  {
    TransHistory: {
      screen: TransHistoryView
    },
    HistoryDetail: {
      screen: HistoryDetailView
    }
  },
  {
    initialRouteName: "TransHistory",
    headerMode: "none"
  }
);

TransHistoryTab.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === "HistoryDetail") {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

const MessagesTab = createStackNavigator(
  {
    MessagesList: {
      screen: MessagesList
    },
    ChatView: {
      screen: ChatView
    },
    NewMessage: {
      screen: NewMessage
    },
    TransHistory: {
      screen: TransHistoryView
    },
    NotificationsDetails: {
      screen: NotificationsDetails
    }
  },
  {
    initialRouteName: "MessagesList",
    headerMode: "none"
  }
);

MessagesTab.navigationOptions = ({ navigation }) => {
  let {routeName} = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === "NewMessage" || routeName=== "ChatView") {//TODO: should optimize after added messages screens
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

const SettingTab = createStackNavigator(
  {
    Setting: {
      screen: SettingView
    },
    MyAccount: {
      screen: AccountView
    },
    DeleteMyAccount: {
      screen: DeleteMyAccountView
    },
    DocDetail: {
      screen: DocDetailView
    },
    DocPreview: {
      screen: DocPreview
    },
    PersonalInfo: { screen: PersonalInfoView },
    IBANInput: { screen: IBANInputView },
    RefundEnter: { screen: RefundEnterView },
    RefundConfirm: { screen: RefundConfirmView },
    RefundIBAN: { screen: RefundIBANView },
    RefundSuccess: { screen: RefundSuccessView },
    RefundError: { screen: RefundErrorView },
    Notifications: { screen: NotificationsView },
    Invoices: { screen: InvoicesView },
    ModifyPasswd: { screen: ModifyPasswdView },
    ModifyUserDetails: { screen: ModifyUserDetailsView },
    ExchangeRateCGU: { screen: ExchangeRateCGUView },
    Contacts: { screen: ContactsView },
    SettingSuccess: { screen: OperationSuccessView },
    SponsorshipSummary: { screen: SponsorshipSummaryView},
    AddGodsons: { screen: AddGodsonsView},
    Error: {screen: ErrorView},
  },
  {
    initialRouteName: "Setting",
    headerMode: "none"
  }
);

SettingTab.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (
    routeName === "IBANInput" ||
    routeName === "RefundEnter" ||
    routeName === "RefundConfirm" ||
    routeName === "RefundIBAN" ||
    routeName === "RefundError" ||
    routeName === "RefundSuccess" ||
    routeName === "DeleteMyAccount" ||
    routeName === "DocDetail" ||
    routeName === "DocPreview" ||
    routeName === "Notifications" ||
    routeName === "Invoices" ||
    routeName === "ExchangeRateCGU" ||
    routeName === "ModifyPasswd" ||
    routeName === "Contacts" ||
    routeName === "SettingSuccess" ||
    routeName === "SponsorshipSummary" ||
    routeName === "AddGodsons"
  ) {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

export default createBottomTabNavigator(
  {
    [i18n.t("tab.home")]: HomeTab,
    [i18n.t("tab.history")]: TransHistoryTab,
    [i18n.t("tab.message")]: MessagesTab,
    [i18n.t("tab.refill")]: CreditAccountTab,
    [i18n.t("tab.settings")]: SettingTab
  },
  {
    //CUSTOM CONFIG
    initialRouteName: i18n.t("tab.home"),
    defaultNavigationOptions: ({ navigation }) => {return {
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        let iconSource;
        if (routeName === i18n.t("tab.home")) {
          iconSource = focused
            ? require("../../../assets/images/home_green.png")
            : require("../../../assets/images/home_icon.png");
        } else if (routeName === i18n.t("tab.refill")) {
          iconSource = focused
            ? require("../../../assets/images/credit_account_green.png")
            : require("../../../assets/images/credit_account_grey.png");
        }else if (routeName === i18n.t("tab.message")) {
          iconSource = focused
            ? require("../../../assets/images/tabbar_messages_green.png")
            : require("../../../assets/images/tabbar_messages.png");
        }else if (routeName === i18n.t("tab.history")) {
          iconSource = focused
            ? require("../../../assets/images/transaction_history_green.png")
            : require("../../../assets/images/transaction_history_grey.png");
        } else if (routeName === i18n.t("tab.settings")) {
          iconSource = focused
            ? require("../../../assets/images/settings_green.png")
            : require("../../../assets/images/settings_grey.png");
        }

        let style = {
          width: "85%",
          height: "80%",
          backgroundColor: focused ? "#c7eceb" : "#fff",
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center"
        };
        return (
          <View style={style}>
            {routeName === i18n.t("tab.message") &&
            <NotificationBadge/>
            }
            <Image source={iconSource} />
          </View>
        );
      }
    }},
    tabBarOptions: {
      activeTintColor: "#00ACA9",
      inactiveTintColor: "#777",
      style: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderRadius: 0,
        borderTopColor: "#eee"
      },
      //do not display icon label
      showLabel: true,
      showIcon: true
    }
  }
);

//c7eceb
