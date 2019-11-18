import React from 'react';
import {View, H1, H2 } from 'native-base';

import ProductList from '../components/ProductList';


export default class SelectPhyto extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          date: props.date
        };
      }
    render() {
        return (
            <View>
            <H1 style={{color : '#194769'}}>
                Bonjour {this.props.userName} ! 
            </H1>
            <H2 style={{color : '#194769'}}>
                Nous sommes le {this.props.date}/{this.props.month}!
            </H2>
            <H2 style={{color : '#194769'}}>
                Quel Produit utilisez-vous aujourd'hui?
            </H2>
            <ProductList/>
            </View>
        );
    }
}   

    
    


