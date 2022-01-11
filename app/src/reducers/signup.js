export const POST_INIT_SIGNUP = "kraliss/signup/INIT";
export const POST_SIGNUP = "kraliss/signup/LOAD";
export const POST_SIGNUP_SUCCESS = "kraliss/signup/LOAD_SUCCESS";
export const POST_SIGNUP_FAIL = "kraliss/signup/LOAD_FAIL";

export default function signupReducer(
  state = { loading: false, id: "", error: "", errorInfo: undefined },
  action
) {
  switch (action.type) {
    case POST_INIT_SIGNUP:
      return { ...state, loading: false, id: "", error: "", errorInfo: undefined };
    case POST_SIGNUP:
      return { ...state, loading: true };
    case POST_SIGNUP_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case POST_SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Signup",
        errorInfo: action.error.response
      };
    default:
      return state;
  }
}

export function reqInitSignup() {
  return {
    type: POST_INIT_SIGNUP,
    payload: {}
  };
}

export function reqSignup(user) {
  typeAaccount = !user.myuser_is_business  ? "/api/type_accounts/1" :"/api/type_accounts/2";
  citizenUs = true ;
  fiscalUs = true;
  fiscalOutFrance = !fiscalUs;
  company_name = user.myuser_is_business ? user.company.company_name : null;
  companyCRN = user.myuser_is_business ? user.company.identification_number : null;
  compagnyActivity = user.myuser_is_business ? user.company.activity_field : null;
  return {
    type: POST_SIGNUP,
    payload: {
      request: {
        url: "/api/users",
        method: "POST",
        data: /*{
          username: user.email,
          password: user.password,
          email: user.email
        }*/
        {   
          requestCode: 0, // 0 for SignUp
          email: user.email,
          password: user.password,
          lastName: user.lastName,
          firstName: user.firstName,
          birthDate: user.birthDate,
          //citizenUs: citizenUs,
          //fiscalUs: fiscalUs,
          //fiscalOutFrance: fiscalOutFrance,
          addressLabel1: user.adressLabel,
          addressZipCode: user.addressZipCode,
          addressCity: user.adressCity,
          civility: user.civility,
          birthCountry: user.birthCountry,
          addressCountry: user.residenceCountry,
          phoneMobile: user.phoneMobile,
          language: user.language,
          nationality: user.nationality,
          typeAccount: typeAaccount,
          birthCity: user.birthCity,
          companyName: company_name,
          companyCRN: companyCRN,
          compagnyActivity: compagnyActivity
        }
        
      }
    }
  };
}
