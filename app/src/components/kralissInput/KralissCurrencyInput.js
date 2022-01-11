import React, { Component } from "react";
import { TextInput, StyleSheet, View, Text, Image } from "react-native";
import { Container, Header, Content, Item, Input, Icon } from "native-base";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class KralissCurrencyInput extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          <TextInput
            style={[styles.textInput, this.props.valueFontSize]}
            placeholderTextColor="#cecece"
            placeholder={this.props.placeHolder}
            value={(this.props.value).replace(",", ".")}
            editable={this.props.editible}
            onChangeText={text => this.props.onChangeText(this.props.ID, text)}
            keyboardType={"decimal-pad"}
          />

          <Text
            style={[
              this.props.value.length > 0
                ? styles.txtUnit
                : styles.txtUnitNoVal,
              this.props.unitFontSize
            ]}
          >
            {this.props.unitValue}
          </Text>
        </Item>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end"
  },

  item: {
    alignItems: "baseline",
    borderBottomColor: "#cecece"
  },
  textInput: {
    marginRight: 0,
    flex: 1,
    color: "#484848"
  },
  txtUnitNoVal: {
    marginLeft: 10,
    color: "#cecece"
  },
  txtUnit: {
    marginLeft: 10,
    color: "#484848"
  }
});

KralissCurrencyInput.defaultProps = {
  editible: true,
  ID: "0"
};
