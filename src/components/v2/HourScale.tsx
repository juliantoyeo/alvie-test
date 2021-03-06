import React, { useCallback } from 'react'

import { StyleSheet, View, Text, Dimensions } from 'react-native'

import { PADDED } from '../../constants';

const HourScale = ({ hour, color }) => {
    const styles = StyleSheet.create({
        hoursDetailsContainer: {
            flexDirection: 'row',
            display: 'flex',
            marginBottom: 40,
            marginHorizontal: 15
        },
        hoursDetails: {
            fontFamily: 'nunito-bold',
            fontSize: 12,
            color: color ? color : '#fff',
            position: 'absolute'
        },
    })

    const getHour = useCallback((i) => {
        return `${PADDED[(parseInt(hour) + i) % 24]}H`
    }, [hour])

    const getWidth = useCallback(() => {
        return (Dimensions.get('window').width - 30) / 12
    }, [])

    return (
        <View style={styles.hoursDetailsContainer}>
            <Text style={[styles.hoursDetails, { left: 0 * getWidth() }]}>{getHour(0)}</Text>
            <Text style={[styles.hoursDetails, { left: 3 * getWidth() }]}>{getHour(6)}</Text>
            <Text style={[styles.hoursDetails, { left: 6 * getWidth() }]}>{getHour(12)}</Text>
            <Text style={[styles.hoursDetails, { left: 9 * getWidth() }]}>{getHour(18)}</Text>
            {/* <Text style={[styles.hoursDetails, { left: 11 * getWidth()}]}>{getHour(23)}</Text> */}
        </View>
    )
}

export const HourScale2 = ({width, color}) => {
    
    return (
        <View style={{ width: width + 10, display: 'flex', flexDirection: 'row' }}>
            <Text style={[styles.hoursDetails, {flex:1}]}>0h</Text>
            <Text style={[styles.hoursDetails, {flex:1}]}>6h</Text>
            <Text style={[styles.hoursDetails, {flex:1}]}>12h</Text>
            <View style={{flex:1,display:'flex', justifyContent:'space-between', flexDirection:'row'}}>
                <Text style={styles.hoursDetails}>18h</Text>
                <Text style={styles.hoursDetails}>23h</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    hoursDetails: {
        fontFamily: 'nunito-bold',
        fontSize: 12,
        color: 'white',
       
    },
})

export default HourScale