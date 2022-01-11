export const POST_RESETPWD_INIT = 'kraliss/resetpasswd/INIT'
export const POST_RESETPWD = "kraliss/resetpasswd/LOAD";
export const POST_RESETPWD_SUCCESS = "kraliss/resetpasswd/LOAD_SUCCESS";
export const POST_RESETPWD_FAIL = "kraliss/resetpasswd/LOAD_FAIL";

export default function resetPasswdReducer(
  state = { loading: false, payLoad: null },
  action
) {
  switch (action.type) {
    case POST_RESETPWD_INIT:
      return {...state, payLoad:null}
    case POST_RESETPWD:
      return { ...state, loading: true };
    case POST_RESETPWD_SUCCESS:
      return { ...state, loading: false, payLoad: "Successfully reset password" };
    case POST_RESETPWD_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Reset passwd"
      };
    default:
      return state;
  }
}

export function reqInitResetPasswd() {
  return {
    type: POST_RESETPWD_INIT,
    payload: {}
  }
}

export function reqResetPasswd(uid, token, pwd, pwdconfirmation) {
  return {
    type: POST_RESETPWD,
    payload: {
      request: {
        url: "/api/auth/password/reset/confirm/",
        method: "POST",
        data: {
          uid: uid,
          token: token,
          new_password: pwd,
          re_new_password: pwdconfirmation
        }
      }
    }
  };
}
