import React, { Component } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Item } from "native-base";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class KralissGreyInput extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          {this.props.secureText ? (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.props.onSecureChange(this.props.ID)}
            >
              <View style={{ flex: 1 }} pointerEvents="none">
                <TextInput
                  style={styles.textInput}
                  placeholderTextColor="#cecece"
                  placeholder={this.props.placeHolder}
                  value={this.props.value}
                  secureTextEntry={this.props.secureText ? true : false}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TextInput
              style={this.props.multiline ? this.props.style : styles.textInput}
              placeholderTextColor="#cecece"
              placeholder={this.props.placeHolder}
              value={this.props.value}
              keyboardType={this.props.keyboardType}
              onChangeText={text =>
                this.props.onChangeText(this.props.ID, text)
              }
              editable={this.props.editible}
              autoCorrect={this.props.autoCorrect ? false : true}
              autoCapitalize={this.props.autoCapitalize ? "none" : "sentences"}
              multiline={this.props.multiline}
              numberOfLines={this.props.numberOfLines}
            />
          )}
          {this.props.showDeleteBtn &&
            this.props.value.length > 0 && (
              <TouchableOpacity
                onPress={() => this.props.onDeleteText(this.props.ID)}
              >
                <Image
                  style={{tintColor: 'grey'}} 
                  source={require("../../assets/images/times_circle_regular.png")}
                />
              </TouchableOpacity>
          )}
        </Item>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center"
  },
  item: {
    borderBottomColor: "#cecece"
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#484848",
    fontSize: RFPercentage(2.0)
  }
});

KralissGreyInput.defaultProps = {
  editible: true,
  ID: "0"
};
