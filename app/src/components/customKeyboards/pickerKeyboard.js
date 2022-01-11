import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  PickerIOS,
  ScrollView,
  Platform, TouchableWithoutFeedback
} from "react-native";
import { KeyboardRegistry } from "react-native-keyboard-input";
import {heightPercentageToDP as hp,widthPercentageToDP as wp} from "react-native-responsive-screen";
import {RFPercentage} from "react-native-responsive-fontsize";

export default class PickerKeyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: this.props.currentValue,
      currentIndex: 0,
      selectedItem:{}
    };
    //console.log("Picker" + this.props.pickerData);
  }

  static propTypes = {
    doneTitle: PropTypes.string,
    cancelTitle: PropTypes.string
  };

  onPressDone = () => {
    let _curValue = this.state.currentValue;
    if (this.state.currentValue === "") {
      _curValue = this.props.pickerData[this.state.currentIndex];
    }

    if(Platform.OS === 'ios') {
      KeyboardRegistry.onItemSelected("PickerKeyboardView", {
        value: _curValue,
        index: this.state.currentIndex
      });
    }else {
      this.props.onItemSelected("PickerKeyboardView", {
        value: _curValue,
        index: this.state.currentIndex
      });
    }
  };

  onPressCancel = () => {
    if(Platform.OS === 'ios') {
      KeyboardRegistry.onItemSelected("PickerKeyboardView", {
        cancel: true
      });
    }else {
      this.props.onKeyboardResigned();
    }
  };


  onSelected(selected: any): void {
    this.setState({ selectedItem: selected });

    return selected;
  }

  onBackButtonPressed(): void {
    console.log('back key pressed');
  }

  render() {
    return (
      <View
        contentContainerStyle={
          styles.keyboardContainer
        }
      >
        <View style={styles.accessBarContainer}>
          <TouchableOpacity onPress={() => this.onPressCancel()}>
            <Text style={styles.accessoryBtn}>{this.props.cancelTitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onPressDone()}>
            <Text style={styles.accessoryBtn}>{this.props.doneTitle}</Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === 'ios' ?
          <PickerIOS
            style={styles.centerPickerView}
            selectedValue={this.state.currentValue}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ currentValue: itemValue, currentIndex: itemIndex })
            }
          >
            {this.props.pickerData.map(value => (
              <PickerIOS.Item key={value} label={value} value={value} />
            ))}
          </PickerIOS> :
          <ScrollView style={{ height:hp(100),backgroundColor:'white'}} contentContainerStyle={{paddingBottom:hp(2)}}>
            {/*<View style={{flex:1,height:50,backgroundColor:'red'}}>*/}
            {/*  <TouchableOpacity onPress={} style={{height:50,width:50,justifyContent:'center',marginLeft:12,}}>*/}
            {/*    <Image source={require('../../assets/images/Close.png')} />*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}
            {
              this.props.pickerData.map((item,index)=>{
                return(
                  <TouchableOpacity
                    style={{marginHorizontal:7,justifyContent:'space-around'}}
                    onPress={()=>{
                      this.setState({ currentValue: item, currentIndex: index },this.onPressDone)
                    }}
                    key={index}>
                    <Text style={{
                      paddingVertical:hp(1.2),
                      fontSize:RFPercentage(2.5)
                    }}>
                      {
                        item
                      }
                    </Text>
                    <View style={{width: wp(100) - 10, height: 1, backgroundColor: 'gray', alignSelf: 'center'}}/>
                  </TouchableOpacity>
                )
              })

            }
          </ScrollView>
        }


      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'white'
      },
      android: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor:'#00000000'
      },
    }),
  },
  accessBarContainer: {
    width: '100%',
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  accessoryBtn: {
    color: "#0d80fe"
  },
  centerPickerView: {
    width: '100%', height: 200,
    backgroundColor: "#c9ced4"
  }
});

KeyboardRegistry.registerKeyboard("PickerKeyboardView", () => PickerKeyboard);
