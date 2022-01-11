import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  Image
} from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class KralissCircleButton extends Component {
  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <TouchableOpacity
          style={styles.mainTouchable}
          onPress={this.props.onSelect ? this.props.onSelect : () => {}}
        >
          <View
            style={[
              this.props.isSelected
                ? styles.contentSelectView
                : styles.contentNormalView,
              { borderRadius: this.props.borderRadius }
            ]}
          >
            <Text
              adjustsFontSizeToFit
              style={{
                color: "#fff",
                fontSize: RFPercentage(4.0)
              }}
              numberOfLines={1}
            >
              {this.props.amount}
            </Text>
            <Text
              adjustsFontSizeToFit
              style={{
                color: "#fff",
                fontSize: RFPercentage(3.0)
              }}
            >
              {this.props.unit}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column"
  },
  mainTouchable: {
    height: "100%"
  },
  contentSelectView: {
    backgroundColor: "#f59c00",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%"
  },
  contentNormalView: {
    backgroundColor: "#707070",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%"
  }
});
