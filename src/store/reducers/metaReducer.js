
const initialState = {
  parcelles: [],
  cultures: [],
}

export default authReducer = (state = initialState, action) => {
  let nextState
  switch (action.type) {
    case 'UPDATE_PARCELLES':
      nextState = {
        ...state,
        parcelles: action.parcelles,
      }
      return nextState || state;
    
    case 'UPDATE_CULTURES':
      console.log(action.cultures)
      nextState = {
        ...state,
        cultures: action.cultures,
      }
      return nextState || state;

    default:
      return state
  }
};