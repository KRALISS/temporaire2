export const POST_INIT_CONFPASSWD = "kraliss/confpasswd/INIT";
export const POST_CONFPASSWD = "kraliss/confpasswd/LOAD";
export const POST_CONFPASSWD_SUCCESS = "kraliss/confpasswd/LOAD_SUCCESS";
export const POST_CONFPASSWD_FAIL = "kraliss/confpasswd/LOAD_FAIL";

export default function confirmPasswdReducer(
  state = { loading: false, id: "", error: "" },
  action
) {
  switch (action.type) {
    case POST_INIT_CONFPASSWD:
      return { ...state, loading: false, success: false, error: "" };
    case POST_CONFPASSWD:
      return { ...state, loading: true };
    case POST_CONFPASSWD_SUCCESS:
      return { ...state, loading: false, success: true };
    case POST_CONFPASSWD_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Confirming password."
      };
    default:
      return state;
  }
}

export function reqInitConfirmPasswd() {
  return {
    type: POST_INIT_CONFPASSWD,
    payload: {}
  };
}

export function reqConfirmPasswd(email,password) {
  return {
    type: POST_CONFPASSWD,
    payload: {
      request: {
        url: "/api/login",
        method: "POST",
        data: {
          email:email,
          password: password
        }
      }
    }
  };
}
