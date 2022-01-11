import React, { Component } from "react";
import {View, Text, NetInfo, Dimensions, StyleSheet} from "react-native";

import i18n from '../../locale/i18n';

const { width, height } = Dimensions.get('window');

export default class OfflineScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected: false,
        }

        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({isConnected});
        });
    }
    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => {
        this.setState({ isConnected });
    }

    render() {
        if(this.state.isConnected === false) {
            return(
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>{i18n.t("offline.noInternet")}</Text>
            </View>
            )
        } else {
            return null
        }
    }

}

const styles = StyleSheet.create({
    offlineContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: width,
      height: height,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      flexDirection: 'row',      
      justifyContent: 'center',
      alignItems: 'center',
    },
    offlineText: { 
      color: '#fff',
      textAlign: 'center',
      width: 0.8*width,
    }
});