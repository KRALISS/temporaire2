import React from "react";
import App from "./app/App";
import configureStore from "../stores/configureStore";
import { Provider } from "react-redux";
import { Text, AsyncStorage } from "react-native";
import LaunchView from "./initialViews/launch/LaunchView";
import SplashScreen from 'react-native-splash-screen'

// i18n configuration
import RNLanguages from "react-native-languages";
import i18n from "../locale/i18n";

function setup(): ReactClass<{}> {
  //Text.defaultProps.allowFontScaling = false;

  class Root extends React.Component {
    state: {
      isLoading: boolean,
      store: any
    };

    constructor() {
      super();
      this.state = {
        storeCreated: false,
        storeRehydrated: false,
        store: null
      };
    }

    componentWillMount() {
      RNLanguages.addEventListener("change", this._onLanguagesChange);
    }

    componentDidMount() {
      configureStore(() =>
        this.setState({
          storeRehydrated: true
        })
      ).then(store =>
        this.setState({
          store,
          storeCreated: true
        })
      );
      SplashScreen.hide()
    }

    componentWillUnmount() {
      RNLanguages.removeEventListener("change", this._onLanguagesChange);
    }

    _onLanguagesChange = ({ language }) => {
      i18n.locale = language;
    };

    render() {
      if (!this.state.storeCreated) {
        //|| !this.state.storeRehydrated
        return <LaunchView />;
      }

      return (
        <Provider store={this.state.store}>
          <App />
        </Provider>
      );
    }
  }

  return Root;
}

module.exports = setup;
