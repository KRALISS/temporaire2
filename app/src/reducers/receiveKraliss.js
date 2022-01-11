export const RECEIVEKRALISS_INIT = "kraliss/receiveKraliss/init";

export const POST_RECEIVEKRALISS = "kraliss/receiveKraliss/LOAD";
export const POST_RECEIVEKRALISS_SUCCESS =
  "kraliss/receiveKraliss/LOAD_SUCCESS";
export const POST_RECEIVEKRALISS_FAIL = "kraliss/receiveKraliss/LOAD_FAIL";

export const CONFIRMASK_INIT = "kraliss/confirmask/init";
export const POST_CONFIRMASK = "kraliss/confirmask/LOAD";
export const POST_CONFIRMASK_SUCCESS = "kraliss/confirmask/LOAD_SUCCESS";
export const POST_CONFIRMASK_FAIL = "kraliss/confirmask/LOAD_FAIL";

export default function receiveKralissReducer(
  state = { loading: false },
  action
) {
  switch (action.type) {
    case RECEIVEKRALISS_INIT:
      return { loading: false };
    case POST_RECEIVEKRALISS:
      return { ...state, loading: true };
    case POST_RECEIVEKRALISS_SUCCESS:
      return { ...state, loading: false, payLoad: "success" };
    case POST_RECEIVEKRALISS_FAIL:
      return {
        loading: false,
        error: "Ask Money Error!"
      };
    default:
      return state;
  }
}

export function reqReceiveKralissInit() {
  return {
    type: RECEIVEKRALISS_INIT,
    payload: {}
  };
}

export function reqReceiveKraliss(bodayData) {
  return {
    type: POST_RECEIVEKRALISS,
    payload: {
      request: {
        url: "/api/transactions",
        method: "POST",
        data: bodayData
      }
    }
  };s
}

export function confirmAskReducer(state = { loading: false }, action) {
  switch (action.type) {
    case CONFIRMASK_INIT:
      return { loading: false };
    case POST_CONFIRMASK:
      return { ...state, loading: true };
    case POST_CONFIRMASK_SUCCESS:
      return { ...state, loading: false, payLoad: "success" };
    case POST_CONFIRMASK_FAIL:
      const { data } = action.error.response;
      return {
        loading: false,
        error: data !== null ? data.message : "Confirm ask money Error!",
        errorStatus: action.error.response.status
      };
    default:
      return state;
  }
}

export function reqConfirmAskInit() {
  return {
    type: CONFIRMASK_INIT,
    payload: {}
  };
}

export function reqConfirmAsk(transID, bodayData) {
  return {
    type: POST_CONFIRMASK,
    payload: {
      request: {
        url: `/api/flux/receivedkraliss/${transID}/`,
        method: "PATCH",
        data: bodayData
      }
    }
  };
}
