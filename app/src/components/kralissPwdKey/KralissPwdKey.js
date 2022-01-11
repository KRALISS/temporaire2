import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import RectButton from "../rectButton/RectButton";

export default class KralissPwdKey extends Component {
  keyboardRow1 = [];
  keyboardRow2 = [];

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  constructor(props) {
    super(props);
    let arrKeyboards = [
      { key: 3 },
      { key: 0 },
      { key: 1 },
      { key: 2 },
      { key: 7 },
      { key: 6 },
      { key: 4 },
      { key: 8 },
      { key: 5 },
      { key: 9 }
    ];
    arrKeyboards = this.shuffle(arrKeyboards);
    for (let i = 0; i < arrKeyboards.length; i++) {
      if (i < 5) {
        this.keyboardRow1.push(arrKeyboards[i]);
      } else {
        this.keyboardRow2.push(arrKeyboards[i]);
      }
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.subContainer}>
          {this.keyboardRow1.map(item => {
            return (
              <RectButton
                style={styles.keyboard}
                btnID={item["key"]}
                title={item["key"]}
                key={item["key"]}
                onPress={() => this.props.onPressKey(item["key"])}
                enabled={true}
              />
            );
          })}
        </View>
        <View style={styles.subContainer}>
          {this.keyboardRow2.map(item => {
            return (
              <RectButton
                style={styles.keyboard}
                btnID={item["key"]}
                title={item["key"]}
                key={item["key"]}
                onPress={() => this.props.onPressKey(item["key"])}
                enabled={true}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  subContainer: {
    width: "100%",
    // height: "49%",
    marginVertical: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  keyboard: {
    flex: 1,
    borderColor: "#cecece",
    borderWidth: 1,
    marginHorizontal: 3,
    aspectRatio: 1,
  }
});
