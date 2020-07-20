import React, { useState } from 'react';
import { Snackbar } from 'react-native-paper';
import { setUncaughtExceptionCaptureCallback } from 'process';

export interface SnackbarContextProps {
    showSnackbar?: any
}


export const SnackbarContext = React.createContext<SnackbarContextProps>({});

export const SnackbarProvider: React.FunctionComponent = ({ children }) => {
    const [snackIsVisible, setSnackIsVisible] = useState<boolean>(false)
    const [snackText, setSnackText] = useState<String>('')
    const showSnackbar = (text: String, type: String) => {
        setSnackIsVisible(false)
        setSnackText(text)
        setSnackIsVisible(true)
  } 
  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
        {children}
        <Snackbar
            visible={snackIsVisible}
            onDismiss={() => setSnackIsVisible(false)}
            action={{
                label: 'OK',
                onPress: () => {
                // Do something
                },
            }}
            >
            {snackText}
        </Snackbar>
    </SnackbarContext.Provider>
  );
};