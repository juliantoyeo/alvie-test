
import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer'
import pulveReducer from './reducers/pulveReducer'
import intervReducer from './reducers/intervReducer'
import metaReducer from './reducers/metaReducer'

export default () =>{
    const store = createStore(
        combineReducers({
            authen : authReducer,
            pulve : pulveReducer,
            interv : intervReducer,
            metadata: metaReducer,
        }),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
};
