import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { getEquipment } from '../api/hygoApi';
import COLORS from '../colors'
import { activeProductType } from '../types/activeproduct.types';
import { fieldType } from '../types/field.types';
import { meteoDataType } from '../types/meteo.types';
import { modulationType } from '../types/modulation.types';
import { conditionType } from '../types/condition.types';
import { getMetrics_v2, getMetrics4h_v2, getConditions_v2 } from '../api/hygoApi';
import { SnackbarContext } from './snackbar.context';
import moment from 'moment';

export interface ModulationContextProps {
    selectedFields?: Array<fieldType>,
    addField?: any,
    removeField?: any,
    cleanFields?: any,
    setSelectedFields?: any,

    selectedProducts?: Array<activeProductType>,
    addProduct?: any,
    removeProduct?: any,
    cleanProducts?: any,
    setSelectedProducts?: any

    debit?: number,
    setDebit?: any,
    buses? :string,
    setBuses? : any,

    selectedSlot?: selectedSlotType,
    setSelectedSlot?: any,
    mod?: Array<modulationType>,
    setMod?: any,
    metrics?: metricsType,
    setMetrics? : any

    dow?: Array<dowType>

    meteo?: meteoDataType,
    setMeteo?: any
    meteo4h?: Array<any>
    setMeteo4h?: any,
    loadMeteo: any

    conditions?: Array<dailyConditionType>
    loadConditions?: any
}
// export type selectedFieldType = {
//     type: string,
//     name: string,
//     area: number,
//     selected: boolean,
//     id: number
// }
// export type selectedProductType = {
//     type: string,
//     name: string,
//     dose: number,
//     selected?: boolean,
//     id: number
// }
export type selectedSlotType = {
    min: number,
    max: number
}
export type metricsType ={
    winddirection: string,
    wind: number,
    gust: number,
    precipitation: number,
    probability: number,
    mintemp: number,
    maxtemp: number,
    minhumi: number,
    maxhumi: number,
    minsoilhumi: number,
    maxsoilhumi: number,
}

export type dowType = {
    dt: string,
    name: string
}

export type dailyConditionType = Array<conditionType>

export const ModulationContext = React.createContext<ModulationContextProps>({});

export const ModulationProvider: React.FunctionComponent = ({ children }) => {
    
    const snackbar = React.useContext(SnackbarContext)

    const [selectedFields, setSelectedFields] = useState<Array<fieldType>>([])
    const [selectedProducts, setSelectedProducts] = useState<Array<activeProductType>>([])
    const [debit, setDebit] = useState<number>(100)
    const [buses, setBuses] = useState<string>()
    const [selectedSlot, setSelectedSlot] = useState<selectedSlotType>({min:9, max:12})
    const [mod, setMod] = useState<Array<modulationType>>([])
    const [metrics, setMetrics] = useState<metricsType>()
    const [meteo, setMeteo] = useState<meteoDataType>()
    const [meteo4h, setMeteo4h] = useState<Array<any>>()
    const [conditions, setConditions] = useState<Array<dailyConditionType>>(null)

    // The five days we analyse over
    const dow: Array<dowType> = [...Array(5).keys()].map((i) => (
        moment.utc().add(i, 'day'))
    ).map((d) => ({ dt: d.format('YYYY-MM-DD'), name: d.format('dddd') }))
    
    /*====== Fields ======*/
    const addField = (field: fieldType) => {
        setSelectedFields([...selectedFields, field])
    }
    const removeField = (id: number) => {
        setSelectedFields([...selectedFields.filter((f) => f.id != id)])
    }
    const cleanFields = () => { setSelectedFields([]) }

    /*====== Products =====*/
    const addProduct = (prod: activeProductType) => {
        setSelectedProducts([...selectedProducts, prod])
    }
    const removeProduct = (id: number) => {
        setSelectedProducts([...selectedProducts.filter((p) => p.id != id)])
    }
    const cleanProducts = () => { setSelectedProducts([]) }

    /*====== Meteo ======*/
    const loadMeteo = async () => {
        try {
            const data = await getMetrics_v2({ days: dow.map((d) => d.dt), fields: selectedFields })
            const data4h = await getMetrics4h_v2(({ days: dow.map((d) => d.dt), fields: selectedFields }))
            setMeteo(data)
            setMeteo4h(data4h)
        } catch (error) {
            setMeteo(null)
            snackbar.showSnackbar("Erreur dans le chargement météo", "ALERT")
        }
    }
    
    const loadConditions = async () => {
        let now = moment.utc()
        if (now.minutes() >= 30) {
            now.hours(now.hours() + 1)
        }
        now = now.startOf('day')
        // array of the 5 next days to iterate on
        const dt = [...Array(5).keys()].map((i) => now.add(i == 0 ? 0 : 1, 'day').format('YYYY-MM-DD'))
        try {
            const data: Array<dailyConditionType> = await Promise.all(
                dt.map((day) => {
                    return (getConditions_v2({
                        day,
                        products: selectedProducts.map((p) => p.phytoproduct.id),
                        parcelles: selectedFields.map((f) => f.id)
                    }))
                }
                ))
            setConditions(data)
        } catch (e) {
            setConditions(null)
            snackbar.showSnackbar("Erreur dans le chargement des conditions", "ALERT")
        }
    }
    return (
        <ModulationContext.Provider value={{ 
            selectedFields, addField, removeField, cleanFields, setSelectedFields,
            selectedProducts, addProduct, removeProduct, cleanProducts, setSelectedProducts,
            debit, setDebit, buses, setBuses,
            selectedSlot, setSelectedSlot, mod, setMod, metrics, setMetrics,
            dow,
            meteo, setMeteo, meteo4h, setMeteo4h, loadMeteo,
            conditions, loadConditions
        }}>
            {children}
        </ModulationContext.Provider>
    );
};
