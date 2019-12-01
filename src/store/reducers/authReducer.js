
const initialState = {
    token: '',
    userName:'',
    familyName:'',
}

export default authReducer =  (state = initialState, action) => {
    console.log(state);
    
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

    case 'UPDATE_FAMILYNAME':
    nextState = {
        ...state,
            familyName: action.familyName.charAt(0).toUpperCase()+action.familyName.slice(1),
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