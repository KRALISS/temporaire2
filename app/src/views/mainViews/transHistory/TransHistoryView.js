import React, {Component} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import {NavigationEvents} from 'react-navigation';
import {connect} from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
import _ from "lodash";
import moment from "moment";
import {getStatusBarHeight} from "react-native-status-bar-height";

import HorzGradientView from "../../../components/gradientView/HorzGradientView";
import i18n from "../../../locale/i18n";
import {loadLocalData,saveLocalData, saveUserInfo} from "../../../utils/localStorage";
import {reqLastTransaction, reqLastTransactionInit, searchTransaction, searchTransactionInit} from "../../../reducers/lastTransaction";

import {reqMoneyAccountMe, reqInitMoneyAccountMe} from "../../../reducers/accountsMe";

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';


function MergeRowsWithHeaders(obj1, obj2) {

  for (var p in obj2) {
    if (obj1[p] instanceof Array && obj1[p] instanceof Array) {
      obj1[p] = obj1[p].concat(obj2[p]);
    } else {
      obj1[p] = obj2[p];
    }
  }

  return obj1;
}

export default class TransHistoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      perPage : 10,
      stickHeaderHeight: 0,
      txtSearch: "",
      bSearch: false,
      myUnit: "",
      myConversionRate: 1,
      myBalance: 0,
      paginationStatus: "firstLoad",
      pageNo: 0,
      isRefreshing: false,
      callback: null,
      arrOriginalData: [],
      arrSections: [],
      bFromChildView: false,
      stopper:false,
      kraKycLevel: 0,
      accountIdAPI:"",
      stickerHeaderGuarantee:50,
      allInternationals:[]
    };
  }

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("beneficiary.fault"),
        errorMsg,
        [
          {
            text: i18n.t("passwdIdentify.return"),
            onPress: () => {}
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  groupingData = arrData => {
    return _.chain(arrData)
      .groupBy(function(data) {
        return moment(data.transaction_date_created)
          .startOf("day")
          .format();
      })
      .toPairs()
      .map(function(items, aKey) {
        return { title: items[0], data: items[1] };
      })
      .orderBy(["title"], ["desc"])
      .value();
  };

  loadUserInfo = async ()=>{
    try {
      const lastName = await loadLocalData("lastName");
      const firstName = await loadLocalData("firstName");
      const accountIdAPI = await loadLocalData("kraAccountIdAPI");
      let companyName = await loadLocalData["companyName"];
      if (companyName === null) companyName = "";
      const myuserInternational = await loadLocalData("myuserInternational");
      const kraKycLevel = await loadLocalData('kraKycLevel');
      this.setState({
        myUnit: myuserInternational["currencyCode"],
        myConversionRate:1,//achanger
        lastName,
        firstName,
        accountIdAPI,
        companyName,
        kraKycLevel
      });
    } catch (error) {
      this.showErrorAlert(error.message);
    }
  }

  async componentDidMount() {
    this.props.navigation.addListener("willFocus", async route => {
      KYCWarning = await loadLocalData("kraKycWarning");   
      kraKycLevel = await loadLocalData("kraKycLevel");
      this.setState({KYCWarning,kraKycLevel});
    });

    const allInternationals = await loadLocalData("allInternationals");
    this.setState({allInternationals:allInternationals});
    this.loadUserInfo();
    //this.props.navigation.addListener("willFocus", async route => {
      const accountAPI = await loadLocalData("accountAPI");
      this.setState({accountAPI});
      this.props.reqMoneyAccountMe(accountAPI);
      this.setState({stopper: false})
      if (this.state.bFromChildView) {
        this.setState({ bFromChildView: false });
        return;
      }
      //tab changed

      this.setPage(0);
      this.setState({
        paginationStatus: "firstLoad",
        arrSections: [],
        arrOriginalData: []
      });
      this.onFetchTransHistory(this.getPage(), this.postRefresh, {
        firstLoad: true
      });
    //});
  }

  async componentDidUpdate(prevProps, prevState) {
    console.log("1");
    let { payLoad, error, accountsMeData, searchPayload, errorSearch } = this.props;
    
    if(accountsMeData && accountsMeData.accountApiMoney !== undefined && this.state.kraKycLevel != 0 && this.state.myBalance != accountsMeData.balanceAdvertiser){
      const {balanceAdvertiser,accountApiMoney,kvcLevelApiMoney} = accountsMeData;
      await saveLocalData("kraBalance",balanceAdvertiser);
      await saveLocalData("accountApiMoney",accountApiMoney);
      //await saveLocalData("kraKycLevel",kvcLevelApiMoney);

      this.setState({
        myBalance:balanceAdvertiser,
      })


    }


    if (payLoad !== undefined && prevProps.payLoad !== payLoad) {
      await this.props.reqLastTransactionInit();
      let temporaryArray = [];
      for(let i = 0; i < payLoad.length; i++) {
        if(payLoad[i]["transactionType"] !== undefined && payLoad[i]["transactionType"] !==  "/api/type_transactions/6") {
          temporaryArray.push(payLoad[i])
        }
      }
      const arrOriginalData = [...this.state.arrOriginalData, ...temporaryArray];
      this.setState({ arrOriginalData });
      let groups = this.groupingData(arrOriginalData); //make new group
      let options = {};
      if (this.state.pageNo >= Math.floor(payLoad.count/this.state.perPage) - 1 ) options = { allLoaded: true };
      this.state.callback(groups, options);
    }
    if (error !== undefined && error.length > 0) {
      this.props.reqLastTransactionInit();
      this.showErrorAlert(this.props.error);
    }
    if(searchPayload !== prevProps.searchPayload && this.state.txtSearch !== "") {
      let temporaryArray = [];
      for(let i = 0; i < searchPayload.length; i++) {
        if(searchPayload[i]["transactionType"] !== undefined) {
          temporaryArray.push(searchPayload[i])
        }
      }
      let groups = this.groupingData(temporaryArray); //make new group
      let options = {};
      if (this.state.pageNo >= Math.floor(searchPayload.count/this.state.perPage) - 1 ) options = { allLoaded: true };
      this.state.callback(groups, options);
      //  this.setState({ arrSections: groups });
    }
    if(errorSearch && errorSearch.length > 0) {
      this.props.searchTransactionInit()
      this.showErrorAlert(this.props.error)
    }
  }

  onFetchTransHistory = (page = 0, callback, options) => {
    // this.props.reqLastTransaction(page * 10, page * 10 + 10);
    this.props.reqLastTransaction(page + 1, this.state.perPage);
    this.setState({ callback: callback });
  };
  onPressTableRow = item => {
    const{ myUnit,allInternationals} = this.state;
    const senderCountry = allInternationals[parseInt(item.currencyStart.split('/').pop())];
    const senderUnit = senderCountry.currencyCode;
    const receiverCountry = allInternationals[parseInt(item.currencyEnd.split('/').pop())];
    const receiverUnit = receiverCountry.currencyCode;
    this.setState({ bFromChildView: true });
    if(item.transactionType !== "SPONSOR") {
      this.props.navigation.navigate("HistoryDetail", { data: item ,accountIdAPI:this.state.accountIdAPI,senderUnit,receiverUnit});
    }
  };

  onPressSearch = () => {
    let { bSearch } = this.state;
    bSearch = !bSearch;
    this.setState({ bSearch, arrSections: [], isRefreshing: false, paginationStatus: "allLoaded"});
    if (!bSearch) {
      const arrGrouped = this.groupingData(this.state.arrOriginalData);
      this.setState({ arrSections: arrGrouped, isRefreshing: false, paginationStatus: "waiting", txtSearch: "" });
    }
  };

  onChangeSearchText = txtValue => {
    this.setState({ txtSearch: txtValue, arrSections: [] }, () => {
      if (this._throttleTimeout) {
        clearTimeout(this._throttleTimeout);
      }

      this._throttleTimeout = setTimeout(
        () =>{ 
          this.searchHistory(txtValue);
          this.setState({paginationStatus: "firstLoad"})
        },
        500
      );
    });
  };

  searchHistory = term => {
    this.props.searchTransaction(term)
    // const arrFiltered = this.state.arrOriginalData.filter(item => {
    //   const field1 = item.kra_transaction_total_amount;
    //   const field2 = item.kra_transaction_total_converted_amount;
    //   const field3 = item.kra_transaction_amount;
    //   const field4 = item.transaction_receiver_name;
    //   const field5 = item.transaction_sender_name;

    //   let field6;
    //   if(term.includes('/')){
    //     const isComplete = term.split("/");
    //     if(isComplete.length > 2) {
    //       field6 = moment(item.transaction_date_created).format("DD/MM/YYYY");
    //     } else {
    //       field6 = moment(item.transaction_date_created).format("MM/YYYY");
    //     }
    //   }

    //   let arrSearchField = [];
    //   if (field1 !== undefined) arrSearchField.push(field1);
    //   if (field2 !== undefined) arrSearchField.push(field2);
    //   if (field3 !== undefined) arrSearchField.push(field3);
    //   if (field4 !== undefined) arrSearchField.push(field4);
    //   if (field5 !== undefined) arrSearchField.push(field5);
    //   if (field6 !== undefined) arrSearchField.push(field6);

    //   const searchTxt = term.toLowerCase();
    //   const filtered = arrSearchField.filter(
    //     item => item.toLowerCase().indexOf(searchTxt) > -1
    //   );
    //   if (filtered.length > 0) return true;
    //   return false;
    // });

    // const arrGrouped = this.groupingData(arrFiltered);
    // this.setState({ arrSections: arrGrouped });
  };

  getRows = () => {
    return [...this.state.arrSections];
  };

  getPage = () => {
    return this.state.pageNo;
  };

  setPage = pageNo => {
    return this.setState({ pageNo });
  };

  postRefresh = (rows = [], options = {}) => {
    this.updateRows(rows, options);
  };

  postPaginate = (rows = [], options = {}) => {
    this.setPage(this.getPage() + 1);
    //var mergedRows = null;
    //let arrRows = this.getRows()
    //mergedRows = MergeRowsWithHeaders(arrRows, rows);
    this.updateRows(rows, options);
  };

  updateRows = (rows = [], options = {}) => {
    if (rows !== null) {
      this.setState({
        arrSections: [...rows],
        isRefreshing: false,
        paginationStatus: options.allLoaded === true ? "allLoaded" : "waiting"
      });
    } else {
      this.setState({
        isRefreshing: false,
        paginationStatus: options.allLoaded === true ? "allLoaded" : "waiting"
      });
    }
  };

  paginationFetchingView = () => {
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

  paginationWaitingView(paginateCallback) {
    return (
      <TouchableHighlight
        underlayColor="#c8c7cc"
        onPress={this.onPaginate}
        style={customStyles.paginationView}
      >
        <Text style={customStyles.actionsLabel}>Load more</Text>
      </TouchableHighlight>
    );
  }

  onPaginate = () => {
    if (this.state.paginationStatus === "allLoaded") {
      return null;
    } else {
      this.setState({
        paginationStatus: "fetching"
      });
      this.onFetchTransHistory(this.getPage() + 1, this.postPaginate, {});
    }
  };

  onRefresh = (options = {}) => {
    this.setState({
      isRefreshing: true
    });
    this.setPage(0);
    this.props.onFetch(this.getPage(), this.postRefresh, options);
  };

  renderPaginationView = () => {
    if (
      this.state.paginationStatus === "fetching" ||
      this.state.paginationStatus === "firstLoad"
    ) {
      return this.paginationFetchingView();
    } else if (this.state.paginationStatus === "waiting") {
      return this.paginationWaitingView();
    } else if (this.state.paginationStatus === "allLoaded") {
      return this.paginationAllLoadedView();
    } else {
      return null;
    }
  };

  renderRowView = ({ item, index, section }) => {
    let typeIcon = require("../../../assets/images/refund_thin.png"); //default refund
    let mainTitle = "",
      subTitle = "";
    let mainAmount = "",
      subAmount = "",
      otherUnitAmount = "";
    let bPlus = false;
  
    const{ myUnit,allInternationals} = this.state;
    const senderCountry = allInternationals[parseInt(item.currencyStart.split('/').pop())];
    const senderUnit = senderCountry.currencyCode;
    const receiverCountry = allInternationals[parseInt(item.currencyEnd.split('/').pop())];
    const receiverUnit = receiverCountry.currencyCode;

    const kra_transaction_total_amount = 0;

    /*if (item.transactionType === "SPONSOR") {
      typeIcon = require("../../../assets/images/user-thin.png");
      bPlus = true;
      mainTitle = i18n.t("transHistory.sponsorTitle");
      subTitle = i18n.t("transHistory.sponsor");
      let amount = (item.amount * 1)//item.transaction_sender_conversion_rate).toFixed(2) achanger
      mainAmount = `+ ${amount} ${
        senderUnit
      }`;
      if(senderUnit !== receiverUnit) {
        let amountConverted = (item.amount * 1) // item.transaction_receiver_conversion_rate).toFixed(2)achanger
        otherUnitAmount = `+ ${amountConverted} ${
          item.currencyEnd
        }`;
      }
      subAmount = `+ ${(parseFloat(item.amount)).toFixed(2)}`
    }*/

    if (item.transactionType === "/api/type_transactions/7" || item.transactionType ==="/api/type_transactions/8") { //money_refill or cash_in
      typeIcon = require("../../../assets/images/credit_account_grey.png");
      bPlus = true;
      mainTitle = i18n.t("transHistory.recharge");
      subTitle = i18n.t("transHistory.recharge");
      mainAmount = `+ ${item.amount} ${
        senderUnit
      }`;
      subAmount = `+ ${item.amount}`;
    }

    if (item.transactionType === "/api/type_transactions/4") {
      subTitle = i18n.t("transHistory.refund");
      if (this.state.companyName === "") {
        mainTitle = this.state.companyName;
      } else {
        mainTitle = `${this.state.firstName} ${this.state.lastName}`;
      }
      mainAmount = `- ${item.amount} ${
        senderUnit
      }`;
      subAmount = `- ${kra_transaction_total_amount}`;
    }
    if (
      item.transactionType === "/api/type_transactions/1" || // mobile_payment
      item.transactionType === "/api/type_transactions/5"  // sending_money
    ) {
      if (
        senderUnit !==
        receiverUnit
      ) {
        //default receive:
        let unit = senderUnit;
        let conversionRate = 1;
        if (item.transactionType === "SENT") {
          unit = receiverUnit;
          conversionRate = 1;
        }
        if (item.transactionType === "RECEIVED") {
          unit = senderUnit;
          conversionRate = 1
        }
        let otherAmount =
          parseFloat(item.amount) * conversionRate;
        otherUnitAmount = `${otherAmount.toFixed(2)} ${unit}`;
      }

      if (item.senderWallet === this.state.accountIdAPI) { // money sent
        bPlus = false;
        //
        let transAmount =
          parseFloat(item.amount) *
          1;
        mainTitle = item.receiverFullName;
        subTitle = i18n.t("transHistory.send");
        mainAmount = `- ${transAmount.toFixed(2)} ${
          senderUnit
        }`;
        subAmount = `- ${item.amount}`;
      } else {
        let transAmount =
          parseFloat(item.amount) *
          1;
        bPlus = true;
        mainTitle = item.senderFullName;
        subTitle = i18n.t("transHistory.receive");
        mainAmount = `+ ${transAmount.toFixed(2)} ${
          receiverUnit
        }`;
        subAmount = `+ ${item.amount}`;
      }

      if (item.transactionType === "/api/type_transactions/1") { // paiment mobile par qrCode
        typeIcon = require("../../../assets/images/payer_thin.png");
        if(item.senderWallet === this.state.accountIdAPI) {
          subTitle = i18n.t("transHistory.payment");
        } else {
          subTitle = i18n.t("transHistory.collection");
        }
      } else {
        typeIcon = require("../../../assets/images/envoyer_thin.png");
      }
    }


    return (
      <TouchableHighlight
        style={customStyles.row}
        underlayColor="#fff"
        onPress={() => this.onPressTableRow(item)}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <View
            style={{
              width: 45,
              height: 45,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image source={typeIcon} />
          </View>

          <View style={{ flex: 1.5, marginLeft: 10 }}>
            <Text style={customStyles.rowMainTitle}>{mainTitle}</Text>
            <Text style={customStyles.rowSubTitle}>{subTitle}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-end" }}>
            <Text
              style={
                bPlus
                  ? customStyles.rowMainTitleHighlighted
                  : customStyles.rowMainTitle
              }
            >
              {mainAmount}
            </Text>
            {otherUnitAmount !== "" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ marginRight: 5, marginTop: 5 }}
                  source={require("../../../assets/images/arrow.png")}
                />
                <Text style={customStyles.rowSubTitle}>{otherUnitAmount}</Text>
              </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "center", }}>
              <Text style={customStyles.rowSubTitle}>{subAmount}</Text>
              <Image
                style={{ marginLeft: 5, marginTop: 5 }}
                source={require("../../../assets/images/kraliss_logo_grey.png")}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderSectionHeaderView = ({ section: { title } }) => {
    const dateTime = moment(title).format("DD/MM/YYYY");
    return (
      <View style={customStyles.header}>
        <Text style={customStyles.headerTitle}>{dateTime}</Text>
      </View>
    );
  };

  renderStickyHeader = ballance => {
    return (
      <View
        key="sticky-header"
        style={{
          height: hp(10),
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <HorzGradientView
          style={{
            flex: 1,
            width: "100%"
          }}
        >
          <Text style={styles.stickyHeaderTitle}>
            {`${ballance.toFixed(2)} ${this.state.myUnit}`}
          </Text>
        </HorzGradientView>
      </View>
    );
  };
  measureView(event) {
    // console.log('event peroperties: ', event.nativeEvent.layout.width);
    this.setState({
      parallaxForegroundWidth: event.nativeEvent.layout.width,
      parallaxForegroundHeight: event.nativeEvent.layout.height
    })
  }

  renderParallaxForeground = (statusBarHeight, ballance) => {
    const {kraKycLevel} = this.state;
    let bDisplayExplain = false;
    if(kraKycLevel < 2) {
      bDisplayExplain = true;
    }
    return (
      <HorzGradientView key="parallax-header">
        <View onLayout={(event) => this.measureView(event)} style={{}}>
          {this.state.bSearch && (
            <View
              style={{
                flexDirection: "row",
                marginTop: statusBarHeight,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <TouchableHighlight
                style={{
                  height: 45,
                  marginLeft: 5,
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onPress={this.onPressSearch}
              >
                <Image source={require("../../../assets/images/chevron.png")} />
              </TouchableHighlight>
              <View
                style={{
                  height: 45,
                  marginLeft: 10,
                  borderRadius: 25,
                  backgroundColor: "#ffffff80",
                  flex: 1
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    height: 45,
                    marginLeft: 10,
                    color: "#fff"
                  }}
                  editable={true}
                  placeholderTextColor="#fff"
                  placeholder={i18n.t("transHistory.search")}
                  value={this.state.txtSearch}
                  onChangeText={this.onChangeSearchText}
                />
              </View>
            </View>
          )}
          {!this.state.bSearch && (
            <View
              style={{
                marginTop: statusBarHeight,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{
                  width: 45,
                  height: 45
                }}
                source={require("../../../assets/images/symbol_kraliss.png")}
              />
              <TouchableOpacity
                style={styles.navBarSearchBtn}
                onPress={() => this.onPressSearch()}
              >
                <Image
                  style={{
                    width: 19,
                    height: 19
                  }}
                  source={require("../../../assets/images/search.png")}
                />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              marginTop: 20,flex:1,
              // height: 120
            }}>
            <Text style={styles.headerDesc}>
              {i18n.t("transHistory.yourBalance")}
            </Text>
            <Text style={styles.headerBalance}>
              {`${ballance.toFixed(2)} ${this.state.myUnit}`}
            </Text>
            <View style={styles.headerMoneyInfo}>
              <Text style={styles.headerDesc}>
                {`${i18n.t("sendMoney.thats")} ${this.state.myBalance.toFixed(
                  2
                )}`}
              </Text>
              <View style={{marginLeft: 5}}>
                <Image
                  style={{
                    flex: 1,
                    // marginTop: 2,
                    aspectRatio: 1,
                  }}
                  resizeMode={'stretch'}
                  source={require("../../../assets/images/kraliss_logo_grey.png")}
                />
              </View>
            </View>
          </View>
          {bDisplayExplain && (
            <View style={{
              justifyContent: 'center',
            }}>
              <Text
                style={[
                  styles.txtDesc,
                  styles.marginSection,
                  styles.marginLR,]
                }
              >
                {this.state.KYCWarning}
              </Text>
            </View>
          )}
        </View>
      </HorzGradientView>
    );
  };

  render() {
    const statusBarHeight = getStatusBarHeight();
    const ballance = this.state.myBalance * this.state.myConversionRate;
    return (
      
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() =>  {this.props.reqMoneyAccountMe(this.state.accountAPI);  this.props.reqLastTransaction(1, 1)}} />
        {this.state.stickHeaderHeight > 0 && this.renderStickyHeader(ballance)}
        <SectionList
          renderItem={this.renderRowView}
          renderSectionHeader={this.renderSectionHeaderView}
          sections={this.state.arrSections}
          keyExtractor={(item, index) => item + index}
          ListFooterComponent={this.renderPaginationView}
          ListHeaderComponent={
            this.state.stickHeaderHeight > 0
              ? null
              : this.renderParallaxForeground(statusBarHeight, ballance)
          }
          onScroll={event => {
            // console.log("index",event.nativeEvent.contentOffset.y)
            if (
              event.nativeEvent.contentOffset.y <= 0 &&
              this.state.stickHeaderHeight > 0
            )
              this.setState({ stickHeaderHeight: 0 });
            else if (
              event.nativeEvent.contentOffset.y > this.state.parallaxForegroundHeight + this.state.stickerHeaderGuarantee &&
              this.state.stickHeaderHeight === 0
            )
              this.setState({ stickHeaderHeight: 50 + statusBarHeight });
          }}
          // onEndReachedThreshold={0.5}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd > 150) {
              //this.onPaginate();
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff"
  },
  stickyHeaderTitle: {
    marginTop: 30,
    textAlign: "center",
    color: "#fff",
    fontSize: RFPercentage(4.0)
  },
  navBarSearchBtn: {
    width: 45,
    height: 45,
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  headerBalance: {
    marginTop: 10,
    color: "#fff",
    fontSize: RFPercentage(4.0)
  },
  headerDesc: {fontSize: RFPercentage(2.0), color: "#fff",},
  headerMoneyInfo: {
    marginTop: 10,
    flexDirection: "row",
    // justifyContent:'center',
    alignItems: 'center'
  },
  marginLR: {
    // marginLeft: 5,
    // marginRight: 5
  },
  txtDesc: {
    color: "#DC143C",
    flex: 1,
    fontSize: RFPercentage(1.8)
  },
  marginSection: {
    // marginBottom: 10
  }
});

const customStyles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#00000000"
  },
  refreshableView: {
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  actionsLabel: {
    fontSize: 15,
    color: "#007aff"
  },
  paginationView: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  defaultView: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  defaultViewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15
  },
  row: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    backgroundColor: "#fff"
  },
  rowMainTitle: {
    color: "#000",
    fontSize: RFPercentage(2.1),
    marginTop: 5
  },
  rowMainTitleHighlighted: {
    color: "#00aca9",
    marginTop: 5,
    fontSize: RFPercentage(2.1)
  },
  rowSubTitle: {
    fontSize: RFPercentage(2.0),
    marginTop: 5,
    color: "#acacac"
  },
  header: {
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10
  },
  headerTitle: {
    color: "#acacac",
    fontSize: RFPercentage(2.0)
  }
});
 
const mapStateToProps = state => {
  const { payLoad: accountsMeData } = state.accountsMeReducer;
  const { payLoad, loading, error, searchPayload, searchLoading, errorSearch} = state.lastTransactionReducer;

  return {
    accountsMeData,
    payLoad,
    loading,
    error,
    searchPayload,
    searchLoading,
    errorSearch
  };
};

const mapDispatchToProps = {
  reqLastTransactionInit,
  reqLastTransaction,
  reqMoneyAccountMe,
  reqInitMoneyAccountMe,
  searchTransaction,
  searchTransactionInit
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransHistoryView);
