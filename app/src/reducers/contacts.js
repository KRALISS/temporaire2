export const POST_CONTACTS = "kraliss/contacts/LOAD";
export const POST_CONTACTS_SUCCESS = "kraliss/contacts/LOAD_SUCCESS";
export const POST_CONTACTS_FAIL = "kraliss/contacts/LOAD_FAIL";

export default function contactsReducer(state = { loading: false }, action) {
  switch (action.type) {
    case POST_CONTACTS:
      return { ...state, loading: true };
    case POST_CONTACTS_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case POST_CONTACTS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Reset passwd"
      };
    default:
      return state;
  }
}

export function reqContacts(bodyData) {
  return {
    type: POST_CONTACTS,
    payload: {
      request: {
        url: "/api/contact_uses",
        method: "POST",
        data: bodyData
      }
    }
  };
}
