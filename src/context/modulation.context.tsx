import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { getEquipment } from '../api/hygoApi';
import COLORS from '../colors'
import { activeProductType } from '../types/activeproduct.types';
import { fieldType } from '../types/field.types';
import { meteoByHourType } from '../types/meteo.types';
import { modulationType } from '../types/modulation.types';
import { conditionType } from '../types/condition.types';
import { metricsType } from '../types/metrics.types';
import { dowType } from '../types/dow.types';

import { getMetrics_v2, getMetrics4h_v2, getConditions_v2 } from '../api/hygoApi';
import { SnackbarContext } from './snackbar.context';
import i18n from 'i18n-js';
import moment from 'moment';
import capitalize from '../utils/capitalize';

export interface ModulationContextProps {
    id: number,
    setId: React.Dispatch<React.SetStateAction<number>>,

    selectedFields?: Array<fieldType>,
    addField?: (fieldType) => void,
    removeField?: (fieldType) => void,
    cleanFields?: () => void,
    setSelectedFields?: React.Dispatch<React.SetStateAction<fieldType[]>>,

    selectedProducts?: Array<activeProductType>,
    addProduct?: (activeProductType) => void,
    removeProduct?: (activeProductType) => void,
    cleanProducts?: () => void,
    setSelectedProducts?: React.Dispatch<React.SetStateAction<activeProductType[]>>,

    debit?: number,
    setDebit?: React.Dispatch<React.SetStateAction<number>>,
    buses?: string,
    setBuses?: React.Dispatch<React.SetStateAction<string>>,

    selectedSlot?: selectedSlotType,
    setSelectedSlot?: React.Dispatch<React.SetStateAction<selectedSlotType>>,
    mod?: Array<modulationType>,
    setMod?: React.Dispatch<React.SetStateAction<modulationType[]>>,
    metrics?: metricsType,
    setMetrics?: React.Dispatch<React.SetStateAction<metricsType>>,

    dow?: Array<dowType>,
    currentDay?: number,
    setCurrentDay?: React.Dispatch<React.SetStateAction<number>>,
    selectedDay: Date,
    setSelectedDay: React.Dispatch<React.SetStateAction<Date>>,

    meteo?: Array<Array<meteoByHourType>>,
    setMeteo?: React.Dispatch<React.SetStateAction<Array<Array<meteoByHourType>>>>,
    meteo4h?: Array<any>
    setMeteo4h?: (any) => any,
    loadMeteo?: () => void,

    conditions?: Array<dailyConditionType>,
    loadConditions?: () => void,

    setContext: (c: ModulationContextProps) => void,
    isReady: boolean,
    initContext: () => void

    toText: () => string
}

export interface savedReportType {
    context: ModulationContextProps,
    id: number
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


export type dailyConditionType = Array<conditionType>

export const ModulationContext = React.createContext<ModulationContextProps>({} as ModulationContextProps);

const ModulationProvider: React.FunctionComponent = ({ children }) => {
    const MONTHS = [
        i18n.t('months.january'),
        i18n.t('months.february'),
        i18n.t('months.march'),
        i18n.t('months.april'),
        i18n.t('months.may'),
        i18n.t('months.june'),
        i18n.t('months.july'),
        i18n.t('months.august'),
        i18n.t('months.september'),
        i18n.t('months.october'),
        i18n.t('months.november'),
        i18n.t('months.december'),
    ]


    const now = new Date()
    const snackbar = React.useContext(SnackbarContext)
    const [id, setId] = useState<number>()  //id in db
    const [selectedFields, setSelectedFields] = useState<Array<fieldType>>([])
    const [selectedProducts, setSelectedProducts] = useState<Array<activeProductType>>([])
    const [debit, setDebit] = useState<number>(100)
    const [buses, setBuses] = useState<string>(null)
    const [selectedSlot, setSelectedSlot] = useState<selectedSlotType>({ min: 9, max: 12 })
    const [mod, setMod] = useState<Array<modulationType>>([])
    const [metrics, setMetrics] = useState<metricsType>(null)
    const [meteo, setMeteo] = useState<Array<Array<meteoByHourType>>>(null)
    const [meteo4h, setMeteo4h] = useState<Array<any>>(null)
    const [conditions, setConditions] = useState<Array<dailyConditionType>>(null)
    const [currentDay, setCurrentDay] = useState<number>(0)
    const [selectedDay, setSelectedDay] = useState<Date>(now)
    const [isReady, setIsReady] = useState<boolean>(false)

    useEffect(() => {
        const r = !!id &&
            !!selectedFields &&
            !!selectedProducts &&
            !!debit &&
            !!buses &&
            !!selectedSlot &&
            !!mod &&
            !!metrics &&
            !!meteo &&
            !!meteo4h &&
            !!conditions &&
            (typeof currentDay !== 'undefined')
        setIsReady(r)
    }, [
        id,
        selectedFields,
        selectedProducts,
        debit,
        buses,
        selectedSlot,
        mod,
        metrics,
        meteo,
        meteo4h,
        conditions,
        currentDay]
    )

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
            snackbar.showSnackbar(i18n.t('snackbar.meteo_error'), "ALERT")
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
            snackbar.showSnackbar(i18n.t('snackbar.condition_error'), "ALERT")
        }
    }

    /*=============== Set the whole context =============*/
    const setContext = (savedContext: ModulationContextProps) => {
        setId(savedContext.id)
        setSelectedFields(savedContext.selectedFields)
        setSelectedProducts(savedContext.selectedProducts)
        setDebit(savedContext.debit)
        setBuses(savedContext.buses)
        setSelectedSlot(savedContext.selectedSlot)
        setMod(savedContext.mod)
        setMetrics(savedContext.metrics)
        setCurrentDay(savedContext.currentDay)
        setMeteo(savedContext.meteo)
        setMeteo4h(savedContext.meteo4h)
        setConditions(savedContext.conditions)
        const dt = new Date(savedContext.selectedDay)
        setSelectedDay(dt)
    }

    const initContext = () => {
        setId(null)
        setSelectedFields([])
        setSelectedProducts([])
        setDebit(100)
        setBuses(null)
        setSelectedSlot({ min: 9, max: 12 })
        setMod([])
        setMetrics(null)
        setCurrentDay(0)
        setMeteo(null)
        setMeteo4h(null)
        setConditions(null)
        setSelectedDay(now)
    }

    const toText = (header = '', footer= '') => {
        try {

            const getDay = (dt: Date) => {
                return `${dt.getDate()} ${capitalize(MONTHS[dt.getMonth()])} ${dt.getFullYear()}`
            }
            const textParcel = (f)=>`     ${f.name} - ${(f.area/10000).toFixed(1)}ha\n `
            const  textProduct = (p)=>`     ${p.name} (${(p.dose * (100 - mod[0].mod) / 100).toFixed(3)} ${p.unit}): ${(p.dose * totalArea / 10000 * (100 - mod[0].mod) / 100).toFixed(1)} L\n `

            const totalArea = selectedFields.reduce((r, f) => r + f.area, 0)
            const volume = totalArea / 10000 * debit
            const totalPhyto = totalArea / 10000 * selectedProducts.reduce((r, p) => r + p.dose, 0)
            const water = volume - totalPhyto
            const modAvg = mod.length > 0 ? mod.reduce((sum, m) => sum + m.mod, 0) / mod.length : 0
            const text = `
${header}
Intervention du ${getDay(selectedDay)}
${selectedSlot.min}h - ${selectedSlot.max + 1}h

Débit: ${debit}L/ha
Type de buses: ${buses}
Total économisé: ${(totalPhyto * modAvg / 100).toFixed(1)}L (${modAvg.toFixed(0)}%)

Surface totale: ${(totalArea / 10000).toFixed(1)}ha
Parcelles: \n${selectedFields.map((f) => textParcel(f))}

Volume de bouillie: ${volume.toFixed(1)}L
Eau: ${water.toFixed(1)}L
Produits: \n${selectedProducts.map((p) => textProduct(p))}
${footer}
--
Calculé grâce à Hygo`
                return text
            }catch(e){
                return ('')
            }
    }

    return (
        <ModulationContext.Provider value={{ 
            id, setId,
            selectedFields, addField, removeField, cleanFields, setSelectedFields,
            selectedProducts, addProduct, removeProduct, cleanProducts, setSelectedProducts,
            debit, setDebit, buses, setBuses,
            selectedSlot, setSelectedSlot, mod, setMod, metrics, setMetrics,
            dow, currentDay, setCurrentDay, selectedDay, setSelectedDay,
            meteo, setMeteo, meteo4h, setMeteo4h, loadMeteo,
            conditions, loadConditions,
            setContext, isReady, initContext,
            toText
        }}>
            {children}
        </ModulationContext.Provider>
    );
};

export default ModulationProvider
