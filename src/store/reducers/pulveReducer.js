const initialState = {
    produitPhytoClicked: undefined,
    newSession: undefined,
    lastSession: undefined,
    phytoProductList: [],
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

        case 'LIST_PHYTO':
            nextState = {
                ...state,
                phytoProductList: action.content
            }
            return nextState || state

        default:
            return state
    }

};