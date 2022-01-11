import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

export default class RoundRectView extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#6666662a",
    shadowColor: "#000000",
    elevation: 4,

    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.1
  }
});
