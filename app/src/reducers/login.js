export const POST_INIT_SIGNIN = "kraliss/login/init";
export const POST_LOGIN = "kraliss/login/LOAD";
export const POST_LOGIN_SUCCESS = "kraliss/login/LOAD_SUCCESS";
export const POST_LOGIN_FAIL = "kraliss/login/LOAD_FAIL";

export default function loginReducer(
  state = { loading: false, auth_token: {} },
  action
) {
  switch (action.type) {
    case POST_INIT_SIGNIN:
      return {
        ...state,
        loading: false,
        error: undefined,
        auth_token: {},
        errorStatus: undefined
      };
    case POST_LOGIN:
      return { ...state, loading: true };
    case POST_LOGIN_SUCCESS:
      return { ...state, loading: false, auth_token: action.payload.data };
    case POST_LOGIN_FAIL: 
      return {
        ...state,
        loading: false,
        error: "Error while Login",
        errorStatus : action.error.response.status
      };
    default:
      return state;
  }
}

export function reqInitSignIn() {
  return {
    type: POST_INIT_SIGNIN,
    payload: {}
  };
}

export function reqLogin(user) {
  return {
    type: POST_LOGIN,
    payload: {
      request: {
        url: "/api/login",
        method: "POST",
        data: {
          email: user.email,
          password: user.password,
        }
      }
    }
  };
}
