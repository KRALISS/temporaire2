import  AsyncStorage  from "@react-native-community/async-storage";
import Storage from "react-native-storage";

var storage = new Storage({
  // maximum capacity, default 1000
  size: 15000,
  // Use AsyncStorage for RN apps, or window.localStorage for web apps.
  // If storageBackend is not set, data will be lost after reload.
  storageBackend: AsyncStorage, // for web: window.localStorage
  // cache data in the memory. default is true.
  enableCache: true,
  // if data was not found in storage or expired data was found,
  // the corresponding sync method will be invoked returning
  // the latest data.
  sync: {
    // we'll talk about the details later.
  },
  defaultExpires: null
});

const auth_key = "auth_token";

export async function saveAuthToken(auth_token) {
  try {
    await AsyncStorage.setItem(auth_key, auth_token);
  } catch (error) {
    // Error saving data
  }
}

export async function getAuthToken() {
  try {
    const value = await AsyncStorage.getItem(auth_key);
    if (value !== null) {
      // We have data!!
      //console.log(value);
    }
    return value;
  } catch (error) {
    // Error retrieving data
    return null;
  }
}

export async function deleteMyAccount() {
  await AsyncStorage.clear();
  await storage.clearMap();
}

export async function loadLocalData(load_key) {
  try {
    const ret = await storage.load({ key: load_key });
    return ret;
  } catch (error) {
    console.log("load error: " + load_key);
    console.log({error});
    return null;
  }
}

export async function saveLocalData(key, data) {
  try {
    if (data === null || data === undefined) return false;

    const ret = await storage.save({ key: key, data: data });
    return true;
  } catch (error) {
    console.log("save error: " + key);
    console.log(error);
    return false;
  }
}

export async function savePushData(pushData) {
  await saveLocalData("pushData", pushData);
}

export async function loadPushData() {
  return await loadLocalData("pushData");
}

export async function clearPushData() {
  await storage.remove({ key: "pushData" });
}
export async function clearPasswordData() {
  await storage.remove({ key: "password" });
}

export async function saveUserInfo(payLoad) {
  const  kra_user  = payLoad;
  const myuserIsBusiness = kra_user["typeAccount"] == "/api/type_accounts/2" ? true : false;
  await saveLocalData("myuserIsBusiness", myuserIsBusiness);

  const accountId = payLoad["id"];
  await saveLocalData("kraAccountId", accountId);
  
  const kraAccountIdAPI = payLoad["@id"];
  await saveLocalData("kraAccountIdAPI", kraAccountIdAPI);

  const firstName = kra_user["firstName"];
  await saveLocalData("firstName", firstName);

  const lastName = kra_user["lastName"];
  await saveLocalData("lastName", lastName);

  const email = kra_user["email"];
  await saveLocalData("email", email);

  const accountAPI = kra_user["account"];
  await saveLocalData("accountAPI", accountAPI);

  const myuserPhoneNumber = kra_user["phoneMobile"];
  await saveLocalData("myuserPhoneNumber", myuserPhoneNumber);

  const myuserMobilePhoneNumber = kra_user["phoneMobile"];
  await saveLocalData("myuserMobilePhoneNumber", myuserMobilePhoneNumber);

  const myuserNationality = kra_user["nationality"];
  await saveLocalData("myuserNationality", myuserNationality);

  const myuserAddressCountry = kra_user["addressCountry"];
  await saveLocalData("myuserAddressCountry", myuserAddressCountry);

  const myuserBirthCountry = kra_user["birthCountry"];
  await saveLocalData("myuserBirthCountry", myuserBirthCountry);

  const userBirthCity = kra_user["birthCity"];
  await saveLocalData("userBirthCity", userBirthCity);

  const myuserBirthdate = kra_user["birthDate"];
  await saveLocalData("myuserBirthdate", myuserBirthdate);

  if (myuserIsBusiness) {
    const myUserBusiness = kra_user["companyName"];
    await saveLocalData("myUserBusiness", myUserBusiness);

    const kraBusinessInfo = payLoad["kra_business_info"];

    const address = kra_user["addressLabel1"];
    await saveLocalData("formattedAddress", address);

    const companyName = kra_user["companyName"];
    await saveLocalData("companyName", companyName);

    const identificationNumber = kra_user["companyCRN"];
    await saveLocalData("identificationNumber", identificationNumber);

    let allCompanyActivities = await loadLocalData("allCompanyActivities");
    const activityFieldAPI = kra_user["compagnyActivity"];
    const activityFieldObject = allCompanyActivities[parseInt(activityFieldAPI.split('/').pop())-1];
    const activityField = activityFieldObject["label"];

    await saveLocalData("activityField", activityField);

    const companyPhoneNumber = kra_user["company_phone_number"];
    await saveLocalData("companyPhoneNumber", companyPhoneNumber);

    const companyInternational = kra_user["company_international"];
    await saveLocalData("companyInternational", companyInternational);

    const functionInSociety = kra_user["function_in_society"];
    await saveLocalData("functionInSociety", functionInSociety);
  } else {
    const address = kra_user["addressLabel1"];
    await saveLocalData("formattedAddress", address);
  }

  const myuserBeneficiary = kra_user["beneficiaries"];
  await saveLocalData("myuserBeneficiary", myuserBeneficiary);

  const allInternationals = await loadLocalData("allInternationals");
  const myuserInternational = allInternationals[parseInt(myuserAddressCountry.split('/').pop())];
  await saveLocalData("myuserInternational", myuserInternational);
  await saveLocalData("interMobileNum", myuserInternational["phoneCode"]);


  const myuserInternationalPhone = kra_user["myuser_international_phone"];
  await saveLocalData("myuserInternationalPhone", myuserInternationalPhone);

  const myuserInternationalMobilePhone = kra_user["myuser_international_mobile_phone"];
  await saveLocalData("myuserInternationalMobilePhone",myuserInternationalMobilePhone);

  const kraIban = payLoad["kra_iban"];
  await saveLocalData("kraIban", kraIban);

  const kraBalance = 500;
  await saveLocalData("kraBalance", kraBalance);

  const kraKycLevel = payLoad["kra_kyc_level"];
  await saveLocalData("kraKycLevel", kraKycLevel);

  const kraAccountNumber = payLoad["kra_account_number"];
  await saveLocalData("kraAccountNumber", kraAccountNumber);

  const kraApiMoneyWalletId = payLoad["kra_api_money_wallet_id"];
  await saveLocalData("kraApiMoneyWalletId", kraApiMoneyWalletId);
}
