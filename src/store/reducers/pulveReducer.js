import { AsyncStorage } from 'react-native';
const initialState = {
    produitPhytoClicked: undefined,
    newSession: undefined,
    lastSession: undefined,
    phytoProductList: [],
    phytoProductSelected: [],
    culturesSelected: [],
}

export default pulveReducer =  (state = initialState, action) => {
    let nextState
    switch (action.type) {
        case 'UPDATE_PHYTO':
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

        case 'UPDATE_SELECTED_PHYTO':
            console.log(action.selected)
            AsyncStorage.setItem('phytoProductSelected', JSON.stringify(action.selected));
            nextState = {
                ...state,
                phytoProductSelected: action.selected
            }
            return nextState || state

        case 'UPDATE_SELECTED_CULTURES':
            console.log(action.selected)
            AsyncStorage.setItem('culturesSelected', JSON.stringify(action.selected));
            nextState = {
                ...state,
                culturesSelected: action.selected
            }
            return nextState || state

        case 'UPDATE_PULV_INFO':
            console.log("pulv info => ", action)
            nextState = {
                ...state,
                phytoProductSelected: action.phytoProductSelected,
                culturesSelected: action.culturesSelected
            }
            return nextState || state
        default:
            return state
    }

};