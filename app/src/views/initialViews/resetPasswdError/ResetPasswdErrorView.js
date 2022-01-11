import { StyleSheet, View, Text, Image } from "react-native";
import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import GradientView from "../../../components/gradientView/GradientView";
import KralissButton from "../../../components/kralissButton/KralissButton";

//Add i18n
import i18n from "../../../locale/i18n";

export default class ResetPasswdErrorView extends Component {
  onPressTerminal = () => {
    //this.props.navigation.goBack();
    const navigateAction = NavigationActions.navigate({
      routeName: "Login"
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    return (
      <GradientView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {i18n.t("components.errorView.headerText")}
          </Text>
          <Image
            style={{ marginTop: 20 }}
            source={require("../../../assets/images/times-circle.png")}
          />
        </View>
        <View style={styles.footer}>
          <KralissButton
            style={styles.sendBtn}
            onPress={this.onPressTerminal}
            title={i18n.t("components.errorView.return")}
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
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  sendBtn: {
    width: "100%",
    height: 55,
    marginBottom: 25
  }
});
