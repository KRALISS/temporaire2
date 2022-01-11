export const INIT_GET_SPONSORDEMAILSUMMARY = "kraliss/sponsoremailsummary/INIT";
export const GET_SPONSORDEMAILSUMMARY = "kraliss/sponsoremailsummary/LOAD";
export const GET_SPONSORDEMAILSUMMARY_SUCCESS = "kraliss/sponsoremailsummary/LOAD_SUCCESS";
export const GET_SPONSORDEMAILSUMMARY_FAIL = "kraliss/sponsoremailsummary/LOAD_FAIL";

export default function sponsorMonthSummaryReducer(
  state = { loading: false, payLoad: null, error: null },
  action
) {
  switch (action.type) {
    case INIT_GET_SPONSORDEMAILSUMMARY:
        return {loading:false, payLoad: null, error: null}
    case GET_SPONSORDEMAILSUMMARY:
      return { ...state, loading: true };
    case GET_SPONSORDEMAILSUMMARY_SUCCESS:
      return { ...state, loading: false, payLoad: "Success while sending email sponsor summary" };
    case GET_SPONSORDEMAILSUMMARY_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while sponsor email summary sent"
      };
    default:
      return state;
  }
}

export function initSponsorMonthSummary() {
    return {
        type: INIT_GET_SPONSORDEMAILSUMMARY,
        payload:{}
    }
}

export function reqSponsorMonthSummary() {
  return {
    type: GET_SPONSORDEMAILSUMMARY,
    payload: {
      request: {
        url: "/api/resources/sponsor_email_details/",
        method: "GET"
      }
    }
  };
}
