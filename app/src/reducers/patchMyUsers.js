export const PATCHUSERS_INIT = "kraliss/patchusers/init";
export const PATCHUSERS_NEWBENFICARY = "kraliss/patchusers/refreshbeneficiary";

export const PATCH_MYUSERS = "kraliss/patchmyusers/LOAD";
export const PATCH_MYUSERS_SUCCESS = "kraliss/patchmyusers/LOAD_SUCCESS";
export const PATCH_MYUSERS_FAIL = "kraliss/patchmyusers/LOAD_FAIL";

export const POST_MYUSERS = "kraliss/postmyusers/LOAD";
export const POST_MYUSERS_SUCCESS = "kraliss/postmyusers/LOAD_SUCCESS";
export const POST_MYUSERS_FAIL = "kraliss/postmyusers/LOAD_FAIL";

export default function patchInterReducer(state = { loading: false }, action) {
  switch (action.type) {
    case PATCHUSERS_NEWBENFICARY:
      return { ...state, refreshBeneficiary: true };
    case PATCHUSERS_INIT:
      return { loading: false };
    case PATCH_MYUSERS:
      return { ...state, loading: true };
    case PATCH_MYUSERS_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data ,success:true};
    case PATCH_MYUSERS_FAIL:
      let info = "";
      if(action.error.response.data && action.error.response.data.length > 0) {
        info = action.error.response.data[0]
      }
      return {
        ...state,
        loading: false,
        error: "Error while Patch My user account.",
        info
      };
    default:
      return state;
  }
}

export function postBenefReducer(state = { loading: false }, action) {
  switch (action.type) {
    case PATCHUSERS_INIT:
      return { loading: false };
    case POST_MYUSERS:
      return { ...state, loading: true };
    case POST_MYUSERS_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case POST_MYUSERS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Posting a Beneficiary."
      };
    default:
      return state;
  }
}

export function reqRefreshBeneficiary() {
  return {
    type: PATCHUSERS_NEWBENFICARY,
    payload: {}
  };
}

export function reqPatchUsersInit() {
  return {
    type: PATCHUSERS_INIT,
    payload: {}
  };
}

export function reqPostMyUsers(email,requestCode) {
  return {
    type: POST_MYUSERS,
    payload: {
      request: {
        url: "/api/users",
        method: "POST",
        headers:{Accept: "application/ld+json"},
        data: {
          requestCode : requestCode,
          beneficiaryEmail : email
        }
        
      }
    }
  };
}



export function reqPatchMyUsers(patchData) {
  return {
    type: PATCH_MYUSERS,
    payload: {
      request: {
        url: "/api/users",
        method: "POST",
        data: patchData
      }
    }
  };
}
