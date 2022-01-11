export const POST_INIT_ACTIVATION = "kraliss/activation/init";
export const POST_ACTIVATION = "kraliss/activation/LOAD";
export const POST_ACTIVATION_SUCCESS = "kraliss/activation/LOAD_SUCCESS";
export const POST_ACTIVATION_FAIL = "kraliss/activation/LOAD_FAIL";

export default function activationReducer(
  state = { loading: false, payload: null, error: null },
  action
) {
  switch (action.type) {
    case POST_INIT_ACTIVATION:
      return {
        ...state,
        loading: false,
        error: null,
        payload: null,
      };
    case POST_ACTIVATION:
      return { ...state, loading: true };
    case POST_ACTIVATION_SUCCESS:
      return { ...state, loading: false, payload: "Success while resend email"};
    case POST_ACTIVATION_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Activation",
      };
    default:
      return state;
  }
}

export function reqInitActivation() {
  return {
    type: POST_INIT_ACTIVATION,
    payload: {}
  };
}

export function reqActivation(email) {
  return {
    type: POST_ACTIVATION,
    payload: {
      request: {
        url: "/api/auth/users/resend/",
        method: "POST",
        data: {
          email
        }
      }
    }
  };
}