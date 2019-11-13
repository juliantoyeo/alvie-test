
const initialState = {
    token: '',
    userName:''
}

export default authReducer =  (state = initialState, action) => {
    let nextState
    switch (action.type) {
    
    case 'UPDATE_TOKEN':
        nextState = {
            ...state,
                token: action.token,
            }
        return nextState || state;

    case 'UPDATE_USERNAME':
    nextState = {
        ...state,
            userName: action.userName.charAt(0).toUpperCase()+action.userName.slice(1),
        }
    return nextState || state;

    case 'DELETE_TOKEN' :
        nextState = {
            ...state,
                token: '',
            }
        return nextState || state;
    default:
      return state
    }
};