import { Dimensions, StyleSheet, View, Text, Image } from "react-native";
import React, { Component } from "react";
import GradientView from "../../../components/gradientView/GradientView";

export default class LaunchView extends Component {
  render() {
    return (
      <GradientView style={styles.container}>
        <Image
          source={require("../../../assets/images/logo_kraliss_typo.png")}
        />
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
