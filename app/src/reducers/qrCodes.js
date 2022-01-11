export const QRCODES_INIT = "kraliss/qrcodes/init";

export const POST_QRCODES = "kraliss/postqrcodes/LOAD";
export const POST_QRCODES_SUCCESS = "kraliss/postqrcodes/LOAD_SUCCESS";
export const POST_QRCODES_FAIL = "kraliss/postqrcodes/LOAD_FAIL";

export const PATCH_USEQRCODE = "kraliss/patchqrcode/LOAD";
export const PATCH_USEQRCODE_SUCCESS = "kraliss/patchqrcode/LOAD_SUCCESS";
export const PATCH_USEQRCODE_FAIL = "kraliss/patchqrcode/LOAD_FAIL";

export const DELETE_QRCODES = "kraliss/deleteqrcodes/LOAD";
export const DELETE_QRCODES_SUCCESS = "kraliss/deleteqrcodes/LOAD_SUCCESS";
export const DELETE_QRCODES_FAIL = "kraliss/deleteqrcodes/LOAD_FAIL";

export default function postQRCodesReducer(state = { loading: false }, action) {
  switch (action.type) {
    case QRCODES_INIT:
      return { loading: false };
    case POST_QRCODES:
      return { ...state, loading: true };
    case POST_QRCODES_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case POST_QRCODES_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error"
      };
    default:
      return state;
  }
}

export function useQRCodeReducer(state = { loading: false }, action) {
  switch (action.type) {
    case QRCODES_INIT:
      return { loading: false };
    case PATCH_USEQRCODE:
      return { ...state, loading: true };
    case PATCH_USEQRCODE_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case PATCH_USEQRCODE_FAIL:
      const { data } = action.error.response;
      return {
        ...state,
        loading: false,
        error: data !== null ? data : "error"
      };
    default:
      return state;
  }
}

export function reqQRCodesInit() {
  return {
    type: QRCODES_INIT,
    payload: {}
  };
}

export function reqQRCodes(bodayData) {
  return {
    type: POST_QRCODES,
    payload: {
      request: {
        url: "/api/qr_codes",
        method: "POST",
        data: {   
          "amount": bodayData.amount,
          "message":"Encaissement test"
        }
      }
    }
  };
}

export function reqDeleteQRCodes(qrId) {
  return {
    type: DELETE_QRCODES,
    payload: {
      request: {
        url: `/api/qr_codes/${qrId}`,
        method: "DELETE"
      }
    }
  };
}

export function reqUseQRCode(bodayData) {
  return {
    type: PATCH_USEQRCODE,
    payload: {
      request: {
        url: "/api/transactions",
        method: "POST",
        data: bodayData
      }
    }
  };
}
