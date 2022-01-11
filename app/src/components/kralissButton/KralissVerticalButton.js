import React, { Component } from "react";
import { Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from "react-native-responsive-screen";

export default class KralissVerticalButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        disabled={!this.props.enabled}
        onPress={this.props.enabled ? () => this.props.onPress() : () => {}}
      >
        <Image source={this.props.image} />
        <Text style={styles.text}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  text: {
    marginTop: 10,
    textAlign: "center",
    flex: 1,
    color: "#fff",
    fontSize: RFPercentage(2.5),
    maxWidth: wp(40)
  }
});
