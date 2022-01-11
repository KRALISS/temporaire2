export const LASTTRANS_INIT = "kraliss/lasttransaction/init";
export const GET_LASTTRANS = "kraliss/lasttransaction/LOAD";
export const GET_LASTTRANS_SUCCESS = "kraliss/lasttransaction/LOAD_SUCCESS";
export const GET_LASTTRANS_FAIL = "kraliss/lasttransaction/LOAD_FAIL";

export const SEARCH_LAST_TRANSACTION_INIT = "kraliss/search_transaction/INIT";
export const SEARCH_LAST_TRANSACTION = "kraliss/search_transaction/LOAD";
export const SEARCH_LAST_TRANSACTION_SUCCESS = "kraliss/search_transaction/LOAD_SUCCESS";
export const SEARCH_LAST_TRANSACTION_FAIL = "kraliss/search_transaction/LOAD_FAIL";

export default function lastTransactionReducer(
  state = { loading: false, searchPayload: null, searchLoadin: null, errorSearch: null },
  action
) {
  switch (action.type) {
    case LASTTRANS_INIT:
      return {
        loading: false
      };
    case GET_LASTTRANS:
      return { ...state, loading: true };
    case GET_LASTTRANS_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case GET_LASTTRANS_FAIL:
      return { loading: false, error: "Last Transaction Error!" };
    case SEARCH_LAST_TRANSACTION_INIT:
      return {searchLoading: false, searchPayload: null, errorSearch: null};
    case SEARCH_LAST_TRANSACTION:
      return {...state, searchLoading: true};
    case SEARCH_LAST_TRANSACTION_SUCCESS:
      return {...state, searchLoading: false, searchPayload: action.payload.data};
    case SEARCH_LAST_TRANSACTION_FAIL:
      return {...state, searchLoading: false, errorSearch: "Error while searching"};
    default:
      return state;
  }
}

export function reqLastTransactionInit() {
  return {
    type: LASTTRANS_INIT,
    payload: {}
  };
}

export function reqLastTransaction(page, per_page) {
  return {
    type: GET_LASTTRANS,
    payload: {
      request: {
        url: "/api/transactions",
        method: "POST",
        data :{
          "requestCode": 1
        }
      }
    }
  };
}

export function searchTransactionInit() {
  return {
    type: SEARCH_LAST_TRANSACTION_INIT,
    payload: {}
  };
}

export function searchTransaction(query) {
  return {
    type: SEARCH_LAST_TRANSACTION,
    payload: {
      request: {
        url: `/api/flux/last_transactions/me/?search=${query}`,
        method: "GET"
      }
    }
  };
}