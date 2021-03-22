import { StyleSheet } from 'react-native';
import COLORS from './colors';

const paddingBig = 20
const paddingSmall = 10

const hygoStyles = StyleSheet.create({
    h0: {
        textTransform: 'uppercase',
        fontFamily: 'nunito-heavy',
        fontSize: 16,
        color: COLORS.DARK_BLUE,
        padding: paddingBig,
        paddingBottom: paddingSmall
    },
    h1: {
        textTransform: 'uppercase',
        fontFamily: 'nunito-regular',
        fontSize: 14,
        color: COLORS.DARK_BLUE,
        //paddingTop: 10,
        paddingBottom: 10
    },
    text: {
        fontFamily: 'nunito-regular',
        fontSize: 14,
        color: '#AAAAAA',
        paddingBottom: paddingSmall
    },
    textBold: {
        fontFamily: 'nunito-bold',
        fontSize: 14,
        color: '#AAAAAA',
        paddingBottom: paddingSmall
    },
	textEdit: {
		backgroundColor: '#FFFFFF',
		borderColor: COLORS.DARK_BLUE,
		borderWidth: 1,
		borderRadius: 8,
	}
})

export default hygoStyles
