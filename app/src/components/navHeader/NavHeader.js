import React, { Component } from "react";
import {
  StatusBar,
  Image,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default class NavHeader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => this.props.onBack()}
        >
          <Image source={require("../../assets/images/chevron.png")} />
        </TouchableOpacity>
        <Image
          style={{ width: 45, height: 45 }}
          source={require("../../assets/images/symbol_kraliss.png")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    marginTop: getStatusBarHeight(),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  backBtn: {
    position: "absolute",
    left: 0
  }
});
