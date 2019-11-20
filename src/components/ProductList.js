import React, {Component} from 'react';
import { View, StyleSheet, Dimensions, ShadowPropTypesIOS,   } from 'react-native';
import {Text, Button} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { Container, Header, Content, Icon, Picker, Form} from 'native-base'
import {updatePhyto} from '../store/actions/pulveActions';
import { connect, dispatch } from 'react-redux';



class ProductList extends React.Component {

   constructor(props) {
        super(props);
        this.state = {
            produitPhytoClicked : props.produitPhytoClicked,
        };
    }
    componentDidMount() {
        ;            
    }

    componentWillUnmount = (value) => { 
        this.setState({produitPhytoClicked : value});
    }



    onProductChange = (value) => { 
        this.setState({produitPhytoClicked : value});
        console.log(value);
        this.props.updatePhyto(value);
        console.log(updatePhyto(value));
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
            <Picker.Item label="Désherbant post-levée systémique" value="Désherbant post-levée systémique" />
            <Picker.Item label="Désherbant prélevée systémique" value="Désherbant prélevée systémique" />
            <Picker.Item label="Désherbant prélevée de contact" value="Désherbant prélevée de contact" />
            <Picker.Item label="Désherbant post-levée de contact" value="Désherbant post-levée de contact" />
            <Picker.Item label="Fongicide systémique" value="Fongicide systémique" />
            <Picker.Item label="Fongicide de contact" value="Fongicide de contact" />
            <Picker.Item label="Herbicide systémique ou pénétrant" value="Herbicide systémique ou pénétrant" />
            <Picker.Item label="Herbicide de contact" value="Herbicide de contact" />
            <Picker.Item label="Insecticide de contact ou par ingestion" value="Insecticide de contact ou par ingestion" />
            <Picker.Item label="Insecticide systémique" value="Insecticide systémique" />
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

const mapStateToProps = (state) => {
    return {
      produitPhytoClicked: state.pulve.produitPhytoClicked,
      
    };
  };
  const mapDispatchToProps = (dispatch, props) => ({
    updatePhyto: (produitPhytoClicked) => dispatch(updatePhyto(produitPhytoClicked)),
  })
  export default connect(mapStateToProps, mapDispatchToProps)(ProductList);