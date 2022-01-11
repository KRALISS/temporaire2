export const RECHARGES_INIT = "kraliss/recharges/init";
export const REFILLS_FAILED = "kraliss/refills/failed";
export const GET_RECHARGES = "kraliss/recharges/LOAD";
export const GET_RECHARGES_SUCCESS = "kraliss/recharges/LOAD_SUCCESS";
export const GET_RECHARGES_FAIL = "kraliss/recharges/LOAD_FAIL";

export default function rechargesReducer(
  state = { loading: false, refillsFailed: false, payLoad: {} },
  action
) {
  switch (action.type) {
    case RECHARGES_INIT:
      return {
        ...state,
        refillsFailed: false,
        loading: false,
        error: "",
        payLoad: {}
      };
    case GET_RECHARGES:
      return { ...state, loading: true };
    case GET_RECHARGES_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case GET_RECHARGES_FAIL:
      return {
        ...state,
        loading: false,
        payLoad: action.payload.data
      };
    case REFILLS_FAILED:
      return { ...state, loading: false, refillsFailed: true };
    default:
      return state;
  }
}

export function reqRechargeInit() {
  return {
    type: RECHARGES_INIT,
    payload: {}
  };
}

export function reqRefillsFailed() {
  return {
    type: REFILLS_FAILED,
    payload: {}
  };
}

export function reqRecharges() {
  return {
    type: GET_RECHARGES,
    payload: {
      request: {
        url: "/api/resources/recharges/",
        method: "GET"
      }
    }
  };
}
