import React from 'react';
import { Icon, Picker } from 'native-base'
import { Platform } from 'react-native';
import { connect } from 'react-redux';

class ProductList extends React.Component {
    constructor(props) {
        super(props);
    }

    buildList() {
        let l = this.props.phytoProductList.map(p => {
            return (
                <Picker.Item key={p.id} label={p.name} value={p.name} />
            )
        })

        if (Platform.OS === 'android') {
            l.unshift(<Picker.Item label="Quel produit utilisez vous ?" value={null} />)
        }

        return l
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
                { this.buildList() }
            </Picker>
        );
    }
}

const mapStateToProps = (state) => ({
    phytoProductList : state.pulve.phytoProductList,
});

const mapDispatchToProps = (dispatch, props) => ({})
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
