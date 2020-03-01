
import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer'
import pulveReducer from './reducers/pulveReducer'
import intervReducer from './reducers/intervReducer'

export default () =>{
    const store = createStore(
        combineReducers({
            authen : authReducer,
            pulve : pulveReducer,
            interv : intervReducer
        }),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    console.log(store.getState());
    
    return store;
};
