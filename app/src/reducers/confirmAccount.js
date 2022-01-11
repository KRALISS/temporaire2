export const POST_CONFIRMACCOUNT = "kraliss/confirmaccount/LOAD";
export const POST_CONFIRMACCOUNT_SUCCESS = "kraliss/confirmaccount/LOAD_SUCCESS";
export const POST_CONFIRMACCOUNT_FAIL = "kraliss/confirmaccount/LOAD_FAIL";

export default function confirmAccountReducer(state = { loading: false , payLoad: null, error: null}, action) {
  switch (action.type) {
    case POST_CONFIRMACCOUNT:
      return { ...state, loading: true };
    case POST_CONFIRMACCOUNT_SUCCESS:
      return { ...state, loading: false, payLoad: "Account activated"};
    case POST_CONFIRMACCOUNT_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Register token"
      };
    default:
      return state;
  }
}
export function reqConfirmAccount(uid, token) {
  return {
    type: POST_CONFIRMACCOUNT,
    payload: {
      request: {
        url: "/api/auth/users/confirm/",
        method: "POST",
        data: { uid, token }
      }
    }
  };
}
