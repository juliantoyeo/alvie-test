const initialState = {
    interventions: [],
}

export default intervReducer =  (state = initialState, action) => {
    let nextState
    switch (action.type) {
    case 'UPDATE_INTERV':
        
    nextState =  {
        ...state,
            interventions : action.interventionValues,
        }
    return nextState || state;  
    case 'UPDATE_PHYTO_SELECT':
        console.log('reducer UPDATE_PHYTO_SELECT');
        console.log((action.produitPhytoClicked));
        nextState =  {
            ...state,
            interventions : state.interventions.map((intervention) => {
                console.log('reducer UPDATE_PHYTO_SELECT nextState');
                console.log((intervention));
                //return intervention.phytoproduct === action.produitPhytoClicked ? {
                return ((intervention.deviceid === action.deviceid)&&(intervention.interventionid === action.interventionid)) ? {
                    ...intervention,
                    phytoproduct: action.produitPhytoClicked,
                } : intervention
            }),
        }
        console.log('reducer UPDATE_PHYTO_SELECT nextState');
        console.log((nextState));
        return nextState || state;  

    default:
      return state
    }

};