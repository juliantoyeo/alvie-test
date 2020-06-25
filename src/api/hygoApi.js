import axios from 'axios';
import { AsyncStorage } from 'react-native';

import getUserAgent from './getUserAgent'

export const hygoApi = axios.create({
    baseURL: 'http://192.168.1.35:3000', //'https://hygo-api.alvie.fr',
    //port: 3000,
    timeout: 30000,
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
export const updateUI = async (phytoProduct) => {
    try {
        const res = await hygoApi.post('/app/ui', { phytoProduct });
        return res.data
    } catch(e) {
        console.log(e)
    }
}

// Store phytoproducts changes
export const updateUIPhytoProduct = async (phytoProducts) => {
    try {
        const res = await hygoApi.post('/app/ui', { phytoProducts, timestamp: (new Date()).getTime() });
        return res.data
    } catch(e) {
        console.log(e)
    }
}

export const updateUICultures = async (cultures) => {
    try {
        const res = await hygoApi.post('/app/ui', { cultures, timestamp: (new Date()).getTime() });
        return res.data
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

        const { userName, familyName, deviceid, deviceType, hasEquipment } = response.data
        return {
            errorMessage: '',
            userName, familyName, deviceid, deviceType, hasEquipment
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
        
        const { token, userName, familyName, deviceid, deviceType, hasEquipment } = response.data
        return {
            token, userName, familyName, deviceid, deviceType, hasEquipment,
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

// Save equipments
export const storeEquipmentInformation = async ({ buses, speed, pressure, soil, family }) => {
    try {
        const response = await hygoApi.post('/app/equipment', {buses, speed, pressure, soil, family });
        return response.data;
    } catch (error) {
        return {}
    }
}
export const getEquipment = async () => {
    try {
        const response = await hygoApi.get('/app/equipment')
        return response.data
    } catch(error) {
        return {}
    }
}

// Retrieve next 3 hours meteo
export const getMeteo = async () => {
    try {
        const response = await hygoApi.post('/app/meteo', {})
        return response.data
    } catch(error) {
        return {}
    }
}

// Retrieve detailed meteo
export const getMeteoDetailed = async ({ day, product }) => {
    try {
        const response = await hygoApi.post('/app/meteo/detailed', { day, product })
        return response.data
    } catch(error) {
        return {}
    }
}

// Retrieve detailed meteo for intervention planning
export const getMeteoIntervention = async ({ products, cultures }) => {
    if (products.length === 0 || cultures.length === 0) {
        return {}
    }
    
    try {
        const response = await hygoApi.post('/app/meteo/intervention', { products, cultures })
        return response.data
    } catch(error) {
        return {}
    }
}

// Retrieve modulation
export const getModulationValue = async (data) => {
    try {
        const response = await hygoApi.post('/app/modulation', { ...data })
        return response.data
    } catch(error) {
        return {}
    }
}

// Retrive interventions
export const getInterventions = async () => {
    try {
        const response = await hygoApi.post('/app/interventions', {});
        return { interventionValues: response.data }
    } catch(error) {
        return { interventionValues: [] }
    }
}

// Retrive intervention ID
export const getInterventionByID = async ({ id }) => {
    try {
        const response = await hygoApi.post('/app/interventions/details', { id });
        return response.data
    } catch(error) {
        return { intervention: {} }
    }
}

// Get Realtime data
export const getRealtimeData = async (phytoProductSelected) => {
    try {
        const response = await hygoApi.post('/app/realtime', { products: phytoProductSelected });
        return response.data
    } catch(error) {
        return { }
    }
}

// Get fields
export const getFields = async () => {
    try {
        const response = await hygoApi.get('/app/fields');
        return response.data
    } catch(error) {
        return { }
    }
}

// Get cultures
export const getCultures = async () => {
    try {
        const response = await hygoApi.get('/app/cultures');
        return response.data
    } catch(error) {
        return { }
    }
}

// Get Meteo Radar
export const getMeteoRadar = async () => {
    try {
        const response = await hygoApi.get('/app/radar');
        return response.data
    } catch(error) {
        return { }
    }
}

// Update intervention products
export const updateIntervention = async (products, interventionid) => {
    try {
        const response = await hygoApi.post('/app/interventions/update', {products, interventionid });
        return (response.data);
    } catch(error) {
        return ({

        });
    }
}

export const deleteIntervention = async (interventionid) => {
    try {
        const response = await hygoApi.post('/app/interventions/delete', {id: interventionid});
        return (response.data);
    } catch(error) {
        return ({

        });
    }
} 

// Check if the database is ready (parcels and meteo datas loaded => 24h)
export const checkSetup = async () => {
    try {
        const response = await hygoApi.get('/app/checkSetup')
        return (response.data);
    } catch(error) {
        console.log(error)
        return ({})
    }
}