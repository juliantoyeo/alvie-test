import React, { useState } from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import COLORS from '../colors'

export interface ModulationContextProps {
    selectedFields?: any,
    addField?: any,
    removeField?: any,
    cleanFields?: any,
    setSelectedFields?: any,

    selectedProducts?: any,
    addProduct?: any,
    removeProduct?: any,
    cleanProducts?: any,
    setSelectedProducts?: any

    debit?: number,
    setDebit?: any
}
export type selectedFieldType = any
export type selectedProductType = {
    type: string,
    name: string,
    dose: number,
    selected?: boolean,
    id: number
}
export type selectedSlotType = any
export const ModulationContext = React.createContext<ModulationContextProps>({});

export const ModulationProvider: React.FunctionComponent = ({ children }) => {

    const [selectedFields, setSelectedFields] = useState<Array<selectedFieldType>>([])
    const [selectedProducts, setSelectedProducts] = useState<Array<selectedProductType>>([])
    const [selectedSlot, setSelectedSlot] = useState<Array<selectedSlotType>>([])
    const [debit, setDebit] = useState<number>(100)

    const addField = (field: selectedFieldType) => {
        setSelectedFields([...selectedFields, field])
    }
    const removeField = (id: number) => {
        setSelectedFields([...selectedFields.filter((f) => f.id != id)])
    }
    const cleanFields = () => { setSelectedFields([]) }

    const addProduct = (prod: selectedProductType) => {
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
            debit, setDebit
        }}>
            {children}
        </ModulationContext.Provider>
    );
};
