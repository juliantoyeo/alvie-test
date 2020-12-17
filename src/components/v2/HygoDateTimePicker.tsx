import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, Modal, View, Platform } from 'react-native'
import HygoButton from './HygoButton';
import { min } from 'moment';

const HygoDateTimePicker = ({ hour, minHour, maxHour, onChange, onClose }) => {
    return (Platform.OS === 'ios' ? (
        <Modal
            animationType='fade'
            transparent={true}
            visible={true}
        // onRequestClose={}
        >
            <View style={[styles.backdrop, StyleSheet.absoluteFill]} />
            <View style={{ justifyContent: "center", flex: 1 }}>
                <View style={styles.modalView}>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(2020, 1, 1, hour, 0, 0)}
                        minimumDate={new Date(2020, 1, 1, minHour, 0, 0)}
                        maximumDate={new Date(2020, 1, 1, maxHour, 0, 0)}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        minuteInterval={30}
                    />
                    <HygoButton
                        label='OK'
                        onPress={() => {
                            onClose()
                        }}
                        enabled={true}
                    />
                </View>
            </View>
        </Modal>
    ) : (
            <DateTimePicker
                testID="dateTimePicker"
                value={new Date(2020, 1, 1, hour, 0, 0)}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, date) => {
                    onClose()
                    onChange(event, date)
                    
                }}
                minuteInterval={30}
            />
        )
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "center",
        //alignItems: "center",
        // marginTop: 22,
        backgroundColor: "black",
        opacity: 0.5
    },
    modalView: {
        //margin: 20,
        backgroundColor: "white",
        borderTopRightRadius: 20,
        // padding: 35,
        //alignItems: "center",
        shadowOffset: { width: 0, height: 2 },
        shadowColor: '#000000',
        shadowRadius: 2,
        shadowOpacity: .2,
        elevation: 5,
    },
})


export default HygoDateTimePicker;