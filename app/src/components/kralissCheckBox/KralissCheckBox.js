import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

//Add i18n
import i18n from "../../locale/i18n";

export default class KralissCheckbox extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.onCheckChanged()}
      >
        <View style={[styles.container]}>
          <Image
            style={{ width: 18, height: 18 }}
            source={
              this.props.isChecked
                ? require("../../assets/images/filled_checkbox.png")
                : require("../../assets/images/empty_checkbox.png")
            }
          />
          <Text style={styles.text}>{i18n.t("components.checkbox.label")}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10
  },
  text: {
    marginLeft: 10,
    marginRight: 0,
    flex: 1,
    color: "#8ff",
    fontSize: RFPercentage(2)
  }
});
