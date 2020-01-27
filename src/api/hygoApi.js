import axios from 'axios';

export const trackerApi = axios.create(
{
    baseURL: 'https://api.alvie.fr',
    timeout: 1000,
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
            // console.log('interventionid 2');
            // console.log(interventionid);
            // console.log('deviceid 2');
            // console.log(deviceid);
            const response = await trackerApi.post('/getLastGeometryFields', {deviceid, interventionid});
            // console.log('response.data :');
            // console.log(response.data);
            
            return ({
                fieldValues: response.data});
        }
        catch(error) {
            return ({
            });
        }
    }
}

export const evalConditions = async (phyto, humi, temp) => {
    try {
        const response = await trackerApi.post('/evalConditions', {phyto, humi, temp});
        return (response.data);
    }
    catch(error) {
        return ({
        });
    }
}
