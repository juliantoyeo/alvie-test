import React, {Component} from 'react';
import { View, AsyncStorage} from 'react-native';
import {Text, Button} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { Container, Header, Content, Icon, Picker, Form} from 'native-base'
import {updatePhyto} from '../store/actions/pulveActions';
import { connect, dispatch } from 'react-redux';



export class ProductList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            produitPhytoClicked: this.props.produitPhytoClicked
        }
    }
    
    onProductChange = (value) => { 
        this.setState({produitPhytoClicked : value});
        this.props.onProductChange(value);
    }

    render() {
        return (
            
                <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder="Quel produit utilisez vous?"
                    placeholderStyle={{ color: "#194769" }}
                    headerBackButtonText ='retour'
                    placeholderIconColor="59DFD6"
                    //style={{width:400}}
                    selectedValue={this.state.produitPhytoClicked}
                    onValueChange={this.onProductChange}
                >
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