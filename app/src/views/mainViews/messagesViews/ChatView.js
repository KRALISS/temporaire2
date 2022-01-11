import React, {Component} from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {connect} from "react-redux";
import moment from "moment";
import i18n from "../../../locale/i18n";
import {getAuthToken} from "../../../utils/localStorage";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import sendMessage from "../../../assets/images/send-message.png"
import WebSocketInstance from '../../../utils/WebSocket'
import {getExchanges} from "../../../reducers/exchanges";


export default class ChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index:props.navigation.state.params.index,
      convertedMessageArray:[],
      text:'',
    };
  }


  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {

    if(this.props.messages !== prevProps.messages){
      this.setState({text:''})
      this.groupData(true)
    }
    // this.scrollToIndex(this.state.convertedMessageArray.length-1);
  }

  componentDidMount() {
    this.initSocket();
    this.groupData(true);
  }
  componentWillUnmount(): void {
    WebSocketInstance.close("params")
  }
  scrollToIndex = (sectionIndex) => {
    if(this.state.convertedMessageArray[sectionIndex].data){
        this.scrollView.scrollToEnd({
          animated: true,
        })
    }

  };


  groupData = (reRender) => {

    // let messageObject = this.props.messages.filter(item=> this.state.index === item.id)[0]
    let messageObject = this.props.messages.filter(item=> this.state.index === item.id)[0] || this.props.navigation.state.params.messageObject

    const groups = messageObject.topic_messages.reduce((groups, obj) => {
      const date = obj.created_at.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].unshift(obj);
      groups[date].sort((a,b) => {
        return a.id - b.id
      })
      return groups;
    }, {});


    const convertedMessageArray = Object.keys(groups).map((date) => {
      return {
        date,
        data: groups[date]
      };
    });
    this.setState({
      convertedMessageArray:convertedMessageArray.sort((first,second)=> new Date(first.date) - new Date(second.date))
    })
  };

  initSocket = async () => {
    const token = await getAuthToken();

    this.setState({token})
    this.waitForSocketConnection(() => {
      // WebSocketInstance.initChatUser(token, );
      WebSocketInstance.addCallbacks('new_message',this.addMessage.bind(this))
      // WebSocketInstance.fetchMessages(this.state.token, "tempo", "topic", "message");
    });

    WebSocketInstance.connect()
  };

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (WebSocketInstance.state() === 1) {
          console.log("Connection is made")
          callback();
          return;
        } else {
          console.log("wait for connection...")
          component.waitForSocketConnection(callback);
        }
      }, 100); // wait 100 milisecond for the connection...
  }

  addMessage() {
    this.props.navigation.navigate("MessagesList")
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


  messageRender = (item,index)=>{

    let messageObject = this.props.messages.filter(item=> this.state.index === item.id)[0] || this.props.navigation.state.params.messageObject
    // let messageObject = this.props.messages.filter(item=> this.state.index === item.id)[0]
    let fromMe = messageObject.author === item.author

    return(
      <View
        key={String(item.id)}
        style={{
        flex:1,
        marginVertical:hp(1),
        paddingHorizontal:wp(1.5)}}
      >

        <View
          style={{
            paddingHorizontal:wp(3),
            backgroundColor:fromMe ? "#00ACA9" : "#EDEEF0",
            paddingVertical:hp(1.5),
            alignSelf: fromMe ? 'flex-end': 'flex-start',
            borderTopLeftRadius:wp(3),
            borderTopRightRadius:wp(3),
            borderBottomLeftRadius:fromMe ? wp(3) :wp(0),
            borderBottomRightRadius:fromMe ? wp(0) :wp(3),
            maxWidth: wp(55),
          }}
        >

          <Text style={{
            fontSize:15,
            color:fromMe ? "#FFFFFF" : "#484848"
          }}>
            {item.content}
          </Text>

        </View>
        <Text
          style={{
            color:'#ABA9C2',
            alignSelf: fromMe ? 'flex-end': 'flex-start',
          }}
        >{ moment(item.created_at).format("HH:MM") }
        </Text>
      </View>
    )
  };
  dateSectionRender = (section,index)=>{

    return(
      <View
        key={String('section'+index)}
        style={{
        // backgroundColor:'red',
        paddingVertical:hp(1),
      }}>

        <View style={{
              alignItems:'center',
              flexDirection:"row",
              // backgroundColor:'blue',
            }}>
          <View
            style={{
              height:1,
              flex:1,
              backgroundColor:'#CECECE'
            }}
          />

          <Text style={{
            color:'#CECECE',
            paddingHorizontal: 10
          }}>
            {section.date.toLocaleString("en-US",{} ) }
          </Text>

          <View
            style={{
              height:1,
              flex:1,
              backgroundColor:'#CECECE'
            }}
          />
        </View>

        <View style={{
          // backgroundColor:'pink'
        }}>
          {
            section.data.map(item=>this.messageRender(item,index))
          }
        </View>

      </View>
    )
  };

  render() {

    let { convertedMessageArray,text,index } = this.state

    // let messageObject = this.props.messages.filter(item=> this.state.index === item.id)[0]
    let messageObject = this.props.messages.filter(item=> this.state.index === item.id)[0] || this.props.navigation.state.params.messageObject

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled = {Platform.OS === 'ios' ? true : false}>

        <SafeAreaView style={styles.container}>
          <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
          <WhiteNavHeader
            title={messageObject.name}
            onBack={() => {
              this.props.navigation.goBack();
            }}
          />

          <ScrollView
            ref={ref => this.scrollView = ref}
            style={{}}
            onContentSizeChange={(contentWidth, contentHeight)=>{
              this.scrollView.scrollToEnd({animated: true});
            }}
          >
            {
              convertedMessageArray.map((item,index)=>{
                return(
                  this.dateSectionRender(item,index)
                )
              })
            }
          </ScrollView>
          <View style={{
            maxHeight:hp(8.5),
            // backgroundColor:'red',
            flexDirection:'row',
            marginTop:2,
            paddingHorizontal:wp(2),
            paddingVertical:hp(1),
            alignItems:'center',
            borderTopWidth:1,
            borderTopColor:'#EDEEF0'
          }}>
            <View
              style={{
                justifyContent:'center',
                paddingRight:wp(1),
                flex:1,
              }}
            >
              <TextInput
                multiline
                textAlignVertical={'top'}
                onChangeText={text=>this.setState({text})}
                placeHolder={'type something....'}
                value={text}
                style={{
                  paddingHorizontal:15,
                  textAlignVertical: "top",
                }}/>
            </View>

            <TouchableOpacity
              onPress={()=>{
                if(text.trim()){
                  let message = {
                    from:messageObject.author,
                    to:messageObject.author === convertedMessageArray[0].data[0].author ? convertedMessageArray[0].data[0].author : convertedMessageArray[0].data[0].receiver,
                    text:text.trim(),
                  };
                  WebSocketInstance.newChatMessage(this.state.token,messageObject.name,message)
                }
              }}
              style={{
                height:hp(4),
                width:hp(4),
                borderRadius:hp(4)/2,
                alignSelf:'center',
                backgroundColor:'#00ACA9',
                justifyContent:'center',
                alignItems:'center'
              }}>
              <Image style={{aspectRatio:1,}} resizeMode={'contain'} source={sendMessage}/>
            </TouchableOpacity>

          </View>

        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
  },
});

const mapStateToProps = state => {
  const { payLoad } = state.exchanges;

  return {
    messages:payLoad.data,
  };
};

const mapDispatchToProps = {
  getExchanges
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatView);
