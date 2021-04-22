import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { getEquipment } from '../api/hygoApi';
import COLORS from '../colors'

import { activeProductType } from '../types/activeproduct.types';
import { fieldType } from '../types/field.types';
import { meteoByHourType } from '../types/meteo.types';
import { metricsType } from '../types/metrics.types';
import { dowType } from '../types/dow.types';

import { conditionType } from '../types/condition.types';
import { getMetrics_v2, getMetrics4h_v2, getConditions_v2 } from '../api/hygoApi';
import { SnackbarContext } from './snackbar.context';
import { connect } from 'react-redux'
import i18n from 'i18n-js';
import moment from 'moment';
import _ from 'lodash'

export interface MeteoContextProps {

    metrics?: metricsType,
    setMetrics?: any

    dow?: Array<dowType>,
    currentDay?: number,
    setCurrentDay?: any,

    meteo?: Array<Array<meteoByHourType>>,
    setMeteo?: any
    meteo4h?: Array<any>
    setMeteo4h?: any,
    loadMeteo?: any,

	loadMeteoAndConditions?: any

    conditions?: Array<dailyConditionType>
    loadConditions?: any
}

interface meteoContextStateType {
	meteo: Array<Array<meteoByHourType>>,
	meteo4h: Array<any>,
	conditions: Array<dailyConditionType>
}

export type dailyConditionType = Array<conditionType>

export const MeteoContext = React.createContext<MeteoContextProps>({});

const MeteoProvider = ({ children }) => {

	const snackbar = React.useContext(SnackbarContext)

	const [meteoState, setMeteoState] = useState<meteoContextStateType>({
		meteo: [],
		meteo4h: [],
		conditions: null
	})
    const [meteo, setMeteo] = useState<Array<Array<meteoByHourType>>>()
    const [meteo4h, setMeteo4h] = useState<Array<any>>()
    const [metrics, setMetrics] = useState<metricsType>()
    const [conditions, setConditions] = useState<Array<dailyConditionType>>(null)
    const [currentDay, setCurrentDay] = useState<number>(0)

    // The five days we analyse over
    const dow: Array<dowType> = [...Array(5).keys()].map((i) => (
        moment.utc().add(i, 'day'))
    ).map((d) => ({ dt: d.format('YYYY-MM-DD'), name: d.format('dddd') }))

	const getMeteo = async (fields: Array<fieldType>) => {
		try {
			const data = await getMetrics_v2({ days: dow.map((d) => d.dt), fields })
			const data4h = await getMetrics4h_v2(({ days: dow.map((d) => d.dt), fields }))
			return { data, data4h }
		} catch (error) {
			return { data : null, data4h: null }
			snackbar.showSnackbar(i18n.t('snackbar.meteo_error'), "ALERT")
		}
    }

	const getConditions = async (fields:Array<fieldType>, products:Array<activeProductType>) => {
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
						products: [6], //products.map((p) => p.phytoproduct.id),
						parcelles: fields.map((f) => f.id)
					}))
				}
				))
			return data
		} catch (e) {
			return null
			snackbar.showSnackbar(i18n.t('snackbar.condition_error'), "ALERT")
		}
	}

	const loadMeteoAndConditions = async (fields: Array<fieldType>, products:Array<activeProductType>) => {
		let newMeteo = []
		let newMeteo4h = []
		let newConditions = null

		const meteoRes = await getMeteo(fields)
		const conditionRes = await getConditions(fields, products)
		const newMeteoState = {
			meteo: meteoRes.data,
			meteo4h: meteoRes.data4h,
			conditions: conditionRes
		}
		if (!_.isEqual(meteoState, newMeteoState))
			setMeteoState(newMeteoState)
	}

    /*====== Meteo ======*/
    const loadMeteo = async (fields: Array<fieldType>) => {
        try {
            const data = await getMetrics_v2({ days: dow.map((d) => d.dt), fields })
            const data4h = await getMetrics4h_v2(({ days: dow.map((d) => d.dt), fields }))
            setMeteo(data)
            setMeteo4h(data4h)
        } catch (error) {
            setMeteo(null)
            snackbar.showSnackbar(i18n.t('snackbar.meteo_error'), "ALERT")
        }
    }

	// TODO : use the active products or redefine a specific algorithm
    const loadConditions = async (fields:Array<fieldType>, products:Array<activeProductType>) => {
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
                        products: [6], //products.map((p) => p.phytoproduct.id),
                        parcelles: fields.map((f) => f.id)
                    }))
                }
                ))
            setConditions(data)
        } catch (e) {
            setConditions(null)
            snackbar.showSnackbar(i18n.t('snackbar.condition_error'), "ALERT")
        }
    }

    /*========= Metrics ======*/
    useEffect(() => {
        const buildMetrics = async () => {
            // build metrics for the whole day : between 5h and 22h
            if (!!meteoState.meteo) {
                setMetrics(null)
            }
            const minval = -99999, maxval = 99999
            let chd: metricsType = {}, dir = []
            _.forEach(meteoState.meteo[currentDay], (v, k2) => {
                const h = v.hour.toString().padStart(2, '0')
                if (parseInt(h) < 5 || parseInt(h) > 22) {
                    return
                }
                chd.wind = Math.max((chd.wind || minval), v.wind)
                chd.gust = Math.max((chd.gust || minval), v.gust)

                chd.precipitation = (chd.precipitation || 0) + v.precipitation
                chd.probabilityCnt = (chd.probabilityCnt || 0) + 1
                chd.probabilitySum = (chd.probabilitySum || 0) + parseFloat(v.probability)

                chd.prevprecipitation = (chd.prevprecipitation || 0) + (parseInt(h) < 22 ? v.precipitation : 0)

                chd.mintemp = Math.min((chd.mintemp || maxval), v.mintemp)
                chd.maxtemp = Math.max((chd.maxtemp || minval), v.maxtemp)

                chd.minhumi = Math.min((chd.minhumi || maxval), v.minhumi)
                chd.maxhumi = Math.max((chd.maxhumi || minval), v.maxhumi)

                chd.minsoilhumi = Math.min((chd.minsoilhumi || maxval), v.soilhumi)
                chd.maxsoilhumi = Math.max((chd.maxsoilhumi || minval), v.soilhumi)

                dir.push(v.winddirection)

                chd.r2 = Math.max((chd.r2 || minval), v.r2)
                chd.r3 = Math.max((chd.r3 || minval), v.r3)
                chd.r6 = Math.max((chd.r6 || minval), v.r6)
                chd.t3 = Math.min((chd.t3 || maxval), v.t3)

                chd.deltatemp = Math.max((chd.deltatemp || minval), v.deltatemp)
            })

            chd.winddirection = _.head(_(dir).countBy().entries().maxBy(_.last));
            chd.probability = chd.probabilityCnt > 0 ? chd.probabilitySum / chd.probabilityCnt : 0.0
            setMetrics(chd)
        }

        !!meteoState.meteo && buildMetrics()
    }, [meteoState.meteo, currentDay])

	const value = React.useMemo(() => ({
		dow, currentDay, setCurrentDay,
		meteo: meteoState.meteo, setMeteo, meteo4h: meteoState.meteo4h, setMeteo4h, loadMeteo,
		loadMeteoAndConditions,
		metrics, setMetrics,
		conditions: meteoState.conditions, loadConditions
	}), [currentDay, meteoState, metrics, conditions])

	// const value = {
	// 	dow, currentDay, setCurrentDay,
	// 	meteo, setMeteo, meteo4h, setMeteo4h, loadMeteo,
	// 	loadMeteoAndConditions,
	// 	metrics, setMetrics,
	// 	conditions, loadConditions
	// }

    return (
        <MeteoContext.Provider value={value}>
            {children}
        </MeteoContext.Provider>
    );
};

export default React.memo(MeteoProvider);
