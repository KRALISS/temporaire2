import React, { Component } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Modal
} from "react-native";
import { Container, Header, Content, Item, Input, Icon } from "native-base";
import {RFPercentage} from "react-native-responsive-fontsize";
import {
  KeyboardAccessoryView,
  KeyboardUtils
} from "react-native-keyboard-input";
import PickerKeyboard from "../customKeyboards/pickerKeyboard";

export default class KralissGreyPicker extends Component {
  state = {
    customKeyboard: undefined,
    modalVisible: false
  };
  onPressPicker = () => {
    this.setState({ customKeyboard: "PickerKeyboardView", modalVisible: true });
    if(Platform.OS === 'ios') {
      this.valueTextInput.focus();
    }
  };
  //

  onKeyboardResigned = () => {
    this.valueTextInput.blur();
    this.setState({ customKeyboard: undefined, modalVisible: false });
  };

  onKeyboardItemSelected = (keyboardId, params) => {
    if (params.value) {
      //done
      this.props.onSelect(params.value, params.index);
    } else {
    }
    // KeyboardUtils.dismiss();
    // this.valueTextInput.blur();
    this.setState({ customKeyboard: undefined, modalVisible: false });
  };

  render() {
    let _iconArrow = require("../../assets/images/icon_downarrow.png");
    if (this.state.customKeyboard !== undefined)
      _iconArrow = require("../../assets/images/icon_uparrow.png");
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          {this.props.prefixString && (
            <Text style={styles.textPrefix}>{this.props.prefixString}</Text>
          )}
          <TouchableOpacity
            style={{ flex: 1, height: 40 }}
            onPress={() => this.onPressPicker()}
          >
            <View style={{ flex: 1 }} pointerEvents="none">
              <TextInput
                ref={ref => {
                  this.valueTextInput = ref;
                }}
                style={styles.textInput}
                editable={false}
                placeholderTextColor="#484848"
                placeholder={this.props.placeHolder}
                value={this.props.value}
              />
            </View>
          </TouchableOpacity>
          {!this.props.prefixString && (
            <Image style={styles.iconArrow} source={_iconArrow} />
          )}
        </Item>
        {Platform.OS === 'ios'?
          <KeyboardAccessoryView
            trackInteractive={false}
            kbInputRef={this.valueTextInput}
            kbComponent={this.state.customKeyboard}
            kbInitialProps={{
              cancelTitle: this.props.cancelBtnTitle,
              doneTitle: this.props.confirmBtnTitle,
              currentValue: this.props.value,
              pickerData: this.props.pickerData
            }}
            onItemSelected={this.onKeyboardItemSelected}
            onKeyboardResigned={this.onKeyboardResigned}
          /> :
          <Modal
            animationType = "slide"
            visible={this.state.modalVisible}
            transparent = {true}
            onRequestClose = {() => {}}
          >
            <View style = {{position:'absolute', width: '100%', bottom: 0, top: 10}}>
              <PickerKeyboard
                cancelTitle = {this.props.cancelBtnTitle}
                doneTitle = {this.props.confirmBtnTitle}
                currentValue = {this.props.value}
                pickerData = {this.props.pickerData}
                onItemSelected = {this.onKeyboardItemSelected}
                onKeyboardResigned = {this.onKeyboardResigned}
              />
            </View>
          </Modal>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: "center"
  },

  item: {
    borderBottomColor: "#484848"
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#484848",
    fontSize: RFPercentage(2.3)
  },
  textPrefix: {
    height: 20,
    marginRight: 5,
    alignContent: "center",
    color: "#484848",
    fontSize: RFPercentage(2.3)
  },
  iconArrow: {
    marginLeft: 10,
    width: 20,
    height: 20
  }
});
