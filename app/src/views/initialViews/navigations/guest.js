import { createStackNavigator } from "react-navigation";
import LoginView from "../login/LoginView";
import LoginView2 from "../login/LoginView2";
import SignupView from "../signup/SignupView";
import ForgotPasswdView from "../forgotPasswd/ForgotPasswdView";
import ConfirmEmailSentView from "../confimEmailSent/ConfirmEmailSentView";
import ResetPasswdView from "../resetPasswd/ResetPasswdView";
import RenewPasswdView from "../renewPasswd/RenewPasswdView";
import ErrorView from "../../../components/errorView/ErrorView";
import TunnelWelcomeView from "../tunnel/TunnelWelcomeView";
import TunnelEnterprise2View from "../tunnel/enterprise/TunnelEnterprise2View";
import TunnelEnterprise3View from "../tunnel/enterprise/TunnelEnterprise3View";
import TunnelPersonalInfoView from "../tunnel/TunnelPersonalInfoView";
import TunnelParticular2View from "../tunnel/particular/TunnelParticular2View";
import ConfirmSuccessView from "../../confirmSuccess/ConfirmSuccessView";

export default createStackNavigator(
  {
    Login: {
      screen: LoginView2
    },
    SignupView: {
      screen: SignupView
    },
    ForgotPasswd: {
      screen: ForgotPasswdView
    },
    ConfirmEmailSent: {
      screen: ConfirmEmailSentView
    },
    ResetPasswd: {
      screen: ResetPasswdView
    },
    RenewPasswd: {
      screen: RenewPasswdView
    },
    ErrorView: {
      screen: ErrorView
    },
    TunnelWelcomeView: {
      screen: TunnelWelcomeView
    },
    TunnelEnterprise2View: {
      screen: TunnelEnterprise2View
    },
    TunnelEnterprise3View: {
      screen: TunnelEnterprise3View
    },
    TunnelPersonalInfoView: {
      screen: TunnelPersonalInfoView
    },
    TunnelParticular2View: {
      screen: TunnelParticular2View
    },
    ConfirmSuccessView: {
      screen: ConfirmSuccessView
    }
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);
