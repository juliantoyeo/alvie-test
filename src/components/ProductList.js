import React from 'react';
import { Icon, Picker } from 'native-base'
import { Platform } from 'react-native';

export class ProductList extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Quel produit utilisez vous ?"
                note={false}
                placeholderStyle={{ color: "#194769" }}
                headerBackButtonText ='retour'
                placeholderIconColor="59DFD6"
                selectedValue={this.props.produitPhytoClicked}
                onValueChange={this.props.onProductChange}>
                {Platform.OS === 'android' &&
                    <Picker.Item label="Quel produit utilisez vous ?" value={null}/>
                }
                <Picker.Item label="Herbicide foliaire systémique" value="Herbicide foliaire systémique" />
                <Picker.Item label="Herbicide foliaire de contact" value="Herbicide foliaire de contact" />
                <Picker.Item label="Herbicide avec hormones" value="Herbicide avec hormones" />
                <Picker.Item label="Herbicide racinaire" value="Herbicide racinaire" />
                <Picker.Item label="Fongicide racinaire" value="Fongicide racinaire" />
                <Picker.Item label="Fongicide de contact" value="Fongicide de contact" />
                <Picker.Item label="Fongicide systemique" value="Fongicide systemique" />
                <Picker.Item label="Insecticide systémique" value="Insecticide systémique" />
                <Picker.Item label="Insecticide de contact" value="Insecticide de contact" />
            </Picker>
        );
    }
}