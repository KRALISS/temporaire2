import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class KralissClearCell extends Component {
  render() {
    return (
      <View style={[styles.container,this.props.style,]}>
        <View style={styles.contentView}>
          <View
            style={
              this.props.detailContent?.length > 16
                ? styles.contentSmallMainContent
                : styles.contentMainContent
            }
          >
            <Text
              style={
                this.props.boldContent
                  ? {...styles.txtMainBoldTitle,...this.props.extraHeaderTextstyle}
                  : {...styles.txtMainTitle,...this.props.extraHeaderTextstyle}
              }
            >
              {this.props.mainTitle}
            </Text>
          </View>
          {this.props.detailContent !== undefined ? <View style={styles.contentRightContent}>

              <Text
                style={
                  this.props.boldContent
                    ? {...styles.txtDetailBoldContent,...this.props.extraDetailTextStyle}
                    : {...styles.txtDetailContent,...this.props.extraDetailTextStyle}
                }
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {this.props.detailContent}
              </Text>

          </View> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column"
  },
  contentView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },

  contentSmallMainContent: {
    flexDirection: "column",
    flex: 1
  },
  contentMainContent: {
    flexDirection: "column",
    flex: 2.3
  },
  txtMainTitle: {
    color: "#484848",
    fontSize: RFPercentage(2.1)
  },
  txtMainBoldTitle: {
    color: "#484848",
    fontWeight: "bold",
    fontSize: RFPercentage(2.1)
  },
  contentRightContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  txtDetailContent: {
    color: "#484848",
    fontSize: RFPercentage(2.1),
    textAlign: "right"
  },
  txtDetailBoldContent: {
    color: "#484848",
    fontSize: RFPercentage(2),
    textAlign: "right",
    fontWeight: "bold"
  }
});
