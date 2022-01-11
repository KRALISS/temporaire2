export const SENTKRALISS_INIT = "kraliss/sentKraliss/init";

export const POST_SENTKRALISS = "kraliss/sentKraliss/LOAD";
export const POST_SENTKRALISS_SUCCESS = "kraliss/sentKraliss/LOAD_SUCCESS";
export const POST_SENTKRALISS_FAIL = "kraliss/sentKraliss/LOAD_FAIL";

export default function sentKralissReducer(
  state = { loading: false, payLoad: {} },
  action
) {
  switch (action.type) {
    case SENTKRALISS_INIT:
      return { loading: false };
    case POST_SENTKRALISS:
      return { ...state, loading: true };
    case POST_SENTKRALISS_SUCCESS:
      return { ...state, loading: false, payLoad: "success" };
    case POST_SENTKRALISS_FAIL:
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

export function reqSentKralissInit() {
  return {
    type: SENTKRALISS_INIT,
    payload: {}
  };
}

export function reqSentKraliss(bodayData) {
  return {
    type: POST_SENTKRALISS,
    payload: {
      request: {
        url: "/api/transactions",
        method: "POST",
        data: bodayData
      }
    }
  };
}
