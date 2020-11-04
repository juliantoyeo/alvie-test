
import capitalize from '../../utils/capitalize'

const initialState = {
    token: '',
    userName:'',
    familyName:'',
    deviceid:'',
    deviceType:'',
    tester:''
}

export default authReducer =  (state = initialState, action) => {  
    let nextState
    switch (action.type) {
        case 'UPDATE_INFOS':
            const { token, userName, familyName, deviceid, deviceType, tester } = action
            nextState = {
                ...state,
                token, 
                userName: capitalize(userName), 
                familyName: capitalize(familyName), 
                deviceid, 
                deviceType,
                tester
            }
            return nextState || state;
    
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

        case 'UPDATE_DEVICEID':
            nextState = {
                ...state,
                deviceid: action.deviceid,
            }
            return nextState || state;

        case 'UPDATE_DEVICETYPE':
            nextState = {
                ...state,
                deviceType: action.deviceType,
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