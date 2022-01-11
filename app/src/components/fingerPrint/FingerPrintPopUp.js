import React, { Component } from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
  StyleSheet
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import ShakingText from './ShakingText';
import i18n from "../../locale/i18n";

class FingerPrintPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: i18n.t("login.fingerPrint"),
      numOfTry:0
    };

    this.description = null;
  }

  componentDidMount() {
    this.authLegacy()
  }

  componentWillUnmount () {
    LocalAuthentication.cancelAuthenticate()
  }

   authLegacy = async () =>{
    try {
      let results = await LocalAuthentication.authenticateAsync();
      if (results.success) {
        this.props.onAuthenticate();
      } else {
        let errorMessage = "";
        switch(results.error){
          case "user_cancel":
            errorMessage = i18n.t("login.fingerPrintCancelled")
            break;
          case "authentication_failed":
            errorMessage = i18n.t("login.fingerPrintAuthError")
            break;
          default:
            i18n.t("myAccount.unexpectedError")
        }
        this.setState({errorMessageLegacy: errorMessage,numOfTry:this.state.numOfTry + 1});
        // this.description.shake();
        if(this.state.numOfTry && this.state.numOfTry >= 3){
          this.props.handlePopupDismissed()
        }else{
          this.authLegacy();
        }
      }
    } catch (e) {
      console.log(e);
    }

  };


  render() {
    const { errorMessageLegacy, biometricLegacy } = this.state;
    const { style, handlePopupDismissed } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>

          <Image
            style={styles.logo}
            source={require('../../assets/images/finger_print.png')}
          />

          <Text style={styles.heading}>
            {i18n.t("login.fingerPrintHeader")}
          </Text>
          <ShakingText
            ref={(instance) => { this.description = instance; }}
            style={[styles.description,{color: errorMessageLegacy ? '#ea3d13' : '#a5a5a5',}]}>
            {errorMessageLegacy || i18n.t("login.fingerPrintMessage")}
          </ShakingText>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissed}
          >
            <Text style={styles.buttonText}>
              {i18n.t("login.backToMain")}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex:2,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    // backgroundColor:'red',
    borderWidth:1,
  },
  logo: {
    marginVertical: 45,
  },
  heading: {
    textAlign: 'center',
    color: '#00a4de',
    fontSize: 21,
  },
  description:{
    textAlign: 'center',
    height: 65,
    fontSize: 16,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  buttonContainer: {
    padding: 20,
  },
  buttonText: {
    color: '#8fbc5a',
    fontSize: 15,
    fontWeight: 'bold',
  },
})


export default FingerPrintPopUp;
