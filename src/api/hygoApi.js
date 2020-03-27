import axios from 'axios';

import getUserAgent from './getUserAgent'

export const trackerApi = axios.create(
{
    baseURL: 'https://staging.alvie.fr',
    timeout: 3000,
    headers: { 
        'User-Agent': getUserAgent()
    },
});

/*
trackerApi.interceptors.request.use(request => {
    console.log('Starting Request', request)
    return request
   })
*/
export const signUp = async (email, password) => {
    try
    {
        const response =  await trackerApi.post('/signup', {email, password});
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

export const signInWithBarCode = async (barcode) => {
    try
    {
        
        const response =  await trackerApi.post('/signinwithbarcode',{barcode});
        return ({
            token: response.data.token,
            userName: response.data.userName.charAt(0).toUpperCase()+response.data.userName.slice(1),
            familyName: response.data.familyName.charAt(0).toUpperCase()+response.data.familyName.slice(1),
            deviceid: response.data.deviceid,
            deviceType: response.data.deviceType,
            errorMessage: ''
        });
    } catch(err)
    {
        console.log(err);
        return ({
            token: '',
            errorMessage: 'Erreur lors de l\'enregistrement'
        });
    }
}

export const checkToken = async (token) => {
    if (!token) {
        return ({
            errorMessage: 'No Token',
            userName: ''
        });
    }
    else {
        try{
            const response = await trackerApi.post('/checkToken', {token});
            return ({
                errorMessage: '',
                userName: response.data.userName.charAt(0).toUpperCase()+response.data.userName.slice(1),
                familyName: response.data.familyName.charAt(0).toUpperCase()+response.data.familyName.slice(1),
                deviceid: response.data.deviceid,
                deviceType: response.data.deviceType,
            });
        }
        catch(err) {
            return ({
                errorMessage: 'Invalide stored token',
                userName: ''
            });
        }
    }
}

export const getLastValue = async(token) => {
    if (token) {
        try {
            const response  = await trackerApi.post('/getLastValue', {token});
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
            const response  = await trackerApi.post('/getLastCondition', {token});
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
            const response = await trackerApi.post('/getLastValues', {token});
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
            const response = await trackerApi.post('/getLastInterventions', {token});
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
        
            const response = await trackerApi.post('/getLastGeometryFields', {deviceid, interventionid});

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
        const response = await trackerApi.post('/evalConditions', {deviceid, phyto, humi, temp});
        return (response.data);
    }
    catch(error) {
        return ({
        });
    }
}

export const storePushToken = async (token, deviceid)=> {
    try {
        const response = await trackerApi.post('/storePushToken', {pushToken: token, deviceid});
        return (response.data);
    }
    catch (error) {
        return ({

        });
    }
}

export const updateUI = async (phytoProduct, deviceid) => {
    try {
        const response = await trackerApi.post('/updateUI', {phytoProduct, deviceid});
        return (response.data);
    } catch(error) {
        return ({

        });
    }
}

export const updateIntervention = async (phytoProduct, deviceid, interventionid) => {

    try {
        const response = await trackerApi.post('/updateIntervention', {phytoProduct, deviceid, interventionid });
        return (response.data);
    } catch(error) {
        return ({

        });
    }
}
