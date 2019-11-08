import React from 'react';
import { View, StyleSheet, Dimensions,   } from 'react-native';
import {Text, Button} from 'react-native-elements';

import RNPickerSelect from 'react-native-picker-select';
export default class ProductList extends React.Component {


   constructor(props) {
        super(props);
        this.state = {
            produitPhytoClicked : ""
        };
       
    }

    render() {
        return (
        <View style={{width:Dimensions.get("window").width - 20}}>
            <Text h5>Quel produit utilisez-vous aujourd’hui? </Text>
            <View style={styles.pickerPhyto}>
            <RNPickerSelect 
                    placeholder={{}}
                    onValueChange={(value) => this.setState({produitPhytoClicked: value})}
                    items={[
                        { label: 'racinaire', value: 'racinaire' },
                        { label: 'adjuvant', value: 'adjuvant' },
                        { label: 'fungicide', value: 'fungicide' },
                    ]}
            />
            </View>   
        </View>
        );
    }
}

const styles = StyleSheet.create({
    pickerPhyto: {
        height: 20,
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 5
    }
})
;