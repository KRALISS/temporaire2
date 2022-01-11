export const POST_INIT_CONFIRMGODFATHER = "kraliss/confirmgodfather/INIT";
export const POST_CONFIRMGODFATHER = "kraliss/confirmgodfather/LOAD";
export const POST_CONFIRMGODFATHER_SUCCESS = "kraliss/confirmgodfather/LOAD_SUCCESS";
export const POST_CONFIRMGODFATHER_FAIL = "kraliss/confirmgodfather/LOAD_FAIL";

export default function confirmGodfatherReducer(
  state = { loading: false, payload: null, error: "" },
  action
) {
  switch (action.type) {
    case POST_INIT_CONFIRMGODFATHER:
      return { ...state, loading: false, payload: null, error: "" };
    case POST_CONFIRMGODFATHER:
      return { ...state, loading: true };
    case POST_CONFIRMGODFATHER_SUCCESS:
      return { ...state, loading: false, payload: true };
    case POST_CONFIRMGODFATHER_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while confirming godfather."
      };
    default:
      return state;
  }
}

export function reqInitConfirmGodfather() {
  return {
    type: POST_INIT_CONFIRMGODFATHER,
    payload: {}
  };
}

export function reqConfirmGodfather(email) {
  let data = {};
  if(email === "declined") {
   data ={status: "DECLINED", email: ""}
  } else {
   data = {email: email, status:"ACCEPTED"}
  }
  return {
    type: POST_CONFIRMGODFATHER,
    payload: {
      request: {
        url: "/api/resources/accept_friend_request/",
        method: "POST",
        data
      }
    }
  };
}
