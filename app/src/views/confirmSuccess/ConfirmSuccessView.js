import { StyleSheet, View, Text, Image, Alert } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import GradientView from "../../components/gradientView/GradientView";
import KralissButton from "../../components/kralissButton/KralissButton";
import { reqAccountsMe } from "../../reducers/accountsMe";

//Add i18n
import i18n from "../../locale/i18n";
import { saveUserInfo } from "../../utils/localStorage";

class ConfirmSuccessView extends Component {
  constructor(props) {
    super(props)
    this.state={
      checked: false
    }
  }
  onPressTerminal = () => {
    const params = this.props.navigation.state.params;
    //this.props.navigation.goBack();
    const navigateAction = NavigationActions.navigate({
      routeName: params.route
    });
    this.props.navigation.dispatch(navigateAction);
  };

  componentDidMount() {
    const params = this.props.navigation.state.params
    if(params.success) {
      setTimeout(()=> {
        Alert.alert(
          i18n.t('tunnel.informationTitle'),
          i18n.t('tunnel.informationDesc'),
        )
      }, 500)
      if(params.comingFrom && params.comingFrom === "Tunnel") {
        // this.props.reqAccountsMe()
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const { payLoad } = this.props
    if(prevProps.payLoad !== payLoad && payLoad !== undefined && this.state.checked === false) {
      this.setState({checked: true})
      await saveUserInfo(payLoad)
    }
  }

  render() {
    const params = this.props.navigation.state.params;
    return (
      <GradientView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{params.title}</Text>
          <Image
            style={{ marginTop: 30, marginBottom: 30 }}
            source={require("../../assets/images/check_circle_solid.png")}
          />
          <Text style={styles.headerText}>{params.descMessage}</Text>
        </View>
        <View style={styles.footer}>
          <KralissButton
            style={styles.sendBtn}
            onPress={this.onPressTerminal}
            title={i18n.t("confirmResetPassword.done")}
            enabled={true}
          />
        </View>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 80
  },
  headerText: {
    color: "#fff",
    textAlign: "center"
  },
  footer: {
    flex: 0.5,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  sendBtn: {
    width: "100%",
    height: 55,
    marginBottom: 25
  }
});

const mstp = state => {
  const { payLoad } = state.accountsMeReducer
  return {payLoad};
};
const mdtp = {
  reqAccountsMe
};

module.exports = connect(
  mstp,
  mdtp
)(ConfirmSuccessView)