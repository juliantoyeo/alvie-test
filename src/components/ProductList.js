import React from 'react';
import { View, StyleSheet, Dimensions,   } from 'react-native';
import {Text, Button} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import {updatePhyto} from '../store/actions/pulveActions';
import { connect, dispatch } from 'react-redux';



class ProductList extends React.Component {
    state = {
        produitPhytoClicked: ""
      };


   constructor(props) {
        super(props);
        this.state = {
            produitPhytoClicked : ""
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
            <Text h5>Quel produit utilisez-vous aujourd’hui? </Text>
            <View style={styles.pickerPhyto}>
            <RNPickerSelect 
                    placeholder={{}}
                    onValueChange={this.onProductChange}
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
});

const mapStateToProps = (state) => {
    return {
      produitPhytoClicked: state.produitPhytoClicked
    };
  };
  const mapDispatchToProps = (dispatch, props) => ({
    updatePhyto: (produitPhytoClicked) => dispatch(updatePhyto(produitPhytoClicked)),
  })
  export default connect(mapStateToProps, mapDispatchToProps)(ProductList);