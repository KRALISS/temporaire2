import React, { Component } from "react";
import { WebView, Text, View, StyleSheet, Dimensions, Platform,Image,PermissionsAndroid } from "react-native";
import Pdf from "react-native-pdf"
import RNFetchBlob from "rn-fetch-blob";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";

export default class DocPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canGoBack: false,
    }
  }


  saveFile = async () => {
          /*if (isIOS) {
        await RNFetchBlob.ios.previewDocument(path);
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permission to save file into the file storage',
            message: 'The app needs access to your file storage so you can download the file',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error();
        }

        const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
        RNFetchBlob.fs
          .cp(path, filePath)
          .then(() =>
            RNFetchBlob.android.addCompleteDownload({
              title: fileName,
              description: 'Download complete',
              mime: 'application/pdf',
              path: filePath,
              showNotification: true,
            })
          )
          .then(() =>
            RNFetchBlob.fs.scanFile([
              { path: filePath, mime: 'application/pdf' },
            ])
          );
      }*/

    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permission granted");

            const fs = RNFetchBlob.fs;
            // const base64 = RNFetchBlob.base64;

            const dirs = RNFetchBlob.fs.dirs;
            console.log(dirs.DownloadDir);

            const NEW_FILE_PATH = RNFetchBlob.fs.dirs.DownloadDir + '/test2.txt';
            //fs.createFile(NEW_FILE_PATH, 'foo', 'utf8');
            RNFetchBlob.fs.writeFile(NEW_FILE_PATH, url, 'base64');


        } else {
            console.log('Permission denied');
        }
        } catch (err) {
            console.warn(err);
        }

}
componentDidMount() {
  //this.saveFile();
  if (Platform.OS !== "iOS") {
    this.setState({android: true})
  }
      const params = this.props.navigation.state;
      const { url, title , isPdf} = params.params;

}
  render() {
    const params = this.props.navigation.state;
    const { url, title, isPdf } = params.params;
    const source = {uri:url};

    return (
      <View style={{ flex: 1 }}>
        <WhiteNavHeader
          title={title}
          onBack={() => {
            if (this.state.canGoBack) this._webview.goBack();
            else this.props.navigation.goBack();
          }}
        />
            {isPdf && <View style={styles.container}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    onPressLink={(uri)=>{
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf}/>
            </View>}

            {!isPdf &&
                <Image
                  style={{ width: '100%', height: '85%' }}
                  resizeMode='contain'
                  source={{uri: url}}
                />
            }

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
  },
  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
  }
});