export const KRALISSREFUNDS_INIT = "kraliss/kralissRefunds/init";
export const POST_KRALISSREFUNDS = "kraliss/kralissRefunds/LOAD";
export const POST_KRALISSREFUNDS_SUCCESS =
  "kraliss/kralissRefunds/LOAD_SUCCESS";
export const POST_KRALISSREFUNDS_FAIL = "kraliss/kralissRefunds/LOAD_FAIL";

export default function refundsReducer(state = { loading: false }, action) {
  switch (action.type) {
    case KRALISSREFUNDS_INIT:
      return { loading: false };
    case POST_KRALISSREFUNDS:
      return { ...state, loading: true };
    case POST_KRALISSREFUNDS_SUCCESS:
      return { ...state, loading: false, success: "true" };
    case POST_KRALISSREFUNDS_FAIL:
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

export function reqRefundsInit() {
  return {
    type: KRALISSREFUNDS_INIT,
    payload: {}
  };
}

export function reqRefunds(bodayData) {
  return {
    type: POST_KRALISSREFUNDS,
    payload: {
      request: {
        url: "/api/flux/kralissrefunds/",
        method: "POST",
        data: bodayData
      }
    }
  };
}
