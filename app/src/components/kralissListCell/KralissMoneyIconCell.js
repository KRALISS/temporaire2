import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class KralissMoneyIconCell extends Component {
  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <Text style={[styles.txtMainTitle, this.props.titleFontSize]}>
          {this.props.title}
        </Text>
        <Image source={require("../../assets/images/kraliss_logo_grey.png")} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end"
  },

  txtMainTitle: {
    color: "#cecece",
    textAlign: "right",
    marginRight: 5
  }
});
