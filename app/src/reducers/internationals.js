export const GET_INTERNATIONALS = "kraliss/internationals/LOAD";
export const GET_INTERNATIONALS_SUCCESS = "kraliss/internationals/LOAD_SUCCESS";
export const GET_INTERNATIONALS_FAIL = "kraliss/internationals/LOAD_FAIL";
export const GET_LANGUAGES = "kraliss/languages/LOAD";
export const GET_LANGUAGES_SUCCESS = "kraliss/languages/LOAD_SUCCESS";
export const GET_LANGUAGES_FAIL = "kraliss/languages/LOAD_FAIL";

export default function internationalsReducer(
  state = { loading: false, payLoad: {} },
  action
) {
  switch (action.type) {
    case GET_INTERNATIONALS:
      return { ...state, loading: true };
    case GET_INTERNATIONALS_SUCCESS:
      return { ...state, loading: false, internationals: action.payload.data["hydra:member"] };
    case GET_INTERNATIONALS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while loading countries"
      };
    case GET_LANGUAGES:
      return { ...state, loading: true };
    case GET_LANGUAGES_SUCCESS:
      return { ...state, loading: false, payLoad2: action.payload.data["hydra:member"] };
    case GET_LANGUAGES_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while loading languages"
      };
    default:
      return state;
  }

}

export function reqInternationals() {
  return {
    type: GET_INTERNATIONALS,
    payload: {
      request: {
        url: "/api/countries/",
        method: "GET",
        headers:{Accept: "application/ld+json"}
      }
    }
  };
}

export function reqLanguages() {
  return {
    type: GET_LANGUAGES,
    payload: {
      request: {
        url: "/api/languages/",
        method: "GET",
        headers:{Accept: "application/ld+json"}
      }
    }
  };
}