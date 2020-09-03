import React, { useState } from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import COLORS from '../colors'

export interface ModulationContextProps {
    addField: any,
    removeField: any,
    cleanFields: any
}
export type selectedFieldsType = {

}

export const ModulationContext = React.createContext<ModulationContextProps>({});

export const ModulationProvider: React.FunctionComponent = ({ children }) => {

    const [selectedFields, setSelectedFields] = useState<any>([])
    const [selectedProducts, setSelectedProducts] = useState<any>([])
    const [selectedSlot, setSelectedSlot] = useState<any>([])
    const addField = (field) => {
        setSelectedFields([...selectedFields, field])
        console.log(selectedFields)
    }
    const removeField = (field) => {
        setSelectedFields([...selectedFields.filter((f) => f.id != field.id)])
        console.log(selectedFields)
    }
    const cleanFields = () => { setSelectedFields([]) }
    return (
        <ModulationContext.Provider value={{ addField, removeField, cleanFields }}>
            {children}
        </ModulationContext.Provider>
    );
};
