import React, {Component} from 'react';
import { View, StyleSheet, Dimensions,   } from 'react-native';
import {Text, Button} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { Container, Header, Content, Icon, Picker, Form} from 'native-base'
import {updatePhyto} from '../store/actions/pulveActions';
import { connect, dispatch } from 'react-redux';



class ProductList extends React.Component {


   constructor(props) {
        super(props);
        this.state = {
            produitPhytoClicked : undefined,
        };
       
    }

    onProductChange = (value) => { 
        this.setState({produitPhytoClicked : value});
        console.log(value);
        this.props.updatePhyto(value);
        console.log(updatePhyto(value));
    }

    render() {
        return (
            <View style={{width:Dimensions.get("window").width - 20}}>
                <Content>
                    <Form style={{backgroundColor : '#D9EEF6', borderColor: 'B7DAE3',color:'#194769'}}>
                        <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="Quel produit utilisez vous?"
                        
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
                </Content>
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
});

const mapStateToProps = (state) => {
    return {
      produitPhytoClicked: state.produitPhytoClicked,
      
    };
  };
  const mapDispatchToProps = (dispatch, props) => ({
    updatePhyto: (produitPhytoClicked) => dispatch(updatePhyto(produitPhytoClicked)),
  })
  export default connect(mapStateToProps, mapDispatchToProps)(ProductList);