export const GET_COMPANYACTIVITIES = "kraliss/companyActivities/LOAD";
export const GET_COMPANYACTIVITIES_SUCCESS = "kraliss/companyActivities/LOAD_SUCCESS";
export const GET_COMPANYACTIVITIES_FAIL = "kraliss/companyActivities/LOAD_FAIL";


export default function companyActivitiesReducer(
  state = { loading: false, payLoad: {} },
  action
) {
  switch (action.type) {
    case GET_COMPANYACTIVITIES:
      return { ...state, loading: true };
    case GET_COMPANYACTIVITIES_SUCCESS:
        return { ...state, loading: false, companyActivities: action.payload.data["hydra:member"] };
    case GET_COMPANYACTIVITIES_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while loading countries"
      };
    default:
      return state;
  }

}

export function reqCompanyActivities() {
  return {
    type: GET_COMPANYACTIVITIES,
    payload: {
      request: {
        url: "/api/compagny_activities/",
        method: "GET",
        headers:{Accept: "application/ld+json"}
      }
    }
  };
}

