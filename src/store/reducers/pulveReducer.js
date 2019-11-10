const initialState = {
    produitPhytoClicked: ""
}

export default pulveReducer =  (state = initialState, action) => {
    switch (action.type) {
    case 'UPDATE_TOKEN':
        return {
            ...state,
                produitPhytoClicked : action.produitPhytoClicked,
            }
    default:
      return state
    }
    
};