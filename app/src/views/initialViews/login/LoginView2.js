import React, {Component} from "react";
import {connect} from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
    import CryptoJS from "react-native-crypto-js";
import * as LocalAuthentication from 'expo-local-authentication';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {View, KeyboardAvoidingView, StyleSheet, Keyboard, ScrollView, TouchableOpacity, Image, Text, Alert} from "react-native";

import {reqLogin, reqInitSignIn} from "../../../reducers/login";
import {reqAccountsMe, reqInitAccountsMe, reqID} from "../../../reducers/accountsMe";
import {reqActivation} from "../../../reducers/resendEmailActivation";
import { reqInternationals,reqLanguages } from "../../../reducers/internationals";
import { reqCompanyActivities } from "../../../reducers/companyActivities";

import i18n from "../../../locale/i18n";

import setAuthToken, {removeAxiosAuth} from "../../../utils/networkUtils";
import {number_of_connection} from "../../../utils/config";
import { saveLocalData, loadLocalData, saveAuthToken, saveUserInfo ,getAuthToken } from "../../../utils/localStorage";

import GradientView from "../../../components/gradientView/GradientView";
import Loader from "../../../components/loader/Loader";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissCheckbox from "../../../components/kralissCheckBox/KralissCheckBox";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import KralissButton from "../../../components/kralissButton/KralissButton";
import FingerprintPopup from '../../../components/fingerPrint/FingerPrintPopUp';
import RNLanguages from "react-native-languages";

class LoginView2 extends Component {
    constructor(props) {
        super(props)
        email = "";
        isLoading = false;
        emailChanged = false;


        const params = props.navigation.state;
        if(params.params){
        let { email,isLoading} = params.params;
        emailChanged=true;
  
        }
        this.state = {
            email: email,
            displayEmail: "",
            rememberBtn: false,
            password: "",
            nbOfFail: 0,

            isLoading: isLoading,
            showKeyboard: false,

            modalSensor: false,
            errorMessage: undefined,
            biometric: undefined,

            countries :[],

            signUp: false,

            firstLogin : false,
            emailChanged:emailChanged,

            companyActivities:[]
        }
    }

    onChangeEmail = (_,val) => {
        if(this.state.displayEmail.includes("•") && this.state.displayEmail.length > val.length) {
            this.setState({email: "", displayEmail: ""})
        } else {this.setState({email: val, displayEmail: val})}
    }

    onPressSecure = () => {
        this.setState({showKeyboard: true});
        Keyboard.dismiss();
    }

    onChangeSecure = key => {
        if(this.state.password.length < 4) {
            this.setState({password: this.state.password + key})
        }
    }
    
    onPressLogin = () => {
        if(this.state.rememberBtn) {
            saveLocalData("emailLogin", this.state.email)
            const encryptedPwd = CryptoJS.AES.encrypt(this.state.password, this.state.email).toString();
            saveLocalData("password", encryptedPwd);
        } else {saveLocalData("emailLogin", undefined)}
        removeAxiosAuth();
        saveLocalData("email", this.state.email);
        this.setState({isLoading: true})
        this.props.reqLogin({
            email: this.state.email.toLowerCase(),
            password: this.state.password
        })
    }

    onPressSignUP = () => {
        this.setState({signUp:true}) ;
        this.props.navigation.navigate("SignupView")
    }

    hideEmail = email => {
        const left = email.split("@")[0]
        const rigth = email.split("@")[1]

        const firstLeft = left.charAt(0)
        const rightLeft = left.charAt(left.length - 1)
        const firstRigth = rigth.charAt(0)
        const rightRigth = rigth.charAt(rigth.length - 1)

        let pointLeft = "";
        for(let i = 0; i < left.length - 2; i++){
            pointLeft = pointLeft + "•"
        }
        let pointRigth = "";
        for(let i = 0; i < rigth.length - 2; i++){
            pointRigth = pointRigth + "•"
        }
        this.setState({displayEmail: firstLeft + pointLeft + rightLeft + "@" + firstRigth + pointRigth + rightRigth})
    }

    componentDidMount = async () => {

        if(this.state.modalSensor){this.setState({modalSensor: false});}

        const email = await loadLocalData("emailLogin")
        if(email) {
            this.setState({email, rememberBtn: true}); 
            this.hideEmail(email);
            this.detectFingerprintAvailable();
        }
        removeAxiosAuth();
        this.props.reqInternationals();
        this.props.reqCompanyActivities();


    }

    componentDidUpdate = async (prevProps, prevState) => {
        //if(this.state.modalSensor){this.setState({modalSensor: false});}
        let  compagnyActivitiesAPI  = this.props["companyActivities"];

        if (this.props.companyActivities &&
            this.props.companyActivities.length > 0 &&
            this.state.companyActivities.length === 0
          ){
            saveLocalData("allCompanyActivities", compagnyActivitiesAPI);
            let companyActivities = compagnyActivitiesAPI
              .map(item => item["label"])
              .sort();
            this.setState({ companyActivities });
            saveLocalData("companyActivities", companyActivities);

          }

        if(this.props.auth_token !== prevProps.auth_token && this.props.auth_token.token) {
            saveAuthToken(this.props.auth_token.token);
            setAuthToken(this.props.auth_token.token)
            this.setState({firstLogin:true});
            this.props.reqAccountsMe(); // Get user details


        }

        //check if token exist
        token= await getAuthToken();

        let  internationals  = this.props.internationals

        if (this.props.internationals != undefined && this.props.internationals &&
            this.props.internationals.length > 0 &&
            this.state.countries.length === 0 &&
            !this.state.signUp &&
            token
          ) {
            saveLocalData("allInternationals", this.props.internationals)
      
            const iphoneLanguage = RNLanguages.language;
            let correctCountryLanguage = ""
            if (iphoneLanguage === "fr-FR") {
              correctCountryLanguage = "labelFr"
            } else {
              correctCountryLanguage = "label"
            }
            let countries = internationals
              .map(item => item[correctCountryLanguage])
            this.setState({ countries });
            
            if (iphoneLanguage === "fr-FR") { 
              internationals = internationals.sort(this.sortPropsInternationalFr);
            } else {
              internationals = internationals.sort(this.sortPropsInternational);
            }
            saveLocalData("internationals", internationals);
      
            const international_phones = internationals
              .map(item => item["phoneCode"])
              .sort(function(a, b) {
                return (
                  a.length - b.length || a.localeCompare(b) // sort by length, if equal then
                ); // sort by dictionary order
              });
      
            saveLocalData("countries", countries);
            saveLocalData("internationalPhones", international_phones);

          }


        //loading user data from database using id
        else if(this.props.payLoad !== prevProps.payLoad && this.props.payLoad && this.state.firstLogin) {
            // change this
            const kra_user = this.props.payLoad;
            if(kra_user) {

                await saveUserInfo(this.props.payLoad);
                //Save KYC Status achanger
                await saveLocalData("kycStatus", "ACTIVE");


                if(kra_user.myuser_password_use_count >= number_of_connection) 
                        this.props.navigation.navigate("RenewPasswd")
                else {
                    this.setState({firstLogin:false});
                    this.props.navigation.navigate("Main") ;
                    this.setState({isLoading: false});                
                }
            }
        }
        if((this.props.loginError !== prevProps.loginError && this.props.loginError) || (this.props.accountsError !== prevProps.accountsError && this.props.accountsError)) {
            if(this.props.errorStatus === 401 && this.state.nbOfFail < 3) {
                setTimeout(() => {
                    Alert.alert(
                      i18n.t('login.wrongPwdTitle'),
                      i18n.t('login.wrongPwdDesc', {count: 3 - this.state.nbOfFail}),
                    )
                }, 500)
                this.setState({nbOfFail: this.state.nbOfFail + 1})
            }
            if(this.props.errorStatus === 401 && this.state.nbOfFail >= 3 || this.props.errorStatus === 403) {
                setTimeout(() => {
                    Alert.alert(
                      i18n.t('login.blockedAccountTitle'),
                      i18n.t('login.blockedAccountDesc'),
                    )
                }, 500)
            }
            if(this.props.errorStatus === 404) {
                setTimeout(() => {
                    Alert.alert(
                      i18n.t('login.noUserTitle'),
                      i18n.t('login.noUserDescription'),
                    )
                }, 500)
            }
            if(this.props.errorStatus === 409) {
                setTimeout(() => {
                    Alert.alert(
                      i18n.t('login.activateAccountTitle'),
                      i18n.t('login.activateAccountDesc'),
                      [
                        {
                          text: i18n.t("login.sendEmail"),
                          onPress: () => {
                            this.props.reqActivation(this.state.email)
                          }
                        }
                      ]
                    )
                }, 500)
            }
            if( this.props.errorStatus !== 401 && 
                this.props.errorStatus !== 403 && 
                this.props.errorStatus !== 404 && 
                this.props.errorStatus !== 409
            ) 
            {
                this.props.navigation.navigate("ErrorView", {errorText: this.props.error})
            }
            this.props.reqInitSignIn();
            this.props.reqInitAccountsMe();
            this.setState({isLoading: false})
        }
    
    }

    detectFingerprintAvailable = () => {
        LocalAuthentication.hasHardwareAsync()
            .then(success => this.setState({modalSensor: true}))
            .catch(err => this.setState({errorMessage: err.message, biometric: err.biometric}))
    }

    scanFingerPrint = async () => {
        try {
            const results = await LocalAuthentication.authenticateAsync();
            if(results.success) {console.log("success")}
            else {this.setState({nbOfFail: this.state.nbOfFail + 1})}
        } catch(e) {
            console.log(e)
        }
    }

    fingerPrintLogin = async () => {
        const email = await loadLocalData("emailLogin");
        const pwdEncrypted = await loadLocalData("password");
        const password = CryptoJS.AES.decrypt(pwdEncrypted, email).toString(CryptoJS.enc.Utf8);
        this.setState({email, password})
        this.onPressLogin()
    }
    

    render() {
        return(
            <GradientView style={style.container}>
                {
                    this.state.isLoading && <Loader loading={this.state.isLoading} typeOfLoad={i18n.t("components.loader.descriptionText")}/>
                }
                {
                    this.state.modalSensor && <FingerprintPopup style={style.popup} onAuthenticate={() => this.fingerPrintLogin()} handlePopupDismissed={() => this.setState({modalSensor: false})} />
                }
                <KeyboardAvoidingView style={style.container} behavior="padding" enabled={false}>
                    <ScrollView style={{height: "100%"}} contentContainerStyle={{justifyContent:"space-between"}}>
                        <View style={style.header}>
                            <Image
                                style={style.logo}
                                source={require("../../../assets/images/symbol_kraliss.png")}
                            />
                        </View>
    
                        <View style={style.center}>
                            <KralissInput
                                icon={require("../../../assets/images/mail.png")}
                                placeHolder={i18n.t("login.placeholderEmail")}
                                onChangeText={this.onChangeEmail}
                                value={this.state.displayEmail}
                                keyboardType={"email-address"}
                                autoCapitalize
                            />
                            <KralissCheckbox
                                onCheckChanged={() => this.setState({rememberBtn: !this.state.rememberBtn})}
                                isChecked={this.state.rememberBtn}
                            />
                            <KralissInput
                                icon={require("../../../assets/images/lock.png")}
                                placeHolder={i18n.t("login.placeholderPassword")}
                                value={this.state.password}
                                secureText="true"
                                showDeleteBtn={this.state.password.length > 1 && this.state.showKeyboard === true}
                                onSecureChange={this.onPressSecure}
                                onDeleteText={() => this.setState({password: "", showKeyboard: false})}
                            />
                            <TouchableOpacity
                                style={style.textBtn}
                                onPress={() => this.props.navigation.navigate("ForgotPasswd")}
                            >
                                <Text style={style.forgotPwdBtn}>
                                    {i18n.t("login.forgotPassword")}
                                </Text>
                            </TouchableOpacity>
                        </View>
    
                        <View style={style.footer}>
                            {this.state.showKeyboard && <KralissPwdKey style={{width: "90%"}} onPressKey={this.onChangeSecure}/>}
    
                            <KralissButton
                                style={style.loginBtn}
                                onPress={this.onPressLogin}
                                title={i18n.t("login.validateButton")}
                                enabled={this.state.email.trim().length > 0 && this.state.password.length === 4}
                            />
    
                            <View>
                                <Text style={style.signupText}>{i18n.t("login.noAccount")}</Text>
                                <TouchableOpacity style={style.textBtn} onPress={this.onPressSignUP}>
                                    <Text style={style.signupBtnText}>
                                        {i18n.t("login.register")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={style.versionText}>Version : 2.2.7b00</Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </GradientView>
        )
    }
}

const style= StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: 180,
        justifyContent: 'flex-end',
        alignItems: "center"
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20
    },
    center: {
      justifyContent: "space-around",
      marginTop: 60
    },
    textBtn: {
        height: 30,
        justifyContent: "flex-start",
        marginTop: 10
    },
    forgotPwdBtn: {
        marginLeft: 10,
        marginRight: 0,
        color: "#fff",
        fontSize: RFPercentage(2),
        textAlign: "right"
    },
    footer: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 30
    },
    loginBtn: {
        width: "100%",
        marginTop: 3,
        height: 55
    },
    signupText: {
        color: "#fff",
        fontSize: RFPercentage(1.9),
        textAlign: "center",
        marginTop: 10
    },
    signupBtnText: {
        color: "#fff",
        fontSize: RFPercentage(2.5),
        textAlign: "center",
        textDecorationLine: "underline"
    },
    versionText: {
        textAlign: "center",
        paddingVertical: 2,
        fontSize: RFPercentage(1.5)
    },
    popup: {
        width: wp(100) * 0.8,
    }
})

const mapStateToProps = state => {
    const {auth_token, error: loginError, errorStatus} = state.loginReducer;
    const {payLoad,payLoad1, error: accountsError} = state.accountsMeReducer;
    const {payload: emailActivationPayload} = state.activationReducer;
    const {  internationals:internationals } = state.internationalsReducer;
    const {  companyActivities:companyActivities } = state.companyActivitiesReducer;

    return {
        auth_token, loginError, errorStatus,
        payLoad,payLoad1, accountsError,
        emailActivationPayload,internationals,companyActivities
    }
}

const mapDispatchToProps = {
    reqLogin, reqInitSignIn,
    reqAccountsMe, reqInitAccountsMe,
    reqActivation,
    reqID,
    reqInternationals,
    reqCompanyActivities,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LoginView2)