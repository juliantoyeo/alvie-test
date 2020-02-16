import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Dimensions, Image, StyleSheet,AsyncStorage  } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Spinner, Content, Card, CardItem, Button, Row, Body, Icon, Text, H1, Grid, H2, H3, Col, View } from 'native-base';
import HeaderHygo from '../components/HeaderHygo';
import Sensor from '../components/Sensor';
import VChart from '../components/VChart';
import { getLastValue, getLastValues, evalConditions} from '../api/hygoApi';

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
            timestamp: '',
            values: [],
            loop: true,
            condition : "evaluation",
            conditionColor : "white",
            isLoading: true,
            
           
        }
    }    

    loop = async () => {
        try {
            const {values} = await getLastValues(this.props.token);
            if (values) {
                this.setState({values});
                console.log(values);
            }
            const {temp, humi, timestamp} = await getLastValue(this.props.token)
            if (!!temp && !!humi) {
                this.setState({
                    ...this.state,
                    temp,
                    humi,
                    timestamp
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
        const { condition, conditionColor, error} = await evalConditions(this.props.deviceid, phyto, this.state.humi, this.state.temp);
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

        const date = new Date(this.state.timestamp);
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth()+1).toString().padStart(2, "0")
        const hours = (date.getHours()+1).toString().padStart(2, "0")
        const minutes = date.getMinutes().toString().padStart(2, "0")
        return (
            <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
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
                        <H2 style={styles.ecritures}>Initialisation du capteur Hygo, merci de patienter quelques instants</H2>
                    </Content> 
                )}
                {!this.state.isLoading && (
            
                <Content contentContainerStyle = {{ 
                    padding: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    disableKBDismissScroll: true,
                    
                }}>
                    <View style={{
                        alignItems: 'flex-start' ,
                        flexDirection: 'row',
                        marginLeft: 10,
                        marginRight: 10
                    }}>
                        <Text style={styles.ecritures}>{this.props.produitPhytoClicked ? "Produit utilisé : " + this.props.produitPhytoClicked : "Sélectionnez un produit"}</Text>
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
                    <Text style={styles.ecritures}> Dernière mesure : {
                        `le ${day}/${month} à ${hours}:${minutes}`
                    }
                    </Text>
                        
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
                    {(this.state.values.length > 1) ? (
                        <View>
                            <VChart
                                values={this.state.values.map((item => ({
                                    x: Date.prototype.getTime.bind(new Date(item.timestamp))(),
                                    y:item.humi
                                })))}
                                titleName="Hygrométrie"
                                color="blue"
                            />
                            <VChart
                                values={this.state.values.map((item => ({
                                    x: Date.prototype.getTime.bind(new Date(item.timestamp))(),
                                    y:item.temp
                                })))}
                                titleName="Température"
                                color="green"
                            />
                        </View>
                    ) : ((this.state.values = []) ? (
                        <View style={styles.message}>
                            <Card >
                                <CardItem>
                                    <Text style={styles.ecritures}> Aucune information reçue ces 4 dernières heures, si vous voulez consulter les anciennes interventions, cliquez sur l'onglet Interventions </Text>
                                </CardItem>
                            </Card>
                            <Text >{this.state.values} </Text>
                            <Icon type ="AntDesign" name="aliwangwang-o1" style={styles.icon}/>
                        </View>
                        
                        ): (
                            <View style={styles.message}>
                                <Card >
                                    <CardItem>
                                        <Text style={styles.ecritures}>1 première mesure, nous attendons la seconde pour commencer à afficher les courbes</Text>
                                    </CardItem>
                                </Card>
                                <Icon type ="AntDesign" name="aliwangwang-o1" style={styles.icon}/>
                             </View>
                        )
                    )}
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
    message :{
        flex: 1,
        justifyContent :"center",
        flexDirection: 'column',
        //borderStyle: 'solid',
        //padding:5
    },
    ecritures :{
        color : '#194769'
    },
    icon :{
        color : '#194769',
         fontSize: 80
    },
    container: {
        backgroundColor: '#F6F6E9',
    },
    statusbar: {
        backgroundColor: '#F6F6E9',
        flex: 1
    } 
});
const mapStateToProps = (state) => ({
    token: state.authen.token,
    deviceid: state.authen.deviceid,
    userName: state.authen.userName,
    produitPhytoClicked : state.pulve.produitPhytoClicked,
    newSession: state.pulve.newSession,
    lastSession: state.pulve.lastSession
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
