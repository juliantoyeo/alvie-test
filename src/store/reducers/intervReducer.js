const initialState = {
    interventions: [],
}

export default intervReducer = (state = initialState, action) => {
    let nextState
    switch (action.type) {
        case 'UPDATE_INTERV':

            nextState = {
                ...state,
                interventions: action.interventionValues,
            }
            return nextState || state;

        case 'UPDATE_PHYTO_SELECT':
            nextState = {
                ...state,
                interventions: state.interventions.map((intervention) => {
                    return intervention.id === action.id ? {
                        ...intervention,
                        products: action.products,
                    } : intervention
                }),
            }
            return nextState || state;

        default:
            return state
    }

};