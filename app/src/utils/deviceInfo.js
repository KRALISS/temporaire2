import DeviceInfo from "react-native-device-info";
import { PermissionsAndroid, Platform } from 'react-native'

export async function getDeviceInformations(geolocation) {
  try {
    const returnValue = {
      mb_timezone: DeviceInfo.getTimezone(),
      mb_os_name: DeviceInfo.getSystemName(),
      mb_ip_country: "",
      mb_unique_id_number: DeviceInfo.getUniqueID(),
      mb_public_ip: await DeviceInfo.getIPAddress(),
      mb_lat: "",
      mb_long: ""
    };
    const position = await getCurrentLocation(geolocation);
    if(!position) {
      returnValue.mb_lat = "";
      returnValue.mb_long = "";
    } else {
      returnValue.mb_lat = position.coords.latitude;
      returnValue.mb_long = position.coords.longitude;  
    }
    const publicIP = await getGlobalIP();
    returnValue.mb_public_ip = publicIP;
    const country = await getCountry(publicIP);
    returnValue.mb_ip_country = country;
    return returnValue;
  } catch (error) {
    //console.log(error);
    throw error;
  }
}

hasCameraPermission = async () => {
  const hasCameraPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CAMERA
  )

  if (hasCameraPermission) return true;

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    console.log("No user permissions")
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    console.log("Never ask again")
  }

  return false;
}

hasLocationPermission = async () => {
  if (Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (hasPermission) return true;

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    console.log("No user permissions")
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    console.log("Never ask again")
  }

  return false;
}

async function getCurrentLocation(geolocation) {
  // geolocation.requestAuthorization();
  try {
    const hasCameraPermission = await this.hasCameraPermission();
    if(hasCameraPermission) {
      const hasLocationPermission = await this.hasLocationPermission();
      if(hasLocationPermission) {
        return new Promise((resolve, reject) => {
          geolocation.getCurrentPosition(
            resolve,
            ({ code, message }) =>
              /*reject(
                Object.assign(new Error(message), { name: "PositionError", code })
              )*/
              resolve({ coords: { latitude: "", longitude: "" } }),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
          );
        });
      } else false;
    }
  } catch(err) {
    console.log(error)
  }

}

function getGlobalIP() {
  var urlGetIP = `https://api.ipify.org?format=json`;
  console.log(urlGetIP);
  return new Promise((resolve, reject) => {
    fetch(urlGetIP)
      .then(response => response.json())
      .then(responseJson => {
        const ip = responseJson.ip;
        resolve(ip);
      })
      .catch(error => {
        reject(Object.assign(error));
      });
  });
}

function getCountry(ipAddress) {
  // var urlGetIP = `http://api.ipstack.com/${ipAddress}?access_key=9437feb071b96603e7981a0b828ae102`; //Dev key
  var urlGetIP = `http://api.ipstack.com/${ipAddress}?access_key=c118cae3a424834a8c34906e053ac2f8`;   //Production key
  console.log(urlGetIP);
  return new Promise((resolve, reject) => {
    fetch(urlGetIP)
      .then(response => response.json())
      .then(responseJson => {
        const countryName = responseJson.country_name;
        resolve(countryName);
      })
      .catch(error => {
        reject(Object.assign(error));
      });
  });
}
