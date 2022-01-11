import {combineReducers} from "redux";
import loginReducer from "./login";
import forgotPasswdReducer from "./forgotPasswd";
import signupReducer from "./signup";
import internationalsReducer from "./internationals";
import companyActivitiesReducer from "./companyActivities";
import patchInterReducer, {postBenefReducer} from "./patchMyUsers";
import accountsMeReducer from "./accountsMe";
import confirmPasswdReducer from "./confirmPasswd";
import rechargesReducer from "./recharges";
import refillsReducer, {refillsMeReducer} from "./refills";
import sentKralissReducer from "./sentKraliss";
import postQRCodesReducer, {useQRCodeReducer} from "./qrCodes";
import sentQRStatusReducer from "./qrStatus";
import refundsReducer from "./refunds";
import lastTransactionReducer from "./lastTransaction";
import docMeReducer from "./documents";
import authPasswdReducer from "./authPasswd";
import contactsReducer from "./contacts";
import receiveKralissReducer, {confirmAskReducer} from "./receiveKraliss";
import deviceApnsReducer from "./device";
import pushProcessReducer from "./pushProcess";
import addGodsonReducer from "./addGodsons";
import resetPasswdReducer from "./resetPasswd";
import confirmAccountReducer from "./confirmAccount"
import confirmGodfatherReducer from "./confirmGodfather";
import sponsorMonthSummaryReducer from "./sponsorMonthSummary";
import logoutReducer from "./logout";
import sendInvoiceReducer from "./sendInvoice";
import activationReducer from './resendEmailActivation';
import {exchangesReducer as exchanges, searchResultsExchanges} from './exchanges';
import {permissions} from "./notificationPermissions";

module.exports = combineReducers({
  loginReducer,
  forgotPasswdReducer,
  signupReducer,
  internationalsReducer,
  companyActivitiesReducer,
  patchInterReducer,
  postBenefReducer,
  accountsMeReducer,
  confirmPasswdReducer,
  rechargesReducer,
  refillsReducer,
  refillsMeReducer,
  sentKralissReducer,
  postQRCodesReducer,
  useQRCodeReducer,
  sentQRStatusReducer,
  refundsReducer,
  lastTransactionReducer,
  docMeReducer,
  authPasswdReducer,
  contactsReducer,
  receiveKralissReducer,
  confirmAskReducer,
  deviceApnsReducer,
  pushProcessReducer,
  addGodsonReducer,
  resetPasswdReducer,
  confirmAccountReducer,
  confirmGodfatherReducer,
  sponsorMonthSummaryReducer,
  logoutReducer,
  sendInvoiceReducer,
  activationReducer,
  exchanges,
  searchResultsExchanges,
  permissions
});
