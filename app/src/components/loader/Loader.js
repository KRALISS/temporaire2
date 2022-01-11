import React, { Component } from "react";
import { StyleSheet, View, Modal, ActivityIndicator, Text } from "react-native";
import GradientView from "../gradientView/GradientView";
import {RFPercentage} from "react-native-responsive-fontsize";
import Spinner from "react-native-spinkit";

//Add i18n
import i18n from "../../locale/i18n";

const Loader = props => {
  const { loading, ...attributes } = props;
  //console.loag()
  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={loading}
      onRequestClose={() => {
        //console.log("close modal");
      }}
    >
      <GradientView style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <Text style={styles.descText}>
            {i18n.t("components.loader.descriptionText")}
          </Text>
          <Spinner
            isVisible={true}
            size={50}
            type="FadingCircleAlt"
            color="#fff"
          />
          {/* <Text style={styles.descText}>{props.typeOfLoad}</Text> */}
        </View>
      </GradientView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  activityIndicatorWrapper: {
    height: 130,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  descText: {
    color: "#fff",
    textAlign: "center",
    fontSize: RFPercentage(2.5)
  }
});

export default Loader;
