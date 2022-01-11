export const EMAIL_PERMISSION = "kraliss/permissions/LOAD";
export const EMAIL_PERMISSION_SUCCESS = "kraliss/permissions/LOAD_SUCCESS";
export const EMAIL_PERMISSION_FAIL = "kraliss/permissions/LOAD_FAIL";

export function permissions(
  state = { loading: false, payLoad: ""},
  action
) {
  switch (action.type) {
    case EMAIL_PERMISSION:
      return { ...state, loading: true, payLoad: "" };
    case EMAIL_PERMISSION_SUCCESS:
      return { ...state, loading: false, payLoad: "permissions good" };
    case EMAIL_PERMISSION_FAIL:
      return { loading: false, error: "permissions(Messages) Transaction Error!" };
    default:
      return state;
  }
}


export function setPermission(patchData) {
  return {
    type: EMAIL_PERMISSION,
    payload: {
      request: {
        url: `/api/resources/myusers/me/`,
        method: "PATCH",
        data: patchData
      }
    }
  };
}
