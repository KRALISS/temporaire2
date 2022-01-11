import React, { Component } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Alert,
  SafeAreaView,
  Image,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
import _ from "lodash";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import { reqRefillsInit, reqRefillsMe } from "../../../reducers/refills";
import { reqInitSendInvoice, reqSendInvoice } from '../../../reducers/sendInvoice';
import Loader from "../../../components/loader/Loader";
import KralissPrevDeleteCell from "../../../components/kralissListCell/KralissPrevDeleteCell";
import { API_URL } from "../../../utils/config";

export default class InvoicesView extends Component {
  constructor(props) {
    super(props);
    this.state = { notifyOn: false, arrInvoice: null };
  }

  componentDidMount = async () => {
    this.props.reqRefillsMe();
  };

  componentDidUpdate = (prevProps, prevState) => {
    let { payLoad, error, payloadSend, errorSend } = this.props;
    if (payLoad !== undefined) {
      this.props.reqRefillsInit();
      this.setState({ arrInvoice: payLoad });
    }
    if (error !== undefined && error.length > 0) {
      this.props.reqRefillsInit();
      console.log(error);
    }

    if(payloadSend !== null && prevProps.payLoad !== payloadSend) {
      this.props.reqInitSendInvoice();
      Alert.alert(
        i18n.t('invoice.sendSuccessTitle'),
        i18n.t('invoice.sendSuccessDesc'),
      )
    }
    if(errorSend !== null && prevProps.errorSend !== errorSend) {
      this.props.reqInitSendInvoice();
      Alert.alert(
        i18n.t('invoice.sendFailTitle'),
        i18n.t('invoice.sendFailDesc'),
      )
    }
  };

  getFileName = filePath => {
    const _arrPath = _.split(filePath, "/");
    if (_arrPath.length > 0) {
      return _arrPath[_arrPath.length - 1];
    }
    return "";
  };

  onPressPreview = invoice => {
    this.props.navigation.navigate("DocPreview", {
      url: `${API_URL}${invoice.invoice_url}`,
      title: this.getFileName(invoice.invoice_file_name)
    });
  };

  onSendEmail = item => {
    this.props.reqSendInvoice(item.invoice_id);
  }

  render() {

    return (
        <SafeAreaView style={styles.container}>
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader
          title={i18n.t("settings.invoices")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />

        <Text style={[styles.txtDesc, styles.marginCell, styles.marginLR]}>
          {i18n.t("settings.invoices")}
        </Text>
        <FlatList
          style={styles.marginCell}
          data={this.state.arrInvoice}
          renderItem={({ item }) => (
            <KralissPrevDeleteCell
              key={item.invoice_url}
              mainTitle={this.getFileName(item.invoice_file_name)}
              onPreview={() => this.onPressPreview(item)}
              onSendEmail={() => this.onSendEmail(item)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor:'#fff',
    flexDirection: "column",
    flex: 1
  },
  marginCell: {
    marginTop: 20
  },
  marginLR: {
    marginLeft: 20,
    marginRight: 20
  },
  txtDesc: {
    color: "#acacac",
    fontSize: RFPercentage(2.1)
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error } = state.refillsMeReducer;
  const { payload: payloadSend, loading: loadingSend, error: errorSend} = state.sendInvoiceReducer
  return {
    payLoad,
    loading,
    error,
    payloadSend,
    loadingSend,
    errorSend
  };
};

const mapDispatchToProps = {
  reqRefillsInit,
  reqRefillsMe,
  reqInitSendInvoice,
  reqSendInvoice
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoicesView);
