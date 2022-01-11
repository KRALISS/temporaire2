export const POST_DEVICEAPNS = "kraliss/deviceapns/LOAD";
export const POST_DEVICEAPNS_SUCCESS = "kraliss/deviceapns/LOAD_SUCCESS";
export const POST_DEVICEAPNS_FAIL = "kraliss/deviceapns/LOAD_FAIL";

export default function deviceApnsReducer(state = { loading: false }, action) {
  switch (action.type) {
    case POST_DEVICEAPNS:
      return { loading: true };
    case POST_DEVICEAPNS_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case POST_DEVICEAPNS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Register token"
      };
    default:
      return state;
  }
}
export function reqDeviceApns(token) {
  return {
    type: POST_DEVICEAPNS,
    payload: {
      request: {
        url: "/api/resources/device/gcm/",
        method: "POST",
        data: { registration_id: token, cloud_message_type:"FCM" }
      }
    }
  };
}
