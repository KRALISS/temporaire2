export const EXCHANGES_INIT = "kraliss/exchanges/init";
export const GET_EXCHANGES = "kraliss/exchanges/LOAD";
export const GET_EXCHANGES_SUCCESS = "kraliss/exchanges/LOAD_SUCCESS";
export const GET_EXCHANGES_FAIL = "kraliss/exchanges/LOAD_FAIL";

export const SEARCH_EXCHANGES_INIT = "kraliss/exchanges/search/init";
export const SEARCH_EXCHANGES = "kraliss/exchanges/search/LOAD";
export const SEARCH_EXCHANGES_SUCCESS = "kraliss/exchanges/search/LOAD_SUCCESS";
export const SEARCH_EXCHANGES_FAIL = "kraliss/exchanges/search/LOAD_FAIL";

export const GET_ITEM_INIT = "kraliss/exchanges/search/init";
export const GET_ITEM = "kraliss/exchanges/getItem/LOAD";
export const GET_ITEM_SUCCESS = "kraliss/exchanges/getItem/LOAD_SUCCESS";
export const GET_ITEM_FAIL = "kraliss/exchanges/getItem/LOAD_FAIL";
export function exchangesReducer(
  state = {
    loading: false,
    payLoad:{
      count: 0,
      data:[]
    }
  },
  action
) {
  switch (action.type) {
    case EXCHANGES_INIT:
      return {
        loading: false,
        error:false,
        readItemId:null,
        payLoad:{
          count: 0,
          data:[]
        }
      };
    case GET_EXCHANGES:
      return { ...state, loading: true };
    case GET_ITEM_SUCCESS:
      let id = action.payload.data.id
      let localState = {...state}
      localState.payLoad.data.map((item,index) => {
        if(item.id === id){
          item.notification_extra_data ? item.notification_checked = true : item.non_checked = 0
        }
      });
      return { ...localState,readItemId:id};
    case GET_EXCHANGES_SUCCESS:
      const uniq = this.dataAggregation(state, action);
      return {loading: false, payLoad: {count: action.payload.data.count, data: uniq}}
    case GET_EXCHANGES_FAIL:
      return { ...state, loading: false, error: "Exchanges(Messages) Transaction Error!" };
    default:
      return state;
  }
}

dataAggregation = (state, action) => {
  const currentState = [...state.payLoad.data];
  const concatData = currentState.concat(action.payload.data.data);
  const uniq = Array.from(new Set(concatData.map(el => el.id)))
    .map(id => {return concatData.find(el => el.id === id)})
  return uniq
}

export function searchResultsExchanges(
  state = { loading: false,payLoad:{ count: 0, data: []}},
  action
) {
  switch (action.type) {
    case SEARCH_EXCHANGES_INIT:
      return {
        loading: false,
        payLoad:{ count: 0, data: []}
      };
    case SEARCH_EXCHANGES:
      return { ...state, loading: true };
    case SEARCH_EXCHANGES_SUCCESS:
      const uniq = this.dataAggregation(state, action);
      return { ...state, loading: false, payLoad: {count: action.payload.data.count, data: uniq} };
    case SEARCH_EXCHANGES_FAIL:
      return { loading: false, error: "Exchanges(Messages) Transaction Error!" };
    default:
      return state;
  }
}

export function searchExchangesInit() {
  return {
    type: SEARCH_EXCHANGES_INIT,
    payload: {}
  }
}

export function getExchangesInit() {
  return {
    type: EXCHANGES_INIT,
    payload: {}
  };
}



export function getExchanges(page, per_page) {
  const params = {page, per_page}
  return {
    type: GET_EXCHANGES,
    payload: {
      request: {
        url: `/api/resources/exchanges/me/`,
        method: "GET",
        params
      }
    }
  };
}
export function searchExchanges(searchKeyword, page, per_page) {
  const params = {
    page,
    per_page,
    search: searchKeyword
  }
  return {
    type: SEARCH_EXCHANGES,
    payload: {
      request: {
        url: `/api/resources/exchanges/me/`,
        method: "GET",
        params
      }
    }
  };
}

export function getItem(isNotification,id,) {
  return {
    type: GET_ITEM,
    payload: {
      request: {
        url: `/api/resources/${isNotification ? "notifications" : "topics"}/${id}/`,
        method: "GET"
      }
    }
  };
}
