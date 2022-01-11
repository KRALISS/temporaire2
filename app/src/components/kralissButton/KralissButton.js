import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class KralissButton extends Component {
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
        onPress={this.props.enabled ? () => this.props.onPress() : () => {}}
      >
        <Text style={styles.text}>{this.props.title}</Text>
      </TouchableOpacity>      
    );
  }
}

const styles = StyleSheet.create({
  containerEnabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00aca9",
    borderRadius: 5
  },
  containerDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c7eceb",
    borderRadius: 5
  },
  text: {
    textAlign: "center",
    flex: 1,
    color: "#fff",
    fontSize: RFPercentage(3)
  }
});
