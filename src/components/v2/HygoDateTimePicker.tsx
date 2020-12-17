import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native'

const HygoDateTimePicker = ({ hour,
    onChange }) => {

    return (Platform.OS === 'ios' ? (
        <DateTimePicker
            testID="dateTimePicker"
            value={new Date(2020, 1, 1, hour, 0, 0)}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChange}
            minuteInterval={30}
        />
    ) : (
            <DateTimePicker
                testID="dateTimePicker"
                value={new Date(2020, 1, 1, hour, 0, 0)}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChange}
                minuteInterval={30}
            />
        )
    )
}


export default HygoDateTimePicker;