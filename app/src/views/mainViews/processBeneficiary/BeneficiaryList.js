import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Alert,
  SafeAreaView,
} from "react-native";
import { connect } from "react-redux";

import Swipeable from "react-native-swipeable";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissRectButton from "../../../components/kralissButton/KralissRectButton";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import {RFPercentage} from "react-native-responsive-fontsize";
import KralissListCell from "../../../components/kralissListCell/KralissListCell";
import {
  reqPatchUsersInit,
  reqPatchMyUsers,
  reqPostMyUsers
} from "../../../reducers/patchMyUsers";

export default class BeneficiaryList extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { title, kind } = params.params;
    beneficiaryUsers = [];
    this.state = { title, kind, beneficiaryUsers };
  }

  componentDidMount = () => {
    this.loadBeneficiaryUsers();
  };

  loadBeneficiaryUsers = async () => {
    let beneficiaryUsers = await loadLocalData("myuserBeneficiary");
    if (beneficiaryUsers !== null) {
      this.setState({ beneficiaryUsers });
      //dale- For debug-only, remove the comment below.
      /*this.setState({
        beneficiaryUsers: [
          {
            id: 2,
            username: "3@123.com",
            first_name: "Valerie",
            last_name: "Venirazer",
            myuser_is_business: false,
            myuser_business: null,
            kra_account_id: "2",
            kra_account_number: "1211-1211-5671-6848",
            myuser_international: 80
          }
        ]
      });*/
    } else this.setState({ beneficiaryUsers: [] });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.payLoad !== undefined) {
      const myuserBeneficiary = this.props.payLoad;
      await saveLocalData("myuserBeneficiary", myuserBeneficiary);
      this.props.reqPatchUsersInit();
      this.loadBeneficiaryUsers();
    }

    /*if (this.props.refreshBeneficiary === true) {
      this.props.reqPatchUsersInit();
      this.loadBeneficiaryUsers();
    }*/
  };

  onPressAddingBeneficiary = () => {
    this.props.navigation.navigate("AddBeneficiary", {
      title: this.state.title,
      kind: this.state.kind
    });
  };

  onPressRemove = benUser => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("refillLoader.confirmation"),
        i18n.t("beneficiary.removeConfirmMsg"),
        [
          {
            text: i18n.t("beneficiary.cancel"),
            onPress: () => {}
          },
          {
            text: i18n.t("forgotPassword.validateButton"),
            onPress: () => {
              this.props.reqPostMyUsers(benUser.email,11);// 11 is the code request to delete beneficiary
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  onPressSelectUser = benUser => {
    this.props.navigation.navigate("PasswdIndentify", {
      title: this.state.title,
      nextNavigate: this.state.kind,
      paramData: benUser
    });
  };

  render() {
    return (
        <SafeAreaView style={styles.container}>
        <WhiteNavHeader
          title={this.state.title}
          onClose={() => this.props.navigation.goBack()}
        />
        <ScrollView
          style={styles.textContainer}
          scrollEnabled={!this.state.isSwiping}
        >
          <View style={styles.swipeCell}>
            <Text style={styles.txtSectionTitle}>
              {i18n.t("beneficiary.pleaseSelect")}
            </Text>
          </View>
          {this.state.beneficiaryUsers.map(benUser => {
            return (
              <Swipeable
                style={styles.swipeCell}
                key={benUser.id}
                onSwipeStart={() => this.setState({ isSwiping: true })}
                onSwipeRelease={() => this.setState({ isSwiping: false })}
                rightButtons={[
                  <TouchableOpacity
                    style={styles.rightSwipeItem}
                    onPress={() => this.onPressRemove(benUser)}
                  >
                    <Text style={styles.txtRightSwipeItem}>
                      {i18n.t("beneficiary.remove")}
                    </Text>
                  </TouchableOpacity>
                ]}
              >
                <KralissListCell
                  key={benUser.id}
                  mainTitle={
                    benUser.typeAccount == "/api/type_accounts/2"
                      ? benUser.companyName
                      : `${benUser.firstName} ${benUser.lastName}`
                  }
                  subTitle={benUser.kra_account_number}
                  hasClosure="true"
                  onSelect={() => this.onPressSelectUser(benUser)}
                />
              </Swipeable>
            );
          })}
        </ScrollView>

        <KralissRectButton
          style={styles.buttonContainer}
          enabled={true}
          onPress={this.onPressAddingBeneficiary}
          title={`+ ${i18n.t("beneficiary.addNewBeneficiary")}`}
        />
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff"
  },
  textContainer: {
    flexDirection: "column",
    flex: 1
  },
  swipeCell: {
    borderBottomWidth: 0.5,
    borderColor: "#6666",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.05
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    backgroundColor: "red"
  },
  txtRightSwipeItem: {
    color: "#fff",
    fontSize: RFPercentage(1.8)
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0),
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20
  },
  buttonContainer: {
    height: 60,
    width: "100%",
  }
});

const mapStateToProps = state => {
  
  const { payLoad, loading, error } = state.postBenefReducer;

  return {
    payLoad,
    loading,
    error,
    
  };
};

const mapDispatchToProps = {
  reqPatchUsersInit,
  reqPatchMyUsers,
  reqPostMyUsers
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(BeneficiaryList);
