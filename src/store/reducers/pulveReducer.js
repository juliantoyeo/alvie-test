const initialState = {
    produitPhytoClicked: undefined,
    newSession: undefined,
    lastSession: undefined
}

export default pulveReducer =  (state = initialState, action) => {
    let nextState
    switch (action.type) {
        case 'UPDATE_PHYTO':
            console.log(action.produitPhytoClicked);
            nextState =  {
                ...state,
                produitPhytoClicked : action.produitPhytoClicked,
            }
            return nextState || state;  

        default:
            return state
    }

};