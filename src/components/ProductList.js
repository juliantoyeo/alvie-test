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
                    <Picker.Item label="Herb. foliaire systémique" value="Herb. foliaire systémique" />
                    <Picker.Item label="Herb. foliaire de contact" value="Herb. foliaire de contact" />
                    <Picker.Item label="Herb. avec  hormones" value="Herb. avec  hormones" />
                    <Picker.Item label="Herb. racinaires" value="Herb. racinaires" />
                    <Picker.Item label="Fongicides racinaires" value="Fongicides racinaires" />
                    <Picker.Item label="Fongicides de contact" value="Fongicides de contact" />
                    <Picker.Item label="Fongicides systemique" value="Fongicides systemique" />
                    <Picker.Item label="Insecticide systémique" value="Insecticide systémique" />
                    <Picker.Item label="Insecticide de contact" value="Insecticide de contact" />
                </Picker>
            
        );
    }
     /*       <View style={
                {
                    
                  
                }}>
                
                    <Form style={{backgroundColor : '#D9EEF6', borderColor: 'B7DAE3',color:'#194769'}}>
                        <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="Sélectionner un produit?"
                        
                        placeholderStyle={{ color: "#194769" }}
                        headerBackButtonText ='retour'
                        placeholderIconColor="59DFD6"
                        style={{ width: undefined }}
                        selectedValue={this.state.produitPhytoClicked}
                        onValueChange={this.onProductChange}
                        >
                        <Picker.Item label="Foliaires systèmiques" value="Foliaires systèmiques" />
                        <Picker.Item label="Foliaires de contact" value="Foliaires de contact" />
                        <Picker.Item label="Foliaires systèmiques avec adjuvent" value="Foliaires systèmiques avec adjuvent" />
                        <Picker.Item label="Foliaires de contact avec adjuvent" value="Foliaires de contact avec adjuvent" />
                        </Picker>
                    </Form>
                
            </View>
        );
    }*/
}
/*
const styles = StyleSheet.create({
    pickerPhyto: {
        height: 20,
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 5
    }
});*/


// const mapStateToProps = (state) => {
//     return {
//       produitPhytoClicked: state.pulve.produitPhytoClicked,
      
//     };
//   };
//   const mapDispatchToProps = (dispatch, props) => ({
//     updatePhyto: (produitPhytoClicked) => dispatch(updatePhyto(produitPhytoClicked)),
//   })
//   export default connect(mapStateToProps, mapDispatchToProps)(ProductList);