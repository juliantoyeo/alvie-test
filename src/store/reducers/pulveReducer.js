const initialState = {
    produitPhytoClicked: undefined,
}

export default pulveReducer =  (state = initialState, action) => {
    switch (action.type) {
    case 'UPDATE_PHYTO':
        return {
            ...state,
                produitPhytoClicked : action.produitPhytoClicked,
            }
    default:
      return state
    }

};