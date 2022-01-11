import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {getExchanges} from "../../reducers/exchanges";
import {connect} from "react-redux";


export default class NotificationBadge extends Component{

  constructor(props){
    super(props)
    this.state={
      notifCount:0
    }

  }
  componentDidMount() {}

  render(){
    let count= this.props.payLoad.data ? this.props.payLoad.data.filter(item => item.non_checked > 0 || (item.notification_extra_data && !item.notification_checked)).length : 0
    return(
      count ? <View style={styles.container}>
        <Text style={styles.text}>{count}</Text>
      </View> : null
    )
  }
}


const styles = StyleSheet.create({
  container:{
    height:18,
    width:18,
    borderRadius:9,
    backgroundColor:'red',
    position:'absolute',
    right:5,
    top:0,
    justifyContent:'center',
    alignItems:'center'
  },
  text:{
    fontSize:13,
    color:'white',
    textAlign:'center',
    fontWeight:'bold'
  }

})


const mapStateToProps = state => {
  const { payLoad, loading, error, } = state.exchanges;

  return {
    payLoad,
    loading,
    error,
  };
};

const mapDispatchToProps = {
  getExchanges,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationBadge);
