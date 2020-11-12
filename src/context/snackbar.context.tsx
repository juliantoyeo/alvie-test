import React, { useState } from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Snackbar, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import COLORS from '../colors'

export interface SnackbarContextProps {
    showSnackbar?: any
}
export type SnackType = 'DEFAULT' | 'OK' | 'WARNING' | 'ALERT'

export const SnackbarContext = React.createContext<SnackbarContextProps>({});

const SnackbarProvider: React.FunctionComponent = ({ children }) => {

    const [snackIsVisible, setSnackIsVisible] = useState<boolean>(false)
    const [snackText, setSnackText] = useState<string>('')
    const [snackType, setSnackType] = useState<SnackType>('DEFAULT')
    const showSnackbar = (text: string, type: SnackType) => {
        setSnackIsVisible(false)
        setSnackText(text)
        setSnackType(snackStyle[type] ? type : 'DEFAULT')
        setSnackIsVisible(true)
    } 
    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                theme={{ colors: accentStyle[snackType]} /*Styling the action button*/}
                style= {[styles.snackbar, snackStyle[snackType]]}
                visible={snackIsVisible}
                onDismiss={() => setSnackIsVisible(false)}
                action={{
                    label: 'OK',
                    onPress: () => {
                    // Do something
                    },
                }}
                >
                <Text style={[styles.snackText, textStyle[snackType]]}>{snackText}</Text>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};


// Theming snackbar : 
// https://callstack.github.io/react-native-paper/theming.html

const snackStyle: { [id: string]: StyleProp<ViewStyle> } = {
    'OK' : { backgroundColor: COLORS['EXCELLENT']},
    'WARNING': { backgroundColor: COLORS['CORRECT']},
    'ALERT': { backgroundColor: COLORS['BAD']},
    'DEFAULT': { backgroundColor: COLORS['CYAN']}
}
const accentStyle: { [id: string]: Partial<ReactNativePaper.ThemeColors> }= {
    'OK' : { accent: 'white'},
    'WARNING': { accent: 'white'},
    'ALERT': { accent: 'black'},
    'DEFAULT': { accent: 'white'}
}

const textStyle: { [id: string]: StyleProp<TextStyle> } = {
    'OK' : { color: 'white'},
    'WARNING': { color: 'white'},
    'ALERT': { color: 'black'},
    'DEFAULT': { color: 'white'}
}

const styles = StyleSheet.create({
    snackbar: {
        backgroundColor: 'red',
        elevation: 5,
        borderRadius: 10
    },
    snackText: {
        // fontFamily: 'nunito-bold',
        // fontSize: 32,
        color: 'white',
    }
})

export default SnackbarProvider
