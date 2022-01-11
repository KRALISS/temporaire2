export const ACCOUNTSME_INIT = "kraliss/getaccountsme/init";
export const GET_ACCOUNTSME = "kraliss/getaccountsme/LOAD";
export const GET_ACCOUNTSME_SUCCESS = "kraliss/getaccountsme/LOAD_SUCCESS";
export const GET_ACCOUNTSME_FAIL = "kraliss/getaccountsme/LOAD_FAIL";
export const GET_KYCSTATUS_INIT = "kraliss/getkycstatus/init";
export const GET_KYCSTATUS = "kraliss/getkycstatus/LOAD";
export const GET_KYCSTATUS_SUCCESS = "kraliss/getkycstatus/LOAD_SUCCESS";
export const GET_KYCSTATUS_FAIL = "kraliss/getkycstatus/LOAD_FAIL";
export const MONEYACCOUNTSME_INIT = "kraliss/getmoneyaccountsme/init";
export const GET_MONEYACCOUNTSME = "kraliss/getmoneyaccountsme/LOAD";
export const GET_MONEYACCOUNTSME_SUCCESS = "kraliss/getmoneyaccountsme/LOAD_SUCCESS";
export const GET_MONEYACCOUNTSME_FAIL = "kraliss/getmoneyaccountsme/LOAD_FAIL";
export const GET_ID = "kraliss/ID/LOAD";
export const GET_ID_SUCCESS = "kraliss/ID/LOAD_SUCCESS";
export const GET_ID_FAIL = "kraliss/ID/LOAD_FAIL";
export const PATCH_ACCOUNTSME = "kraliss/patchaccountsme/LOAD";
export const PATCH_ACCOUNTSME_SUCCESS = "kraliss/patchaccountsme/LOAD_SUCCESS";
export const PATCH_ACCOUNTSME_FAIL = "kraliss/patchaccountsme/LOAD_FAIL";


export default function accountsMeReducer(state = { loading: false, payLoad: undefined }, action) {
  switch (action.type) {
    case ACCOUNTSME_INIT:
      return {...state, loading: false, error: undefined, payLoad: undefined, success: undefined };
    case PATCH_ACCOUNTSME:
      return {...state, loading: true}
    case GET_ACCOUNTSME:
      return { ...state, loading: true };
    case GET_ACCOUNTSME_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case GET_KYCSTATUS:
      return { ...state, loading: true };
    case GET_KYCSTATUS_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case GET_MONEYACCOUNTSME:
      return { ...state, loading: true };
    case GET_MONEYACCOUNTSME_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case GET_ID:
      return { ...state, loading: true };
    case GET_ID_SUCCESS:
      return { ...state, loading: false, payLoad1: action.payload.data };
    case PATCH_ACCOUNTSME_SUCCESS:
      return {
        ...state,
        loading: false,
        success: "true",
        payLoad: action.payload.data
      };
    case PATCH_ACCOUNTSME_FAIL:
      return {
        ...state,
        loading: false,
        error: "Can't set IBAN value."
      };
    case GET_KYCSTATUS_FAIL:
        return {
          ...state,
          loading: false,
          error: "Can't fetch kyc status"
        };
    case GET_ACCOUNTSME_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Get My user details."
      };
    case GET_MONEYACCOUNTSME_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Get My user account."
      };    
    case GET_ID_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Get My user ID."
      };
    default:
      return state;
  }
}

export function reqInitMoneyAccountMe() {
  return {
    type: MONEYACCOUNTSME_INIT,
    payload: {}
  };
}

export function reqInitAccountsMe() {
  return {
    type: ACCOUNTSME_INIT,
    payload: {}
  };
}

export function reqID() {
  return {
    type: GET_ID,
    payload: {
      request: {
        url: "/api/users",
        method: "POST",
        data: {
          "requestCode": 22 // 22 -> get ID by token
        }

      }
    }
  };
}


export function reqAccountsMe() {
  return {
    type: GET_ACCOUNTSME,
    payload: {
      request: {
        url: "/api/users",
        method: "POST",
        data: {
          "requestCode": 22 // 22 -> get ID by token
        }

      }
    }
  };
}

export function reqMoneyAccountMe(accountAPI) {
  url=accountAPI;
    return {
      type: GET_MONEYACCOUNTSME,
      payload: {
        request: {
          url: url,
          method: "GET"
        }
      }
    };
  }

  export function reqKYCStatus() {
      return {
        type: GET_KYCSTATUS,
        payload: {
          request: {
            url: "/api/users",
            method: "POST",
            data: {
              "requestCode" : 40 // code for getting User KYC status
            }
          }
        }
      };
    }

export function reqPatchAccountsMe(patchData) {
  return {
    type: PATCH_ACCOUNTSME,
    payload: {
      request: {
        url: "/api/users/94",
        method: "PATCH",
        data: patchData
      }
    }
  };
}
