export function createStore(initialState, reducer) {


  let state = initialState;

  const listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);

    listeners.forEach(listener => listener());
  }

  function subscribe(listener) {
    listeners.push(listener);
  }

  return {
    getState,
    dispatch,
    subscribe
  };
}


 export function reducer(state, action) {
  if (action.type === "NAVIGATE") {
    return {
      ...state,
      route: action.payload
    };
  }

  if(action.type ==="ADD ITEM"){
    return{
        ...state,
        items:[...state.items , action.payload]
    };
  }

  if(action.type ==="UPDATE_ITEM"){
    return {
        ...state,
        items: state.items.map(item =>
            item.id=== action.payload.id
            ? {...item, ...action.payload}
            :item
        )
    };
  }
if(action.type ==="DELETE_ITEM"){
    return{
        ...state,
        items:state.items.filter(item => item.id !==action.payload)
    };
}

if(action.type ==="SET_LOADING"){
    return{
        ...state,
        loading:action.payload
    };
}
if(action.type ==="SET_ERROR"){
    return{
        ...state,
        error:action.payload
    };
}


  return state;
}