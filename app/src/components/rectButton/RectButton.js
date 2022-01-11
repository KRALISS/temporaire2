import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class RectButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[
          this.props.enabled
            ? styles.containerEnabled
            : styles.containerDisabled,
          this.props.style
        ]}
        disabled={!this.props.enabled}
        onPress={
          this.props.enabled
            ? () => this.props.onPress(this.props.btnID)
            : () => {}
        }
      >
        <Text style={[styles.text, this.props.textStyle]}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  containerEnabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  containerDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee"
  },
  text: {
    textAlign: "center",
    flex: 1,
    color: "#484848",
    fontSize: RFPercentage(4.5)
  }
});
