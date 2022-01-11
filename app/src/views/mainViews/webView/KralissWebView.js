import React, { Component } from "react";
import { WebView, Text,SafeAreaView, View } from "react-native";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../locale/i18n";

export default class KralissWebView extends Component {
  state = {
    canGoBack: false
  };
  onNavigationStateChange = webViewState => {
    this.setState({
      canGoBack: webViewState.canGoBack
    });

    if (webViewState.url.indexOf("dashboard/refill-callback") > 0) {
      const url = webViewState.url;
      const route = url.replace(/.*?:\/\//g, "");
      const routeName = route.split("?")[0];
      let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }
      this.props.navigation.navigate("RefillLoader", params);
      this._webview.stopLoading();
    }
  };
  render() {
    const params = this.props.navigation.state;
    const { url } = params.params;

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <WhiteNavHeader
          title={i18n.t("creditMyAccount.creditMyAccount")}
          onBack={() => {
            if (this.state.canGoBack) this._webview.goBack();
            else this.props.navigation.goBack();
          }}
        />
        <WebView
          ref={c => (this._webview = c)}
          onNavigationStateChange={this.onNavigationStateChange}
          source={{ uri: url }}
          style={{ marginTop: 0, flex: 1 }}
        />
        </SafeAreaView>
    );
  }
}
