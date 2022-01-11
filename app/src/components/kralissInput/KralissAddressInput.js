import React, { Component } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { Item } from "native-base";
import {RFPercentage} from "react-native-responsive-fontsize";
import RNGooglePlaces from "react-native-google-places";

// function getAddressDetail(placeid) {
//   var urlGetAddress = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=AIzaSyC_FWeQKfzUuWEarsF38d18O0YxtscOjO4`;
//   return new Promise((resolve, reject) => {
//     fetch(urlGetAddress)
//       .then(response => response.json())
//       .then(responseJson => {
//         const address_components = responseJson.result.address_components;
//         resolve(address_components);
//       })
//       .catch(error => {
//         reject(Object.assign(error));
//       });
//   });
// }

export default class KralissAddressInput extends Component {
  openSearchModal = () => {
    console.log("OPENSEARCH MODAL")
    RNGooglePlaces.openAutocompleteModal()
      .then( async place => {
        console.log("response places", place)
        // if(place["addressComponents"] === undefined) {
        //   place["addressComponents"] = {};
        //   let placeid = place.placeID;
        //   let placeDetails = await getAddressDetail(placeid);
        //   placeDetails.forEach((item) => {
        //     place["addressComponents"][item.types[0]] = item.long_name;
        //   });
        // }
        console.log(" RNGooglePlaces  >>> ", place);

        this.props.onAddressSelected(this.getFormatedAddress(place));
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log("ERROR GEOLOCATION",error.message)); // error is a Javascript Error object
  };

  getFormatedAddress(gPlace) {
    let _addressData = {};
    if(gPlace["address"] !== undefined)
      _addressData["formatted_address"] = gPlace["address"];
    if(gPlace["addressComponents"]!== undefined) {
      for(let i in gPlace["addressComponents"]) {
        const comp = gPlace["addressComponents"][i];
        if(comp["types"][0] === "street_number") {
          _addressData["street_number"] = comp.shortName;
        } else if(comp["types"][0] === "route") {
          _addressData["route"] = comp.shortName;
        } else if(comp["types"][0] === "locality") {
          _addressData["locality"] = comp.shortName;
        } else if(comp["types"][0] === "administrative_area_level_1") {
          _addressData["administrative_area_level_1"] = comp.shortName;
        } else if(comp["types"][0] === "country") {
          _addressData["country"] = comp.shortName;
        } else if(comp["types"][0] === "postal_code") {
          _addressData["postal_code"] = comp.shortName;
        }
      }
      // _addressData["street_number"] = gPlace["addressComponents"]["street_number"];
      // _addressData["route"] = gPlace["addressComponents"]["route"];
      // _addressData["locality"] = gPlace["addressComponents"]["locality"];
      // _addressData["administrative_area_level_1"] = gPlace["addressComponents"]["administrative_area_level_1"];
      // _addressData["country"] = gPlace["addressComponents"]["country"];
      // _addressData["postal_code"] = gPlace["addressComponents"]["postal_code"];
    }
    console.log("GET FORMATTED ADDRESS", _addressData)
    return _addressData;
  }

  onPressOpenAddress = () => {
    this.openSearchModal();
  };
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          {this.props.icon && (
            <Image style={{ marginRight: 10 }} source={this.props.icon} />
          )}
          <TouchableOpacity
            style={{ flex: 1, height: 40 }}
            onPress={this.onPressOpenAddress}
          >
            <View style={{ flex: 1 }} pointerEvents="none">
              <TextInput
                style={styles.textInput}
                editable={false}
                placeholderTextColor="#8fff"
                placeholder={this.props.placeHolder}
                value={this.props.value}
                secureTextEntry={this.props.secureText ? true : false}
              />
            </View>
          </TouchableOpacity>

          {this.props.showDeleteBtn &&
            this.props.value.length > 0 && (
              <TouchableOpacity
                onPress={() => this.props.onDeleteText(this.props.ID)}
              >
                <Image
                  source={require("../../assets/images/times_circle_regular.png")}
                />
              </TouchableOpacity>
            )}
          {this.props.confirmIcon &&
            this.props.isConfirmed && (
              <Image
                style={styles.iconConfirm}
                source={this.props.confirmIcon}
              />
            )}
        </Item>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center"
  },

  item: {
    borderBottomColor: "#fff"
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#fff",
    fontSize: RFPercentage(2.3)
  },
  iconConfirm: {
    marginLeft: 10,
    width: 20,
    height: 20
  }
});
