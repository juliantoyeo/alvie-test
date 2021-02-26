import { activeProductType } from "../types/activeproduct.types";


export const convertProductUnit = (unit: string): string => {
    const unitTable = {
        'g/ha':'g',
        'L/ha': 'L',
        'kg/ha': 'kg'
    }
    try {
        const ret = unitTable[unit]
        if (typeof ret === 'string')
            return ret
        else
            throw new Error('Error convertProductUnit') 
    } catch(e) {
        console.log(e)
        return ''
    }
}
export const convertDoseToVolume = (product: activeProductType): number => {
    const conversionCoeff = {
        'g/ha': 0.001,
        'L/ha': 1,
        'kg/ha': 1
    } 
    try {
        const ret = conversionCoeff[product.unit] * product.dose
        if (typeof ret === 'number')
            return ret;
        else 
            throw new Error("Error convertDoseToVolume")
    } catch(e) {
        console.log(e)
        return null
    }
}