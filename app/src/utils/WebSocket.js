import {Alert} from "react-native";
import i18n from '../locale/i18n';

// const API_PATH = 'ws://217.182.95.254:8008/ws/chat';
const API_PATH = 'wss://app2.kraliss.com/ws/chat';


class WebSocketService {
  static instance = null;
  callbacks = {};

  constructor() {
    this.socketRef = null;
  }

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  close(){
    this.socketRef && this.socketRef.close()
  }

  connect() {
    const path = API_PATH;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log('WebSocket open');
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = e => {
      Alert.alert(
        i18n.t("messages.initMessageErrorTitle"),
        i18n.t("messages.initMessageErrorMessage"),
        [
          {
            text: i18n.t("components.errorView.return"),
            onPress: () => this.connect()
          }
        ],
        { cancelable: true }
      );
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === 'messages') {
      this.callbacks[command](parsedData.messages);
    }
    if (command === 'new_message') {
      this.callbacks[command](parsedData.message);
    }
    if (command === 'init_chat') {
      this.callbacks[command](parsedData);
    }
  }

  initChatUser(token,topic,text) {
    this.sendMessage({ command: 'init_chat', token: token,topic:topic,text:text});
  }

  fetchMessages(token, topic, message) {
    this.sendMessage({ command: 'fetch_messages', token: token,  topic: topic, text: message});
  }

  newChatMessage(token, topic, message) {
    this.sendMessage({ command: 'new_message', token: token, topic: topic, from: message.from, to: message.to, text: message.text });
  }

  addCallbacks(command,callback) {
    // this.callbacks["init_chat"] = init_chat_callback;
    // this.callbacks['messages'] = fetch_messages_callback;
    // this.callbacks['new_message'] = fetch_messages_callback;
    this.callbacks[command] = callback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    }
    catch(err) {
      console.log(err);
    }
  }

  state() {
    return this.socketRef.readyState;
  }

  waitForSocketConnection(callback){
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(
      function () {
        if (socket.readyState === 1) {
          console.log("Connection is made")
          if(callback != null){
            callback();
          }
          return;

        } else {
          console.log("wait for connection...")
          recursion(callback);
        }
      }, 5); // wait 5 milisecond for the connection...
  }

}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
