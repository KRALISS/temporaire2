import React, { Component } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView
} from "react-native";
import moment from "moment";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../locale/i18n";

export default class NotificationView extends Component {
  constructor(props) {
    super(props);
    const { item } = props.navigation.state.params;
    this.state = {
      title: item.notification_title || null,
      subtitle: item.notification_subtitle || null,
      body: item.notification_body || null,
      created_at: item.created_at || null
    };
  }

  messageRender = () => {
    const { subtitle, body, created_at } = this.state;
    return (
      <View
        key={String(Math.random())}
        style={{
          flex: 1,
          marginVertical: hp(1),
          paddingHorizontal: wp(1.5)
        }}
      >
        <View
          style={{
            paddingHorizontal: wp(3),
            backgroundColor: "#EDEEF0",
            paddingVertical: hp(1.5),
            alignSelf: "flex-start",
            borderTopLeftRadius: wp(3),
            borderTopRightRadius: wp(3),
            borderBottomLeftRadius: wp(0),
            borderBottomRightRadius: wp(3),
            maxWidth: wp(55)
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: "#484848"
            }}
          >
            {subtitle && `${subtitle} :`}
            {body && body}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: wp(3),
            backgroundColor: "#EDEEF0",
            paddingVertical: hp(1.5),
            alignSelf: "flex-start",
            borderTopLeftRadius: wp(3),
            borderTopRightRadius: wp(3),
            borderBottomLeftRadius: wp(0),
            borderBottomRightRadius: wp(3),
            maxWidth: wp(55),
            marginTop: 5
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: "#484848"
            }}
          >
            {i18n.t("messages.alreadyDealwith")}
          </Text>
        </View>
        <Text
          style={{
            color: "#ABA9C2",
            alignSelf: "flex-start"
          }}
        >
          {moment(created_at).format("DD/MM/YYYY HH:MM")}
        </Text>
      </View>
    );
  };

  render() {
    const { title } = this.state;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        enabled={Platform.OS === "ios" ? true : false}
      >
        <SafeAreaView style={styles.container}>
          <SafeAreaView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: "#fff"
            }}
          />
          <WhiteNavHeader
            title={title}
            onBack={() => {
              this.props.navigation.goBack();
            }}
          />
          <ScrollView>
            {this.messageRender()}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff"
  }
});
