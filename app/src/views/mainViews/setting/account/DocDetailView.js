import React, { Component } from "react";
import { Item } from "native-base";
import {
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  Linking,
  View,
  Alert,
  Image,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
import _ from "lodash";
import ImagePicker from "react-native-image-picker";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import moment from "moment";
import { reqInitDocMe, reqGetDocMe } from "../../../../reducers/documents";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../../locale/i18n";
import {
  getAuthToken,
  loadLocalData,
  saveLocalData
} from "../../../../utils/localStorage";
import { reqDeleteDoc } from "../../../../reducers/documents";
import Loader from "../../../../components/loader/Loader";
import KralissPrevDeleteCell from "../../../../components/kralissListCell/KralissPrevDeleteCell";
import {
  getStatusText,
  getDocTitleText
} from "../../../../utils/accountInfoUtil";
import { API_URL } from "../../../../utils/config";

// const options = [
//   i18n.t("myAccount.actionList.item1"),
//   i18n.t("myAccount.actionList.item2"),
//   i18n.t("myAccount.actionList.item3"),
//   i18n.t("myAccount.actionList.item4")
// ];

const options = {
    takePhotoButtonTitle: null,
    chooseFromLibraryButtonTitle: null,
    title: i18n.t("myAccount.actionList.title"),
    customButtons: [
        {name: 'camera', title: i18n.t("myAccount.actionList.item2")},
        {name: 'photoLibrary', title: i18n.t("myAccount.actionList.item3")},
        {name: 'docLibrary', title: i18n.t("myAccount.actionList.item4")},
    ],
    storageOptions: {
        skipBackup: true,
        path: "images",
        quality: 0.5,
        mediaType: "photo"
    }
};

export default class DocDetailView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { docItem, type ,typeNum} = params.params;
    let docName = null;
    let docId = null;
    let docFile = null;

    if (docItem !== null) {
        docName = docItem.status,
        docId = docItem.id,
        docFile = docItem.id
    }
    this.state = { docItem, docId, docFile, type, docName, typeNum, loading: false ,IBAN:"",BIC:"",kycValidationInProgress:false,isPdf:false};
  }

  componentDidMount = async () => {
    this.props.reqGetDocMe(3,this.state.docId);
    kycValidationInProgress = await loadLocalData("kycValidationInProgress");
    if(kycValidationInProgress){
      this.setState({kycValidationInProgress});
    }

  }

  componentDidUpdate = (prevProps, prevState) => {
    let { payLoad, error } = this.props;

    if (payLoad && payLoad !== undefined && payLoad.files !== undefined) {
      file = payLoad.files[payLoad.files.length - 1]
      extension = this.docExtension(file.file_name);
      this.setState({
        docName: file.file_name,
        docFile: extension+file.content
      })
    }

  }

  docExtension = (fileName)=>{
    this.setState({isPdf:false})
    extension = fileName.split('.').pop();
    switch (extension) {
      case "jpg":
        return "data:image/jpg;base64,";
      case "jpeg":
        return "data:image/jpeg;base64,";
      case "png":
        return "data:image/png;base64,";
      case "pdf":
        this.setState({isPdf:true});
        return "data:application/pdf;base64,";
    }
  }

    showOptionToUploadDocument = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                switch (response.customButton) {
                    case "camera":
                        ImagePicker.launchCamera(options, response => {
                            if (response.error) {
                                Alert.alert(
                                    i18n.t("myAccount.error"),
                                    i18n.t("myAccount.unexpectedError"),
                                    [
                                        {
                                            text: i18n.t("myAccount.ok"),
                                            onPress: () => {
                                            }
                                        }
                                    ],
                                    {cancelable: true}
                                );

                            } else if (response.didCancel) {

                            } else {
                                const isNotOversized = this._checkFileSize(response.fileSize);
                                if (isNotOversized === true) {
                                    const uri = response.uri.replace("file://", "");
                                    const extention = uri.slice(
                                        ((uri.lastIndexOf(".") - 1) >>> 0) + 2
                                    );
                                    const typeOfMime = this._defineMimeType(extention);
                                    const name = moment();
                                    const documentInfo = {
                                        uri: uri,
                                        type: typeOfMime,
                                        name: name
                                    };
                                    if(this.state.typeNum == 14){
                                      this.setState({documentInfo});

                                    }
                                    else{
                                      this.uploadImage(documentInfo);
                                    }                                }
                            }
                        });
                        break;
                    case "photoLibrary":
                        ImagePicker.launchImageLibrary(options, response => {
                            if (response.error) {
                                if (response.error === "Photo library permissions not granted") {
                                    Alert.alert(
                                        i18n.t("myAccount.permissionRequestErrorTitle"),
                                        i18n.t("myAccount.permissionRequestError"),
                                        [
                                            {
                                                text: i18n.t("myAccount.cancel"),
                                                onPress: () => {
                                                }
                                            },
                                            {
                                                text: i18n.t("myAccount.ok"),
                                                onPress: () => {
                                                    Linking.canOpenURL('app-settings:').then(supported => {
                                                        console.log(`Settings url works`);
                                                        Linking.openURL('app-settings:')
                                                    }).catch(error => {
                                                        console.log(`An error has occured: ${error}`)
                                                    })
                                                }
                                            }
                                        ],
                                        {cancelable: true}
                                    );
                                } else {
                                    Alert.alert(
                                        i18n.t("myAccount.error"),
                                        i18n.t("myAccount.unexpectedError"),
                                        [
                                            {
                                                text: i18n.t("myAccount.ok"),
                                                onPress: () => {
                                                }
                                            }
                                        ],
                                        {cancelable: true}
                                    );
                                }
                            } else if (response.didCancel) {

                            } else {
                                const isNotOversized = this._checkFileSize(response.fileSize);
                                if (isNotOversized === true) {
                                    const uri = response.uri.replace("file://", "");
                                    const extention = uri.slice(
                                        ((uri.lastIndexOf(".") - 1) >>> 0) + 2
                                    );
                                    const typeOfMime = this._defineMimeType(extention);
                                    const name = response.fileName;
                                    const documentInfo = {
                                        uri: uri,
                                        type: typeOfMime,
                                        name: name
                                    };
                                    if(this.state.typeNum == 14){
                                      this.setState({documentInfo});

                                    }
                                    else{
                                      this.uploadImage(documentInfo);
                                    }
                                }
                            }
                        });
                        break;
                    case "docLibrary":
                        setTimeout(() => {
                            DocumentPicker.show(
                                {
                                    filetype: [DocumentPickerUtil.pdf()]
                                },
                                (error, response) => {
                                    console.log("Response = ", response);
                                    if(response) {
                                      const isNotOversized = this._checkFileSize(response.fileSize);
                                      if (isNotOversized === true) {
                                          const uri = response.uri.replace("file:///", "");
                                          const extention = uri.slice(
                                              ((uri.lastIndexOf(".") - 1) >>> 0) + 2
                                          );
                                          const typeOfMime = this._defineMimeType(extention);
                                          const name = response.fileName;
                                          const documentInfo = {
                                              uri: uri,
                                              type: typeOfMime,
                                              name: name
                                          };
                                          if(this.state.typeNum == 14){
                                            this.setState({documentInfo});

                                          }
                                          else{
                                            this.uploadImage(documentInfo);
                                          }
                                        }
                                    }
                                }
                            );
                        }, 100);
                        break;
                }
            } else {
                const source = {uri: response.uri};

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                });
            }
        });
  };

  onChangeIBAN = value => {
    this.setState({ IBAN: value });
  };

  onChangeBIC = value => {
    this.setState({ BIC: value });
  };

  _defineMimeType = extension => {
    switch (extension) {
      case "jpg":
        return "image/jpeg";
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "pdf":
        return "application/pdf";
    }
  };

  _checkFileSize = fileSize => {
    if (fileSize >= 1500000) {
      this.showErrorAlert(i18n.t("myAccount.errorMessageMaxSize"));
    } else {
      return true;
    }
  };

  onPressValidate = () => {
    this.uploadImage(this.state.documentInfo);
  };

  uploadImage = async file => {
    console.log(RNFetchBlob.wrap(file.uri));
    console.log("UPLOADING IMAGE IN PROGRESS")
    const token = await getAuthToken();
    this.setState({ loading: true });
    try {
      const settings = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      };
      const resp = await RNFetchBlob.fetch(
        "POST",
        `${API_URL}/api/ressources`,
        settings,
        [
          {
            name: "document_file",
            filename: file.name.slice(-50),
            type: file.type,
            // data: RNFetchBlob.wrap(decodeURI(file.uri))
            data: RNFetchBlob.wrap(file.uri)
          },
          { name: "type", data: this.state.typeNum.toString() },
          { name: "description", data: "test" },
          { name: "requestCode", data: "0" },
          { name: "numberBank", data: this.state.IBAN },
          { name: "bic", data: this.state.BIC },
          { name: "APIMoneyId", data: this.state.docId }


        ]
      );
      if (resp.respInfo.status === 201 || resp.respInfo.status === 200) {
        this.setState({IBAN:"",BIC:"",documentInfo:""});       
        this.props.navigation.navigate("SettingSuccess", {
          title: i18n.t("contacts.succUploadFile"),
          description: "",
          returnNavigate: "Setting"
        });    
        this.setState({
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      }

    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      this.showErrorAlert(i18n.t("myAccount.errorMessageUploadFail"));
    }
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        "",
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

  onPressPreview = () => {
    const { docFile, type ,isPdf } = this.state;
    let title = getDocTitleText(type);
    this.props.navigation.navigate("DocPreview", {
      url: docFile,
      title,
      isPdf
    });
  };

  onPressDelete = () => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("refillLoader.confirmation"),
        i18n.t("myAccount.docDeleteMsg"),
        [
          {
            text: i18n.t("beneficiary.cancel"),
            onPress: () => {}
          },
          {
            text: i18n.t("forgotPassword.validateButton"),
            onPress: () => {
              this.confirmDeleteDocument();
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  confirmDeleteDocument = () => {
    const { docItem } = this.state;
    this.props.reqDeleteDoc(docItem.id);
    this.setState({ docItem: null, docName: null });
  };

  getDocumentRule = (docItem, type) => {
    if (docItem === null) return null;
    if (type == "PROOF_OF_ADDRESS")
      return i18n.t("myAccount.documentRuleOneYear");
    if (type == "PROOF_OF_HOST_HOSTING")
      return i18n.t("myAccount.documentRule3Month");
    if (type == "PROOF_OF_HOST_ADDRESS")
      return i18n.t("myAccount.documentRuleOneYear");
    return null;
  };

  render() {
    let buttonEnable = true;
    if (this.state.IBAN.length === 0 || this.state.BIC.length === 0 || !this.state.documentInfo || this.state.kycValidationInProgress) buttonEnable = false;
    const { docItem, type, docName,typeNum,kycValidationInProgress} = this.state;
    let { title, showIcon } = getStatusText(docItem);
    let txtAddRule = null;
    txtAddRule = this.getDocumentRule(docItem, type);

    showIcon = true;
    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'}}/>
        <Loader
          loading={this.state.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader
          title={getDocTitleText(type)}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <ScrollView style={{ flex: 1 }}>
          <Text style={[styles.txtDesc, styles.marginSection, styles.marginLR]}>
            {getDocTitleText(type)}
          </Text>

          {docName !== null && (
            <KralissPrevDeleteCell
              style={styles.marginCell}
              mainTitle={docName}
              onPreview={this.onPressPreview}
              onDelete={this.onPressDelete}
            />
          )}
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center"
              },
              styles.marginCell
            ]}
          >
            <Text style={[styles.txtDesc, styles.marginLR]}>{title}</Text>



          </View>

          {typeNum == 14  && (
            
            <View >
              {
                 docName !== null && (
                  <Text style={[styles.txtDesc, styles.marginSection, styles.marginLR]}>
                  {i18n.t("tunnel.AddIBAN")}
                  </Text>
                 )
              }
              <Item style={styles.item}>
              <TextInput
                  style={styles.textInput}
                  placeholderTextColor="#cecece"
                  placeholder={i18n.t("tunnel.IBAN")}
                  value={this.state.IBAN}
                  onChangeText={this.onChangeIBAN}
              />
              </Item>
              <Item style={styles.item}>
              <TextInput
                  style={styles.textInput}
                  placeholderTextColor="#cecece"
                  placeholder={i18n.t("tunnel.BIC")}
                  value={this.state.BIC}
                  onChangeText={this.onChangeBIC} 
              />
              </Item>
              <Text style={[styles.txtDesc, styles.marginSection, styles.marginLR]}>
                  {i18n.t("tunnel.AddIBAN&BIC")}
                  </Text>
            </View>
            

          )}


          { !kycValidationInProgress && <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addBtn}

              onPress={this.showOptionToUploadDocument}
            >
              <Image source={require("../../../../assets/images/add.png")} />
            </TouchableOpacity>
          </View>}
        </ScrollView>
        <View >
          {txtAddRule !== null && (
            <Text style={[styles.txtDesc, styles.marginLR]}>{txtAddRule}</Text>
          )}

          {typeNum == 14  && (
            <View >


              <View style={styles.buttonContainer}>
                  <TouchableOpacity
                  style={
                    buttonEnable ? styles.buttonEnabled : styles.buttonDisabled
                  }
                  onPress={this.onPressValidate}
                  >
                  <Text style={styles.buttonTitle}>
                      {i18n.t("login.validateButton")}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>

          )}
        </View>
            {/*<ActionSheet*/}
            {/*    ref={o => (this.ActionSheet = o)}*/}
            {/*    title={<Text>{i18n.t("myAccount.actionList.title")}</Text>}*/}
            {/*    options={options}*/}
            {/*    cancelButtonIndex={0}*/}
            {/*    onPress={index => {*/}
            {/*    this.selectionOption(index);*/}
            {/*  }}*/}
            {/*    styles={{wrapper: {marginBottom: 20}}}*/}
            {/*/>*/}
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    justifyContent: "flex-end"
  },
  addBtn: {
    position: "absolute",
    right: 20,
    //bottom:10,
    marginTop:20
  },
  buttonContainer: { height: 100 },
  marginSection: {
    marginTop: 20
  },
  buttonContainer0: { height: 60 },

  marginCell: {
    marginTop: 12
  },
  marginLR: {
    marginLeft: 20,
    marginRight: 20
  },
  txtDesc: {
    color: "#acacac",
    fontSize: RFPercentage(2.1)
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#000",
    fontSize: RFPercentage(2.2)
  },
  item: {
    marginTop: 30,
    borderBottomColor: "#cecece"
  },
  buttonTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: RFPercentage(2.8)
  },
  buttonEnabled: {
    width: "100%",
    flex: 1,
    backgroundColor: "#00aca9",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonDisabled: {
    width: "100%",
    flex: 1,
    backgroundColor: "#c7eceb",
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error } = state.docMeReducer;
  return {
    payLoad,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqDeleteDoc,
  reqGetDocMe

};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocDetailView);
