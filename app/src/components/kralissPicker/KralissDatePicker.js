import React, { Component } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  PickerIOS
} from "react-native";
import { Container, Header, Content, Item, Input, Icon } from "native-base";
import {RFPercentage} from "react-native-responsive-fontsize";
import {
  KeyboardAccessoryView,
  KeyboardUtils
} from "react-native-keyboard-input";
import Moment from "moment";
// import "../customKeyboards/pickerKeyboard";
// import "../customKeyboards/datePickerKeyboard";
import DatePicker from 'react-native-datepicker'

export default class KralissDatePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customKeyboard: undefined,
      date: props.value
    };
  }
  onPressPicker = date => {
    this.datePicker.onPressDate()
    this.valueTextInput.focus();
  };
  //

  onKeyboardResigned = () => {
    this.setState({ customKeyboard: undefined });
  };

  onKeyboardItemSelected = ( value) => {
    if (value) {
      //done
      this.props.onSelect(value);
    } else {
    }
    this.valueTextInput.blur();
    // KeyboardUtils.dismiss();
    // this.setState({ customKeyboard: undefined });
  };

  render() {
    let _iconArrow = require("../../assets/images/icon_downarrow.png");
    if (this.state.customKeyboard !== undefined)
      _iconArrow = require("../../assets/images/icon_uparrow.png");
    const formattedDate = this.props.value ? this.props.value :  null
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => this.onPressPicker()}
          >
            <View style={{ flex: 1 }} pointerEvents="none">
              <TextInput
                ref={ref => {
                  this.valueTextInput = ref;
                }}
                style={styles.textInput}
                editable={false}
                placeholderTextColor="#8fff"
                placeholder={this.props.placeHolder}
                value={formattedDate}
              />
            </View>
          </TouchableOpacity>
          <Image style={styles.iconArrow} source={_iconArrow} />
        </Item>
        <DatePicker
          date={this.state.date}
          ref={ref => this.datePicker = ref}
          mode="date"
          format="DD-MM-YYYY"
          androidMode={'spinner'}
          TouchableComponent={()=>null}
          onDateChange={(date) => {this.onKeyboardItemSelected(date)}}
        />
        {/*<KeyboardAccessoryView*/}
        {/*  renderContent={() => {*/}
        {/*    return <View />;*/}
        {/*  }}*/}
        {/*  trackInteractive={false}*/}
        {/*  kbInputRef={this.valueTextInput}*/}
        {/*  kbComponent={this.state.customKeyboard}*/}
        {/*  kbInitialProps={{*/}
        {/*    cancelTitle: this.props.cancelBtnTitle,*/}
        {/*    doneTitle: this.props.confirmBtnTitle,*/}
        {/*    currentValue: this.props.value*/}
        {/*  }}*/}
        {/*  onItemSelected={this.onKeyboardItemSelected}*/}
        {/*  onKeyboardResigned={this.onKeyboardResigned}*/}
        {/*/>*/}
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
  iconArrow: {
    marginLeft: 10,
    width: 20,
    height: 20
  }
});
