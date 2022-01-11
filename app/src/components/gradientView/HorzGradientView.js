import LinearGradient from "react-native-linear-gradient";
import React, { Component } from "react";
import { PrimaryColor, GradientEndColor } from "../../assets/styles/Styles";
import { Dimensions, StyleSheet, View, Text, Image } from "react-native";

export default class HorzGradientView extends Component {
  render() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[GradientEndColor, PrimaryColor]}
        style={[styles.linearGradient, this.props.style]}
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
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 0
  },
  container: {
    flex: 1
  }
});
