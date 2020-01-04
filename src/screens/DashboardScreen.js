import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Dimensions, Image, StyleSheet,AsyncStorage  } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Spinner, Content, Card, CardItem, Button, Row, Body, Icon, Text, H1, Grid, H2, H3, Col, View } from 'native-base';
import HeaderHygo from '../components/HeaderHygo';
import Sensor from '../components/Sensor';
import VChart from '../components/VChart';
import { getLastValue, getLastValues, evalConditions } from '../api/hygoApi';

const data=[
    {x:30000000, y: 2 },
    {x:30010000, y: 3 },
    {x:32000000, y: 5 },
    {x:50000000, y: 4 },
    {x:50500000, y: 7 }
];

class DashboardScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date().getDate(),
            month: new Date().getMonth() + 1,
            temp: 0,
            humi: 0,
            values: [],
            loop: true,
            condition : "evaluation",
            conditionColor : "white",
            isLoading: true
        }
    }    

    loop = async () => {
        try {
            const {values} = await getLastValues(this.props.token);
            if (values) {
                this.setState({values});
                console.log(values);
            }
            const {temp, humi} = await getLastValue(this.props.token)
            if (!!temp && !!humi) {
                this.setState({
                    ...this.state,
                    temp,
                    humi
                });
                this.onConditionchange(this.props.produitPhytoClicked);
                this.setState({isLoading:false})
            }
            if(this.state.loop) {
                setTimeout(() => this.loop(),3000);
            }
        } catch(err)
        {
            console.log(err)
            return;
        }
    }

    async componentDidMount() {
        this.loop();            
    }

    componentWillUnmount() { 
        this.setState({loop: false});
        this.setState({isLoading: false});
        
    }


    onConditionchange = async (phyto) => {
        const { condition, conditionColor, error} = await evalConditions(phyto, this.state.humi, this.state.temp);
        if (!error)
        {
            this.setState({
                ...this.state,
                condition,
                conditionColor
            })
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }} forceInset={{top:'always'}}>
            <Container style={styles.container}>
                <HeaderHygo/>
                {this.state.isLoading && (
                    <Content contentContainerStyle = {{ 
                        padding: 10,
                        paddingRight: 10,
                        paddingTop: 10,
                        paddingBottom: 10,
                    }}>
                        <Spinner color='#194769' />
                        <Icon type ="FontAwesome5" name="tractor" style={{color : '#194769', fontSize: 65}}/>
                        <H2>Initialisation du capteur Hygo, merci de patienter quelques instants</H2>
                    </Content> 
                )}
                {!this.state.isLoading && (
            
                <Content contentContainerStyle = {{ 
                    padding: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                }}>
                    <View style={{
                        alignItems: 'flex-start' ,
                        flexDirection: 'row',
                        marginLeft: 10,
                        marginRight: 10
                    }}>
                        <Text>{this.props.produitPhytoClicked ? "Produit utilisé : " + this.props.produitPhytoClicked : "Sélectionnez un produit"}</Text>
                    </View>
                    <Button large style={{
                        justifyContent: 'center',
                        backgroundColor:this.state.conditionColor,
                        margin: 10
                    }}
                    onPress={() => {if(!this.props.produitPhytoClicked) 
                        {
                        this.props.navigation.navigate('Traitement')
                        }
                        else {

                        }}}
                    >
                        <Text>{this.state.condition}</Text>
                    </Button>
                        
                    <View style={{
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        height:100}}
                    >
                        <Sensor 
                            name="°C"
                            color="green"
                            value={this.state.temp}
                            max={50.0}
                            iconName="temperature-low"
                            iconType="FontAwesome5"
                            type="Température"
                        />
                        <Sensor 
                            name="%"
                            color="blue"
                            value={this.state.humi}
                            max={100.0}
                            iconName="drop"
                            iconType="Entypo"
                            type="Hygrométrie"
                        />
                    </View>
                    {(this.state.values.length > 1) && 
                        <VChart
                            values={this.state.values.map((item => ({
                                x: Date.prototype.getTime.bind(new Date(item.timestamp))(),
                                y:item.temp
                            })))}
                            titleName="Température"
                            color="green"
                        />}
                    {(this.state.values.length > 1) && 
                        <VChart
                            values={this.state.values.map((item => ({
                                x: Date.prototype.getTime.bind(new Date(item.timestamp))(),
                                y:item.humi
                            })))}
                            titleName="Hygrométrie"
                            color="blue"
                        />}
                </Content> 
                )}   
            </Container> 
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    progressBar: {
        flexDirection: 'row',
        height: 20,
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
    container: {
        backgroundColor: '#F6F6E9',
    }
   
});
const mapStateToProps = (state) => ({
    token: state.authen.token,
    userName: state.authen.userName,
    produitPhytoClicked : state.pulve.produitPhytoClicked,
    newSession: state.pulve.newSession,
    lastSession: state.pulve.lastSession
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
