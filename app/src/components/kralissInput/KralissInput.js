import React, { Component } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { Container, Header, Content, Item, Input, Icon } from "native-base";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class KralissInput extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          {this.props.icon && (
            <Image style={{ marginRight: 10 }} source={this.props.icon} />
          )}
          {this.props.secureText ? (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.props.onSecureChange(this.props.ID)}
            >
              <View style={{ flex: 1 }} pointerEvents="none">
                <TextInput
                  style={styles.textInput}
                  editable={false}
                  placeholderTextColor="#8fff"
                  placeholder={this.props.placeHolder}
                  value={this.props.value}
                  secureTextEntry={this.props.secureText ? true : false}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TextInput
              style={styles.textInput}
              placeholderTextColor="#8fff"
              placeholder={this.props.placeHolder}
              value={this.props.value}
              editable={this.props.editible}
              onChangeText={text =>
                this.props.onChangeText(this.props.ID, text)
              }
              keyboardType={this.props.keyboardType}
              autoCorrect={this.props.autoCorrect ? false : true}
              autoCapitalize={this.props.autoCapitalize ? "none" : "sentences"}
              maxLength={this.props.maxLength}
            />
          )}
          {this.props.showDeleteBtn &&
            this.props.value.length > 0 && (
              <TouchableOpacity
                onPress={() => this.props.onDeleteText(this.props.ID)}
              >
                <Image
                  source={require("../../assets/images/times_circle_regular.png")}
                />
              </TouchableOpacity>
            )}
          {this.props.confirmIcon &&
            this.props.isConfirmed && (
              <Image
                style={styles.iconConfirm}
                source={this.props.confirmIcon}
              />
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
    borderBottomColor: "#fff"
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#fff",
    fontSize: RFPercentage(2.3)
  },
  iconConfirm: {
    marginLeft: 10,
    width: 20,
    height: 20
  }
});

KralissInput.defaultProps = {
  editible: true,
  ID: "0"
};
