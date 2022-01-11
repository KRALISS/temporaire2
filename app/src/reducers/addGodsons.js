export const POST_INIT_ADDGODSONS = "kraliss/addgodsons/INIT";
export const POST_ADDGODSONS = "kraliss/addgodsons/LOAD";
export const POST_ADDGODSONS_SUCCESS = "kraliss/addgodsons/LOAD_SUCCESS";
export const POST_ADDGODSONS_FAIL = "kraliss/addgodsons/LOAD_FAIL";

export default function addGodsonReducer(
  state = { loading: false, payload: null, error: "", errorInfo: undefined },
  action
) {
  switch (action.type) {
    case POST_INIT_ADDGODSONS:
      return { ...state, loading: false, payload: null, error: "", errorInfo: undefined };
    case POST_ADDGODSONS:
      return { ...state, loading: true };
    case POST_ADDGODSONS_SUCCESS:
      return { ...state, loading: false, payload: true };
    case POST_ADDGODSONS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while adding godsons.",
        errorInfo: action.error.response.data.message
      };
    default:
      return state;
  }
}

export function reqInitAddGodsons() {
  return {
    type: POST_INIT_ADDGODSONS,
    payload: {}
  };
}

export function reqAddGodsons(email) {
  return {
    type: POST_ADDGODSONS,
    payload: {
      request: {
        url: "/api/resources/send_friend_request/",
        method: "POST",
        data: {
          email: email
        }
      }
    }
  };
}
