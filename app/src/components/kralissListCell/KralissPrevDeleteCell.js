import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class KralissPrevDeleteCell extends Component {
  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        {!this.props.noTopPadding && <View style={styles.paddingView} />}
        <View style={styles.contentView}>
          <View style={styles.contentLargeMainContent}>
            <Text
              style={styles.txtMainTitle}
              ellipsizeMode="middle"
              numberOfLines={1}
            >
              {this.props.mainTitle}
            </Text>
          </View>

          <View style={styles.contentRightContent}>
            {this.props.onPreview && (
              <TouchableOpacity
                style={styles.mainTouchable}
                onPress={this.props.onPreview}
              >
                <Image source={require("../../assets/images/view.png")} />
              </TouchableOpacity>
            )}
            {this.props.onDelete && (
              <TouchableOpacity
                style={styles.mainTouchable}
                onPress={this.props.onDelete}
              >
                <Image source={require("../../assets/images/trash.png")} />
              </TouchableOpacity>
            )}
            {this.props.onSendEmail && (
              <TouchableOpacity
                style={styles.mainTouchable}
                onPress={this.props.onSendEmail}
              >
                <Image source={require("../../assets/images/credit_account_thin.png")} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!this.props.noBottomPadding && <View style={styles.paddingView} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  mainTouchable: {
    width: 30,
    height: 30,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  paddingView: {
    height: 10,
    width: "100%"
  },
  contentView: {
    paddingLeft: 20,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  contentLargeMainContent: {
    flexDirection: "column",
    flex: 1.5
  },
  txtMainTitle: {
    color: "#484848",
    fontSize: RFPercentage(2.1)
  },
  contentRightContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  }
});
