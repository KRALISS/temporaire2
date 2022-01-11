export const POST_FORGOTPWD = "kraliss/forgotpasswd/LOAD";
export const POST_FORGOTPWD_SUCCESS = "kraliss/forgotpasswd/LOAD_SUCCESS";
export const POST_FORGOTPWD_FAIL = "kraliss/forgotpasswd/LOAD_FAIL";

export default function forgotPasswdReducer(
  state = { loading: false, payLoad: {} },
  action
) {
  switch (action.type) {
    case POST_FORGOTPWD:
      return { ...state, loading: true };
    case POST_FORGOTPWD_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case POST_FORGOTPWD_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while forgot passwd"
      };
    default:
      return state;
  }
}

export function reqForgotPasswd(email) {
  return {
    type: POST_FORGOTPWD,
    payload: {
      request: {
        url: "/reset-password/api",
        method: "POST",
        data: {
          email: email
        }
      }
    }
  };
}
