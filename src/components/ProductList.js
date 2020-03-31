import React from 'react';
import { Icon, Picker } from 'native-base'
import { Platform } from 'react-native';
import { connect } from 'react-redux';

class ProductList extends React.Component {
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
                { Platform.OS === 'android' &&
                    <Picker.Item label="Quel produit utilisez vous ?" value={null}/>
                }

                { this.props.phytoProductList.map(p => {
                    return (
                        <Picker.Item key={p.id} label={p.name} value={p.name} />
                    )
                }) }
            </Picker>
        );
    }
}

const mapStateToProps = (state) => ({
    phytoProductList : state.pulve.phytoProductList,
});

const mapDispatchToProps = (dispatch, props) => ({})
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
