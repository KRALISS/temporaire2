export const PUSHPROCESS = "kraliss/pushProcess";
export const PUSHPROCESS_INIT = "kraliss/pushProcessInit";

export default function pushProcessReducer(
  state = { pushChecking: false },
  action
) {
  switch (action.type) {
    case PUSHPROCESS_INIT:
      return { pushChecking: false };
    case PUSHPROCESS:
      return { pushChecking: true };
    default:
      return state;
  }
}

export function reqPushProcessInit(token) {
  return {
    type: PUSHPROCESS_INIT
  };
}

export function reqPushProcess(token) {
  return {
    type: PUSHPROCESS
  };
}
