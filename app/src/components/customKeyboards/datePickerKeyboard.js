import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  DatePickerIOS,
  DatePickerAndroid,
  Platform
} from "react-native";
// import { KeyboardRegistry } from "react-native-keyboard-input";

class DatePickerKeyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: new Date(props.currentValue)
    };
    this.datePicker = this.datePicker.bind(this);
  }

  static propTypes = {
    doneTitle: PropTypes.string,
    cancelTitle: PropTypes.string
  };

  onPressDone = () => {
    //console.log("done");
    // KeyboardRegistry.onItemSelected("DatePickerKeyboardView", {
    //   value: this.state.currentValue
    // });
  };

  onPressCancel = () => {
    // KeyboardRegistry.onItemSelected("DatePickerKeyboardView", {
    //   cancel: true
    // });
  };

  setDate = newDate => {
    this.setState({ currentValue: newDate });
  };

  async datePicker(){
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              date: this.state.currentValue,
              mode: 'spinner'
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              // Selected year, month (0-11), day
              let mm = month < 9 ? '0' + (month + 1) : '' + (month + 1);
              let dd = day < 10 ? '0' + day : '' + day;
              // KeyboardRegistry.onItemSelected("DatePickerKeyboardView", {
              //   value: new Date(year + '-' + mm + '-' + dd)
              // });
            }
            else {
              // KeyboardRegistry.onItemSelected("DatePickerKeyboardView", {
              //   cancel: true
              // });
            }
          } catch ({code, message}) {
            alert('Cannot open date picker: '+message);
          }
    }

  render() {
    if(Platform.OS === 'android') {
       return null;
    }
    return (
      <View
        contentContainerStyle={[
          styles.keyboardContainer,
          { backgroundColor: "white" }
        ]}
      >
        <View style={styles.accessBarContainer}>
          <TouchableOpacity onPress={() => this.onPressCancel()}>
            <Text style={styles.accessoryBtn}>{this.props.cancelTitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onPressDone()}>
            <Text style={styles.accessoryBtn}>{this.props.doneTitle}</Text>
          </TouchableOpacity>
        </View>
        <DatePickerIOS
          date={this.state.currentValue}
          mode="date"
          onDateChange={this.setDate}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  accessBarContainer: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f7f7"
  },
  accessoryBtn: {
    color: "#0d80fe"
  },
  centerPickerView: {
    backgroundColor: "#c9ced4"
  }
});

// KeyboardRegistry.registerKeyboard(
//   "DatePickerKeyboardView",
//   () => DatePickerKeyboard
// );
