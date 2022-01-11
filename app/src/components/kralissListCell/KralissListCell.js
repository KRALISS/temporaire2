import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image,TouchableHighlight } from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

export default class KralissListCell extends Component {
  render() {
    let { subTitleTextStyle,mainTitleTextStyle, } = this.props
    return (
      <View style={[this.props.style, styles.container]}>
        {this.props.sectionTitle !== undefined && (
          <Text style={styles.txtSectionTitle}>{this.props.sectionTitle}</Text>
        )}

        <TouchableOpacity
          style={styles.mainTouchable}
          disabled={this.props.onSelect ? false : true}
          onPress={this.props.onSelect ? this.props.onSelect : () => {}}
        >
          {!this.props.noTopPadding && <View style={styles.paddingView} />}
          <View style={styles.contentView}>
            <View
              style={
                this.props.hasClosure
                  ? this.props.isLeftMenu
                    ? styles.contentExtraLargeMainContent
                    : styles.contentLargeMainContent
                  : styles.contentMainContent
              }
            >
              {this.props.mainTitle !== undefined && (
                <Text style={[styles.txtMainTitle,{...mainTitleTextStyle}]}>{this.props.mainTitle}</Text>
              )}
              {this.props.subTitle !== undefined && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Text style={[styles.txtSubTitle,{...subTitleTextStyle}]}>{this.props.subTitle}</Text>
                  {this.props.showSubTitleIcon && (
                    <Image
                      style={{
                        marginLeft: 5,
                        marginTop: 10,
                        width: 12,
                        height: 12
                      }}
                      source={require("../../assets/images/chevron_small_lghtgrey.png")}
                    />
                  )}
                </View>
              )}
            </View>
            <View style={styles.contentRightContent}>
              {this.props.detailContent !== undefined && (
                <Text
                  style={styles.txtDetailContent}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {this.props.detailContent}{"   "}
                </Text>
              )}
              {this.props.hasClosure && (
                <Image
                    style={{
                        width: wp(4),
                        height: wp(4),
                    }}
                    source={require("../../assets/images/chevron_small_lghtgrey.png")}
                />
              )}
              {this.props.EditIcon && (
                  <TouchableHighlight onPress={() => this.props.onPress()}>
                  <Image
                      style={{
                          width: wp(4),
                          height: wp(4),
                      }}
                      source={require("../../assets/images/edit.png")}
                  />            
                </TouchableHighlight>
              )}
            </View>
          </View>
          {!this.props.noBottomPadding && <View style={styles.paddingView} />}
        </TouchableOpacity>
      </View>
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column"
  },
  mainTouchable: {
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20
  },
  paddingView: {
    height: 20,
    width: "100%",
    backgroundColor: "#fff"
  },
  contentView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    marginLeft: 20,
    marginRight: 20,
    marginTop: 12,
    marginBottom: 12
  },
  contentMainContent: {
    flexDirection: "column",
    flex: 1
  },
  contentExtraLargeMainContent: {
    flexDirection: "column",
    flex: 3
  },
  contentLargeMainContent: {
    flexDirection: "column",
    flex: 2.3
  },
  txtMainTitle: {
    color: "#484848",
    fontSize: RFPercentage(2.1)
  },
  txtSubTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    marginTop: 10
  },
  contentRightContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  txtDetailContent: {
    color: "#acacac",
    fontSize: RFPercentage(2.1),
    textAlign: "right"
  }
});

KralissListCell.defaultProps = {
  editible: true,
  ID: "0"
};
