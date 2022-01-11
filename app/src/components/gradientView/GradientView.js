import LinearGradient from "react-native-linear-gradient";
import React, { Component } from "react";
import { PrimaryColor, GradientEndColor } from "../../assets/styles/Styles";
import { Dimensions, StyleSheet, View, Text, Image } from "react-native";

export default class GradientView extends Component {
  render() {
    return (
      <LinearGradient
        colors={[GradientEndColor, PrimaryColor]}
        style={styles.linearGradient}
      >
        <View style={[styles.container, this.props.style]}>
          {this.props.children}
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 0
  },
  container: {
    flex: 1
  }
});
