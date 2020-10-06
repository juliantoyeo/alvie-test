import React, { useState } from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import COLORS from '../colors'
import { activeProductType } from '../types/activeproduct.types';
import { fieldType } from '../types/field.types';
import { modulationType } from '../types/modulation.types';

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

export const ModulationContext = React.createContext<ModulationContextProps>({});

export const ModulationProvider: React.FunctionComponent = ({ children }) => {

    const [selectedFields, setSelectedFields] = useState<Array<fieldType>>([])
    const [selectedProducts, setSelectedProducts] = useState<Array<activeProductType>>([])
    const [debit, setDebit] = useState<number>(100)
    const [buses, setBuses] = useState<string>()
    const [selectedSlot, setSelectedSlot] = useState<selectedSlotType>({min:9, max:12})
    const [mod, setMod] = useState<Array<modulationType>>([])
    const [metrics, setMetrics] = useState<metricsType>()

    const addField = (field: fieldType) => {
        setSelectedFields([...selectedFields, field])
    }
    const removeField = (id: number) => {
        setSelectedFields([...selectedFields.filter((f) => f.id != id)])
    }
    const cleanFields = () => { setSelectedFields([]) }

    const addProduct = (prod: activeProductType) => {
        setSelectedProducts([...selectedProducts, prod])
    }
    const removeProduct = (id: number) => {
        setSelectedProducts([...selectedProducts.filter((p) => p.id != id)])
    }
    const cleanProducts = () => { setSelectedProducts([]) }

    return (
        <ModulationContext.Provider value={{ 
            selectedFields, addField, removeField, cleanFields, setSelectedFields,
            selectedProducts, addProduct, removeProduct, cleanProducts, setSelectedProducts,
            debit, setDebit, buses, setBuses,
            selectedSlot, setSelectedSlot, mod, setMod, metrics, setMetrics,
        }}>
            {children}
        </ModulationContext.Provider>
    );
};
