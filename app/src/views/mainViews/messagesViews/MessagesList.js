import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

import KralissListCell from "../../../components/kralissListCell/KralissListCell";

import newMessage from "../../../assets/images/edit.png";
import search from "../../../assets/images/search_gray.png";

import i18n from "../../../locale/i18n";

import { reqConfirmGodfather, reqInitConfirmGodfather } from "../../../reducers/confirmGodfather";
import {
  getExchanges,
  getExchangesInit,
  getItem,
  searchExchanges,
  searchExchangesInit
} from "../../../reducers/exchanges";

export default class MessagesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchActive: false,
      searchKeyword: "",

      originalArrayData: props.payLoad.data ? props.payLoad.data : [],

      pageNo: 1,
      isLoadingMore: false,

      flatListData: [],
      godfatherStatus: "",
    };
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { payLoad, confirmGodfather, searchResultsData } = this.props;
    if (prevProps.payLoad !== payLoad) {
      this.displayContent(payLoad)
    }

    // SEARCH HANDLER
    if(prevProps.searchResultsData !== searchResultsData) {
      this.displayContent(searchResultsData)
    }

    //GOD FATHER RESPONSE HANDLER
    if (prevProps.confirmGodfather !== confirmGodfather) {
      this.props.reqInitConfirmGodfather();
      const desc =
        this.state.godfatherAsking === "denied"
          ? i18n.t("home.askConfirmationDescDenied")
          : i18n.t("home.askConfirmationDesc");
      setTimeout(() => {
        Alert.alert(i18n.t("home.askConfirmation"), desc);
      }, 500);
    }
    if (prevProps.errorGodfather !== this.props.errorGodfather) {
      this.props.reqInitConfirmGodfather();
      setTimeout(() => {
        Alert.alert(
          i18n.t("home.askConfirmationError"),
          i18n.t("home.askConfirmationErrorDesc")
        );
      }, 500);
    }
  }

  displayContent = (payLoad) => {
    let data = [];
    for (let i in payLoad.data) {
      if (payLoad?.data[i]?.topic_messages) {
        payLoad?.data[i]?.topic_messages?.sort((a, b) => b.id - a.id);
      }
      if (payLoad?.data[i]?.topic_messages) {
        data.push({
          id: payLoad?.data[i]?.id,
          date: payLoad?.data[i]?.topic_messages[0]?.created_at,
        });
      } else {
        data.push({
          id: payLoad?.data[i]?.id,
          date: payLoad?.data[i]?.created_at,
        });
      }
    }
    data?.sort((a, b) => moment(b.date) - moment(a.date));
    let orderData = [];
    for (let i in data) {
      for (let j in payLoad.data) {
        if (payLoad.data[j].id === data[i].id) {
          orderData.push(payLoad.data[j]);
        }
      }
    }
    this.setState({ isLoadingMore: false, flatListData: orderData });
    if (payLoad.data?.length === payLoad.count) this.setState({ pageNo: 1 });
  }

  cellOnSelectFunction = (item) => {
    this.setState({ pageNo: 1 });
    // If topic
    if (item?.author_name) {
      this.props.getItem(false, item?.id); // if not read, do request for backend to change to read
      this.props.navigation.navigate("ChatView", {
        messageObject: item,
        index: item.id,
      });
      return;
    }

    //Select extra data from notification (can be string or object)
    const { notification_extra_data } = item;
    const extraData =
      typeof notification_extra_data !== "string"
        ? notification_extra_data
        : JSON.parse(notification_extra_data);

    //SEND_RESPONSE => Paiement recu | Go to transaction page.
    //REQUEST_ASK => Demande d'argent | Go to confirm page or go to history if checked/Denied/Accepted
    //GODFATHER_ASK => Demande de parrainage | Popup de demande or go to chat...
    this.props.getItem(true, item.id);
    // if (extraData.type === "SEND_RESPONSE") {
    //   this.props.navigation.navigate("TransHistory");
    // }
    if (extraData.type === "REQUEST_ASK") {
      if (!item.notification_checked) {
        this.props.navigation.navigate("ConfirmAsk", { extraData });
        return;
      }
    }
    if (extraData.type === "GODFATHER_ASK" && !item.notification_checked) {
      this.godfatherAsking(extraData);
      return;
    }
    this.props.navigation.navigate("NotificationsDetails", { item });
  };

  godfatherAsking = (data) => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("home.askGodfather"),
        i18n.t("home.askGodfatherDesc", {
          name: data.first_name,
          lastname: data.last_name,
        }),
        [
          {
            text: i18n.t("home.askGodfatherCancel"),
            onPress: () => {
              this.setState({ godfatherStatus: "denied" });
              this.props.reqConfirmGodfather("declined");
            },
            style: "cancel",
          },
          {
            text: i18n.t("home.askGodfatherConfirm"),
            onPress: () => this.props.reqConfirmGodfather(data.email),
          },
        ],
        { cancelable: false }
      );
    }, 100);
  };

  paginationLoadMore = () => {
    const { pageNo, isSearchActive } = this.state;
    this.setState({ isLoadingMore: true });
    if(isSearchActive) {
      this.props.searchExchanges(this.state.searchKeyword, pageNo + 1, 10)
    } else {
      this.props.getExchanges(pageNo + 1, 10);
    }
    this.setState({ pageNo: pageNo + 1 });
  };

  // RENDER LIST CELL
  renderItem = ({ item, index }) => {
    const title = item.notification_title || item.name;
    getDate = () => {
      if (item.notification_title)
        return String(moment(item.created_at).format("DD/MM/YYYY HH:mm"));
      item.topic_messages.sort((a, b) => b.id - a.id);
      return String(
        moment(item.topic_messages[0].created_at).format("DD/MM/YYYY HH:mm")
      );
    };
    isUnread = () => {
      if (item.non_checked === 0 || item.notification_checked) return "normal";
      return "bold";
    };

    return (
      <KralissListCell
        key={index}
        mainTitle={title}
        subTitle={getDate()}
        hasClosure="true"
        subTitleTextStyle={{ fontWeight: isUnread() }}
        mainTitleTextStyle={{ fontWeight: isUnread() }}
        onSelect={() => {
          this.cellOnSelectFunction(item, index);
        }}
      />
    );
  };

  // RENDER FOOTER OF FLATLIST
  renderPaginationView = () => {
    const { flatListData, isLoadingMore } = this.state;
    if (isLoadingMore) return this.paginationLoadingMessageView();
    if (
      flatListData.length === this.props.payLoad.count ||
      flatListData.length === this.props.searchResultsData.count ||
      flatListData.length === 0
    ) {
      return this.paginationAllLoadedView();
    } else {
      return this.paginationLoadMoreView();
    }
  };

  paginationLoadMoreView() {
    return (
      <TouchableHighlight
        underlayColor="#c8c7cc"
        onPress={this.paginationLoadMore}
        style={customStyles.paginationView}
      >
        <Text style={customStyles.actionsLabel}>Load more</Text>
      </TouchableHighlight>
    );
  }

  paginationLoadingMessageView = () => {
    return (
      <View style={customStyles.paginationView}>
        <ActivityIndicator animating={true} size="small" color={"#00768b"} />
      </View>
    );
  };

  paginationAllLoadedView = () => {
    return (
      <View style={customStyles.paginationView}>
        <Text style={customStyles.actionsLabel}>~</Text>
      </View>
    );
  };

  emptyExchangesView = () => {
    return (
      <View
        style={{
          alignItems: "center",
          marginTop: 5,
          fontSize: RFPercentage(2.5)
        }}
      >
        <Text>{i18n.t("messages.emptyMessageText")}</Text>
      </View>
    );
  };

  render() {
    let { isSearchActive, flatListData } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <SafeAreaView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
          }}
        />

        <View style={styles.navContainer}>
          <StatusBar backgroundColor="#fff" barStyle={"dark-content"} />
          <View style={styles.navigationBar}>
            {!isSearchActive && (
              <>
                <View style={styles.textWrapper}>
                  <Text numberOfLines={2} style={styles.txtTitle}>
                    {i18n.t("messages.messages")}
                  </Text>
                </View>
                <View
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 0,
                    height: 45,
                    width: 80,
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={styles.rightButton}
                    onPress={() => {
                      this.setState({ pageNo: 1, isSearchActive: true, flatListData: [] });
                      setTimeout(() => {
                        Alert.alert(i18n.t("messages.remarkTItle"), i18n.t("messages.remarkDesc"));
                      }, 100);
                    }}
                  >
                    <Image source={search} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rightButton}
                    onPress={() => {
                      this.setState({ pageNo: 1 });
                      this.props.navigation.navigate("NewMessage");
                    }}
                  >
                    <Image source={newMessage} />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {isSearchActive && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingVertical: 1,
                }}
              >
                <TouchableHighlight
                  style={{
                    height: 30,
                    marginLeft: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                      this.setState({ pageNo: 1, isSearchActive: false, searchKeyword: ""})
                      this.props.getExchangesInit();
                      this.props.getExchanges(1, 10);
                    }
                  }
                >
                  <Image
                    source={require("../../../assets/images/gray_chevron.png")}
                  />
                </TouchableHighlight>
                <View
                  style={{
                    height: 40,
                    marginLeft: 10,
                    marginRight: 10,
                    borderRadius: 25,
                    backgroundColor: "#ffffff80",
                    flex: 1,
                    borderColor: "gray",
                    borderWidth: 1,
                  }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      height: 45,
                      marginLeft: 10,
                      color: "gray",
                    }}
                    editable={true}
                    placeholderTextColor="gray"
                    placeholder={i18n.t("transHistory.search")}
                    value={this.state.searchKeyword}
                    onChangeText={(searchKeyword) =>
                      this.setState({ searchKeyword })
                    }
                    onEndEditing={() => {
                        this.props.searchExchangesInit();
                        this.props.searchExchanges(this.state.searchKeyword, 1, 10)
                      }
                    }
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        <FlatList
          style={{ marginTop: 5 }}
          data={flatListData}
          ListEmptyComponent={this.emptyExchangesView} //GOOD
          ListFooterComponent={this.renderPaginationView} //Remettre le isLoading à False
          ItemSeparatorComponent={() => <View style={styles.separator} />} //GOOD
          renderItem={this.renderItem} //GOOD
        />
        <View style={styles.separator} />
      </SafeAreaView>
    );
  }
}

const customStyles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#00000000",
  },
  refreshableView: {
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  actionsLabel: {
    fontSize: 12,
    color: "#007aff",
  },
  paginationView: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  defaultView: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  defaultViewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
  },
  navContainer: {
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",

    borderBottomWidth: 0.5,
    borderColor: "#6666",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.05,
  },
  separator: {
    borderWidth: 0.5,
    borderColor: "#6666",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.05,
  },
  textWrapper: {
    maxWidth: "80%",
  },
  txtTitle: {
    textAlign: "center",
    color: "#707070",
    fontSize: RFPercentage(2.5)
  },
  rightButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navigationBar: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => {
  const { payLoad, loading, error } = state.exchanges;
  const {
    payload: confirmGodfather,
    error: errorGodfather,
  } = state.confirmGodfatherReducer;

  return {
    payLoad,
    loading,
    error,
    searchResultsData: state.searchResultsExchanges.payLoad,
    searchResultsLoading: state.searchResultsExchanges.loading,
    confirmGodfather,
    errorGodfather,
  };
};

const mapDispatchToProps = {
  getExchangesInit,
  getExchanges,
  searchExchanges,
  searchExchangesInit,
  getItem,
  reqConfirmGodfather,
  reqInitConfirmGodfather,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(MessagesList);
