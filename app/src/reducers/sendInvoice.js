export const POST_INIT_SENDINVOICE = "kraliss/sendInvoice/init";
export const POST_SENDINVOICE = "kraliss/sendInvoice/LOAD";
export const POST_SENDINVOICE_SUCCESS = "kraliss/sendInvoice/LOAD_SUCCESS";
export const POST_SENDINVOICE_FAIL = "kraliss/sendInvoice/LOAD_FAIL";

export default function sendInvoiceReducer(
  state = { loading: false, payload: null, error: null },
  action
) {
  switch (action.type) {
    case POST_INIT_SENDINVOICE:
      return {
        ...state,
        loading: false, 
        payload: null,
        error: null
      };
    case POST_SENDINVOICE:
      return { ...state, loading: true };
    case POST_SENDINVOICE_SUCCESS:
      return { ...state, loading: false, payload: "Success while sending Invoice" };
    case POST_SENDINVOICE_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Sending Invoice",
      };
    default:
      return state;
  }
}

export function reqInitSendInvoice() {
  return {
    type: POST_INIT_SENDINVOICE,
    payload: {}
  };
}

export function reqSendInvoice(id) {
  return {
    type: POST_SENDINVOICE,
    payload: {
      request: {
        url: "/api/resources/get_invoice/",
        method: "POST",
        data: {
          invoice_id: id
        }
      }
    }
  };
}
