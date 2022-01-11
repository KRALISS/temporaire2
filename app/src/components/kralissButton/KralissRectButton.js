import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class KralissButton extends Component {
  render() {
    const enableStyle = this.props.enabled
      ? styles.buttonEnabled
      : styles.buttonDisabled;
    const style = this.props.isYellow
      ? styles.buttonEnabledYellow
      : enableStyle;
    return (
      <TouchableOpacity
        style={[style, this.props.style]}
        disabled={!this.props.enabled}
        onPress={this.props.enabled ? () => this.props.onPress() : () => {}}
      >
        <Text style={styles.buttonTitle}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: RFPercentage(2.8)
  },
  buttonEnabledYellow: {
    width: "100%",
    backgroundColor: "#f59c00",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonEnabled: {
    width: "100%",
    backgroundColor: "#00aca9",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonDisabled: {
    width: "100%",
    backgroundColor: "#c7eceb",
    justifyContent: "center",
    alignItems: "center"
  }
});
