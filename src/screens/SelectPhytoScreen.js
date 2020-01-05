import React from 'react';
import { Container, Header, Title, Content, View,Card, CardItem, Button, Row, Body, Icon, Text, H1, Grid, H2, H3, Col } from 'native-base';
import { AsyncStorage,StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import HeaderHygo from '../components/HeaderHygo';
import { ProductList } from '../components/ProductList';
import {updatePhyto} from '../store/actions/pulveActions';

class SelectPhytoScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date().getDate(),
            month: new Date().getMonth()+1 
        }
       
    }    

async componentDidMount() {
    const storedDateSession = await AsyncStorage.getItem('dateSession');
    if ((this.props.produitPhytoClicked) && (storedDateSession===this.state.date) ) {
        this.props.navigation.navigate('mainFlow');
    }
}

render() {
        return (
            <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
            <Container>
                <HeaderHygo/>    
                <Content contentContainerStyle = {{flex: 1}}>
                        <View style = {
                            {
                                flex: 1,
                                flexDirection: 'column',
                                //alignItems:'center', 
                                alignContent:'center',
                                justifyContent : 'space-around',
                                backgroundColor: '#F6F6E9',
                                padding:10,
                                
                            }
                        }>
                            <H1 style={{color : '#194769'}}>
                                Bonjour {this.props.userName} ! 
                            </H1>
                            <Icon type ="FontAwesome5" name="tractor" style={{color : '#194769', fontSize: 65}}/>
                            <H2 style={{color : '#194769'}}>
                                Nous sommes le {this.state.date}/{this.state.month}!
                            </H2>
                            <H2 style={ {color : '#194769'}}>
                                Quel produit utilisez-vous aujourd'hui?
                            </H2>
                            <View style={{backgroundColor : '#D9EEF6', borderColor: 'B7DAE3',color:'#194769'}}>
                                <ProductList
                                    onProductChange={ (value) => { 
                                        this.props.updatePhyto(value);
                                        this.props.navigation.navigate('Dashboard')}
                                    }
                                    produitPhytoClicked ={this.props.produitPhytoClicked}    
                                />
                            </View>
                            
                        </View>
            </Content>
                
            </Container> 
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    statusbar: {
        backgroundColor: '#F6F6E9',
        flex: 1
    } 
  });

const mapStateToProps = (state) => ({
    token: state.authen.token,
    userName: state.authen.userName,
    produitPhytoClicked : state.pulve.produitPhytoClicked,
});
const mapDispatchToProps = (dispatch, props) => ({
    updatePhyto: (produitPhytoClicked) => dispatch(updatePhyto(produitPhytoClicked)),
})
  
export default connect(mapStateToProps, mapDispatchToProps)(SelectPhytoScreen);
/*<SelectPhyto
                    userName = {this.props.userName}
                    date = {this.state.date}
                    month = {this.state.month}
                /> */
