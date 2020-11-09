
const initialState = {
  parcelles: [],
  cultures: [],
  lastMeteoLoad: null,
}

export default metaReducer = (state = initialState, action) => {
  let nextState
  switch (action.type) {
    case 'UPDATE_PARCELLES':
      nextState = {
        ...state,
        parcelles: action.parcelles,
      }
      return nextState || state;
    
    case 'UPDATE_CULTURES':
      nextState = {
        ...state,
        cultures: action.cultures,
      }
      return nextState || state;

    case 'METEO_SYNCED':
      nextState = {
        ...state,
        lastMeteoLoad: action.now,
      }
      return nextState || state;

    default:
      return state
  }
};