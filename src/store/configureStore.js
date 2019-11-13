
import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer'
import pulveReducer from './reducers/pulveReducer'

export default () =>{
    const store = createStore(
        combineReducers({
            authen : authReducer,
            pulve : pulveReducer
        }),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
};
