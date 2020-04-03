import axios from 'axios';
import { AsyncStorage } from 'react-native';

import getUserAgent from './getUserAgent'

export const hygoApi = axios.create({
    baseURL: 'https://087f96a6.ngrok.io',
    timeout: 3000,
    headers: { 
        'User-Agent': getUserAgent()
    },
});

// Add a request interceptor
hygoApi.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token || ''}`;
    return config;
});

// Store device position
export const storeAppLocation = async (data) => {
    try {
        await hygoApi.post('/app/location', { ...data });
    } catch(e) {
        console.log(e)
    }
}

// Store phytoproduct changes
export const updateUI = async (phytoProduct, deviceid) => {
    try {
        await hygoApi.post('/app/ui', { phytoProduct, deviceid });
    } catch(e) {
        console.log(e)
    }
}

// Retrieve phytoproduct list
export const getPhytoProducts = async () => {
    try {
        const { data } = await hygoApi.get('/app/phytoproducts')
        return data
    } catch(e) { console.log(e) }

    return []
}

// Check if token is valid
export const checkToken = async (token) => {
    if (!token) {
        return {
            errorMessage: 'NO_TOKEN',
        };
    } 

    try {
        const response = await hygoApi.post('/app/auth/token', { token });

        const { userName, familyName, deviceid, deviceType } = response.data
        return {
            errorMessage: '',
            userName, familyName, deviceid, deviceType
        }
    } catch(err) {
        return {
            errorMessage: 'INVALID_TOKEN',
        };
    }
}

// SignIn using a barcode
export const signInWithBarCode = async (barcode) => {
    try {
        const response =  await hygoApi.post('/app/auth/barcode', {barcode});

        const { token, userName, familyName, deviceid, deviceType } = response.data
        return {
            token, userName, familyName, deviceid, deviceType,
            errorMessage: ''
        };
    } catch(err) {
        console.log(err);
        return {
            errorMessage: 'SIGNIN_ERROR'
        };
    }
}

// Store a new pushToken for this device
export const storePushToken = async (token, deviceid)=> {
    try {
        const response = await hygoApi.post('/app/pushtoken', {pushToken: token, deviceid});
        return response.data;
    } catch (error) {
        return {}
    }
}














export const signUp = async (email, password) => {
    try
    {
        const response =  await hygoApi.post('/signup', {email, password});
        return ({
            token: response.data.token,
            errorMessage: ''
        });
    } catch(err)
    {
        console.log(err)
        return ({
            token: '',
            errorMessage: 'Error while signing up'
        });
    }
}



export const getLastValue = async(token) => {
    if (token) {
        try {
            const response  = await hygoApi.post('/getLastValue', {token});
            const {id, deviceid, temp, humi, lat, long, timestamp} = response.data;
            return ({id, deviceid, temp, humi, lat, long, timestamp});
        } catch(error) {
            return ({
            });
        }
    }
}

export const getLastCondition = async(token) => {
    if (token) {
        try {
            const response  = await hygoApi.post('/getLastCondition', {token});
            const {condition, phytoProduct, conditionColor} = response.data;
            return ({condition, phytoProduct, conditionColor});
        } catch(error) {
            return ({
            });
        }
    }
}

export const getLastValues = async (token) => {
    if (token) {
        try {
            const response = await hygoApi.post('/getLastValues', {token});
            return ({
                values: response.data});
        }
        catch(error) {
            return ({
            });
        }
    }
}
export const getLastInterventions = async (token) => {
    if (token) {
        try {
            const response = await hygoApi.post('/getLastInterventions', {token});
            return ({
                interventionValues: response.data});
        }
        catch(error) {
            return ({
            });
        }
    }
}

export const getLastGeometryFields = async (deviceid, interventionid) => {
    if (interventionid) {
        try {
        
            const response = await hygoApi.post('/getLastGeometryFields', {deviceid, interventionid});

            return ({
                fieldValues: response.data});
        }
        catch(error) {
            return ({
            });
        }
    }
}

export const evalConditions = async (deviceid, phyto, humi, temp) => {
    try {
        const response = await hygoApi.post('/evalConditions', {deviceid, phyto, humi, temp});
        return (response.data);
    }
    catch(error) {
        return ({
        });
    }
}



export const updateIntervention = async (phytoProduct, deviceid, interventionid) => {
    try {
        const response = await hygoApi.post('/updateIntervention', {phytoProduct, deviceid, interventionid });
        return (response.data);
    } catch(error) {
        return ({

        });
    }
}
