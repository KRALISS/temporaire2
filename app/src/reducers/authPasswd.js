export const POST_INIT_AUTHPWD = "kraliss.authpasswd/INIT"
export const POST_AUTHPWD = "kraliss/authpasswd/LOAD";
export const POST_AUTHPWD_SUCCESS = "kraliss/authpasswd/LOAD_SUCCESS";
export const POST_AUTHPWD_FAIL = "kraliss/authpasswd/LOAD_FAIL";

export default function authPasswdReducer(state = { loading: false }, action) {
  switch (action.type) {
    case POST_AUTHPWD:
      return { ...state, loading: true };
    case POST_INIT_AUTHPWD:
      return { ...state, loading: false, success: false, error: undefined}
    case POST_AUTHPWD_SUCCESS:
      return { ...state, loading: false, success: true };
    case POST_AUTHPWD_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Reset passwd"
      };
    default:
      return state;
  }
}

export function reqAuthPasswdInit() {
  return {
    type: POST_INIT_AUTHPWD,
    payload: {}
  }
}

export function reqAuthPasswd(password) {
  return {
    type: POST_AUTHPWD,
    payload: {
      request: {
        url: "/api/users",
        method: "POST",
        data: {
          requestCode : 30,
          password : password
        }
      }
    }
  };
}
