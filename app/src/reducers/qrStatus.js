export const QRSTATUS_INIT = "kraliss/qrstatus/init";

export const POST_QRSTATUS = "kraliss/qrstatus/LOAD";
export const POST_QRSTATUS_SUCCESS = "kraliss/qrstatus/LOAD_SUCCESS";
export const POST_QRSTATUS_FAIL = "kraliss/qrstatus/LOAD_FAIL";

export default function sentQRStatusReducer(
  state = { loading: false, payLoad: {} },
  action
) {
  switch (action.type) {
    case QRSTATUS_INIT:
      return { loading: false };
    case POST_QRSTATUS:
      return { ...state, loading: true };
    case POST_QRSTATUS_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case POST_QRSTATUS_FAIL:
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

export function reqQRStatusInit() {
  return {
    type: QRSTATUS_INIT,
    payload: {}
  };
}

export function reqQRStatus(bodayData) {
  return {
    type: POST_QRSTATUS,
    payload: {
      request: {
        url: "/api/flux/qr_status/",
        method: "POST",
        data: bodayData
      }
    }
  };
}
