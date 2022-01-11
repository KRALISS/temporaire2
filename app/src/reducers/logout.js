export const POST_INIT_LOGOUT = "kraliss/logout/init";
export const POST_LOGOUT = "kraliss/logout/LOAD";
export const POST_LOGOUT_SUCCESS = "kraliss/logout/LOAD_SUCCESS";
export const POST_LOGOUT_FAIL = "kraliss/logout/LOAD_FAIL";

export default function logoutReducer(
  state = { loading: false, payLoad: undefined },
  action
) {
  switch (action.type) {
    case POST_INIT_LOGOUT:
      return {
        ...state,
        loading: false,
        error: undefined,
        payLoad: undefined,
      };
    case POST_LOGOUT:
      return { ...state, loading: true };
    case POST_LOGOUT_SUCCESS:
      return { ...state, loading: false, payLoad: "Successfully logout" };
    case POST_LOGOUT_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while logout",
      };
    default:
      return state;
  }
}

export function reqInitLogout() {
  return {
    type: POST_INIT_LOGOUT,
    payload: {}
  };
}

export function reqLogout() {
  return {
    type: POST_LOGOUT,
    payload: {
      request: {
        url: "/api/auth/token/logout",
        method: "POST",
        data: {}
      }
    }
  };
}
