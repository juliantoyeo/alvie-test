import axios from 'axios';
import { AsyncStorage } from 'react-native';
import getUserAgent from './getUserAgent';

import { fieldType } from '../types/field.types';
import { errorType } from '../types/error.types';
import { activeProductType } from '../types/activeproduct.types';
import { modulationType} from '../types/modulation.types';
import { conditionType } from '../types/condition.types'
import _ from 'lodash';
import pkg from '../../app.json'

import { CONDITIONS_ORDERING, CONDITIONS } from '../constants';

export const hygoApi = axios.create({
    baseURL: 'http://ec2-3-250-220-120.eu-west-1.compute.amazonaws.com:3000', //'http://192.168.1.35:3000',// 'https://hygo-api.alvie.fr', //
    timeout: 300000,
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
    } catch (e) {
        console.log(e)
    }
}

// Store phytoproduct changes
export const updateUI = async (phytoProduct) => {
    try {
        const res = await hygoApi.post('/app/ui', { phytoProduct });
        return res.data
    } catch (e) {
        console.log(e)
    }
}

// Store phytoproducts changes
export const updateUIPhytoProduct = async (phytoProducts) => {
    try {
        const res = await hygoApi.post('/app/ui', { phytoProducts, timestamp: (new Date()).getTime() });
        return res.data
    } catch (e) {
        console.log(e)
    }
}

export const updateUICultures = async (cultures) => {
    try {
        const res = await hygoApi.post('/app/ui', { cultures, timestamp: (new Date()).getTime() });
        return res.data
    } catch (e) {
        console.log(e)
    }
}

// Retrieve active products list
export interface getActiveProductsReturnType {
    products?: Array<activeProductType>
}
export const getActiveProducts = async (): Promise<Array<activeProductType>> => {
    try {
        const response = await hygoApi.get('/app/activeproducts');
        return response.data
    } catch (error) {
        return []
    }
}

// Get favorite products
export const getFavorites = async () => {
    try {
        const response = await hygoApi.get('/app/activeproducts/fav');
        return response.data
    } catch(error) {
        return { }
    }
}

// Updates favorite products
export const setFavorites = async (favIds: Array<number>) => {
    try {
        const response = await hygoApi.post('/app/activeproducts/fav', {favIds});
        return response.data
    } catch(error) {
        return { }
    }
}

// Retrieve phytoproduct list
export const getPhytoProducts = async () => {
    try {
        const { data } = await hygoApi.get('/app/phytoproducts')
        return data
    } catch (e) { console.log(e) }

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

        const { userName, familyName, deviceid, deviceType, hasEquipment, tester } = response.data
        return {
            errorMessage: '',
            userName, familyName, deviceid, deviceType, hasEquipment, tester
        }
    } catch (err) {
        return {
            errorMessage: 'INVALID_TOKEN',
        };
    }
}

// SignIn using a barcode
export const signInWithBarCode = async (barcode) => {
    try {
        const response = await hygoApi.post('/app/auth/barcode', { barcode });

        const { token, userName, familyName, deviceid, deviceType, hasEquipment } = response.data
        return {
            token, userName, familyName, deviceid, deviceType, hasEquipment,
            errorMessage: ''
        };
    } catch (err) {
        console.log(err);
        if (err.message.trim().match(/^Network Error/)) {
            return {
                errorMessage: 'NETWORK_ERROR'
            }
        } else {
            return {
                errorMessage: 'SIGNIN_ERROR'
            };
        }

    }
}

// Store a new pushToken for this device
export const storePushToken = async (token, deviceid) => {
    try {
        const response = await hygoApi.post('/app/pushtoken', { pushToken: token, deviceid });
        return response.data;
    } catch (error) {
        return {}
    }
}

// Save equipments
export const storeEquipmentInformation = async ({ buses, speed, pressure, soil, family }) => {
    try {
        const response = await hygoApi.post('/app/equipment', { buses, speed, pressure, soil, family });
        return response.data;
    } catch (error) {
        return {}
    }
}
export const getEquipment = async () => {
    try {
        const response = await hygoApi.get('/app/equipment')
        return response.data
    } catch (error) {
        return {}
    }
}

export const getTester = async () => {
    try {
        const response = await hygoApi.get('/app/tester')
        return response.data
    } catch (error) {
        return {}
    }
}

export const setTester = async (tester) => {
    try {
        const response = await hygoApi.post('/app/tester', {tester})
        return response.data
    } catch (error) {
        return {}
    }
}

// Retrieve next 3 hours meteo
export const getMeteo = async () => {
    try {
        const response = await hygoApi.post('/app/meteo', {})
        return response.data
    } catch (error) {
        return {}
    }
}

// Retrieve detailed meteo
export const getMeteoDetailed = async ({ day, product }) => {
    try {
        const response = await hygoApi.post('/app/meteo/detailed', { day, product })
        return response.data
    } catch (error) {
        return {}
    }
}

export const getMetrics_v2 = async ({days, fields}) => {
    /**
     * Retrieve meteo by hour and meteo by 4 hour of the days over the givenFields
     * faster than getMeteoDetailed
     * @param 
     * day = ["2020-09-09", "2020-09-08"]
     * fields : Array<fieldType>
     */
    try {
        const response = await hygoApi.post('/app/meteo/metrics/v2', { days, fields })
        return response.data
    } catch (error) {
        return []
    }
}

export const getMetrics4h_v2 = async ({days, fields}) => {
    /**
     * Retrieve meteo by hour and meteo by 4 hour of the days over the givenFields
     * faster than getMeteoDetailed
     * @param 
     * day = ["2020-09-09", "2020-09-08"]
     * fields : Array<fieldType>
     */
    try {
        const response = await hygoApi.post('/app/meteo/metrics4h/v2', { days, fields })
        return response.data
    } catch (error) {
        return []
    }
}

type getConditionV2Props = {
    day: string,
    parcelles: Array<number>,
    products: Array<number>
}

export const getConditions_v2 = async (data:getConditionV2Props): Promise<Array<conditionType>> => {
    /**
     * Retrieve compacted conditions for every hour of the day
     * Rules : the worst condition win
     */
    try {
        const { products, parcelles, day } = data
        const response = await hygoApi.post('/app/meteo/condition/v2', { products, parcelles, day })
        const conditions = response.data.map(
            ({condition, parcelleId, productId, timestamp }) => ({
                condition, parcelleId, productId, timestamp 
            }))
        const ret = _(conditions)
            .groupBy(x => x.timestamp)
            .sortBy((v)=> v.timestamp)
            .map((value, key) => Math.min(...value.map((v) => CONDITIONS_ORDERING[v.condition])))
            .value()

        return ret
    } catch (error) {
        console.log(error)
        return []
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
    } catch (error) {
        return {}
    }
}


// Retrieve modulation
type getModulationValueProps = any

export const getModulationValue = async (data) => {
    try {
        const response = await hygoApi.post('/app/modulation', { ...data })
        return response.data
    } catch (error) {
        return {}
    }
}

export const getModulationValue_v2 = async (data): Promise<Array<modulationType>> => {
    try {
        const response = await hygoApi.post('/app/modulation/v2', { ...data })
        return response.data
    } catch (error) {
        return []
    }
}

export const getModulationList = async (data: Array<getModulationValueProps>): Promise<Array<number>> => {
    try {
        const response = await hygoApi.post('/app/modulationList', { ...data })
        return response.data.modulationList
    } catch (error) {
        return []
    }
}

// Retrive interventions
export const getInterventions = async () => {
    try {
        const response = await hygoApi.post('/app/interventions', {});
        return { interventionValues: response.data }
    } catch (error) {
        return { interventionValues: [] }
    }
}

// Retrive intervention ID
export const getInterventionByID = async ({ id }) => {
    try {
        const response = await hygoApi.post('/app/interventions/details', { id });
        return response.data
    } catch (error) {
        return { intervention: {} }
    }
}

// Get Realtime data
export const getRealtimeData = async (phytoProductSelected) => {
    try {
        const response = await hygoApi.post('/app/realtime', { products: phytoProductSelected });
        return response.data
    } catch (error) {
        return {}
    }
}

// Get fields
export const getFields = async () => {
    try {
        const response = await hygoApi.get('/app/fields');
        return response.data
    } catch (error) {
        return {}
    }
}

export interface getFieldsReturnType {
    fields?: Array<fieldType>
}
export const getFields_v2 = async (): Promise<getFieldsReturnType> => {
    try {
        const response = await hygoApi.get('/app/fields/v2');
        return response.data
    } catch (error) {
        return {}
    }
}

// Update fields

export const updateField = async (field) => {
    try {
        const response = await hygoApi.post('/app/fields/update', {field});
        return response.data
    } catch(error) {
        return {}
    }
}

// Get cultures used by the farmer
export const getCultures = async () => {
    try {
        const response = await hygoApi.get('/app/cultures');
        return response.data
    } catch (error) {
        return {}
    }
}

// Get all cultures available
export const getAllCultures = async () => {
    try {
        const response = await hygoApi.get('/app/cultures/all');
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
    } catch (error) {
        return {}
    }
}

// Update intervention products
export const updateIntervention = async (products, interventionid) => {
    try {
        const response = await hygoApi.post('/app/interventions/update', { products, interventionid });
        return (response.data);
    } catch (error) {
        return ({

        });
    }
}

export const deleteIntervention = async (interventionid) => {
    try {
        const response = await hygoApi.post('/app/interventions/delete', { id: interventionid });
        return (response.data);
    } catch (error) {
        return ({

        });
    }
}

export const createIntervention = async () => {
    try {
        const response = await hygoApi.post('/app/interventions/create');
        return (response.data);
    } catch (error) {
        return ({

        });
    }
}

// Check if the database is ready (parcels and meteo datas loaded => 24h),and if a new version is needed
export const checkSetup = async () => {
    try {
        const response = await hygoApi.post('/app/checkSetup', { version: pkg.expo.version })
        return (response.data);
    } catch (error) {
        console.log(error)
        return ({})
    }
}

// Save the data computed for the pulverisation, coming from the context "Modulation"
export const saveModulationContext = async (context) => {
    try {
        const response = await hygoApi.post('/app/saveModulationContext', {context})
        return (response.data)
    } catch(error) {
        console.log(error)
        return ({error})
    }

}
