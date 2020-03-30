import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { RefreshControl, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Container, Spinner, Content, Card, CardItem, Button, Icon, Text, H2, View, Col, Grid, Row } from 'native-base';
import HeaderHygo from '../components/HeaderHygo';
import Sensor from '../components/Sensor';
import VChart from '../components/VChart';
import { getLastValue, getLastValues, getLastCondition } from '../api/hygoApi';

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
            condition: "evaluation",
            conditionColor: "white",

            isLoading: true,

            isRefreshing: false,
        }
    }

    loop = async (isRefresh) => {
        if (!isRefresh && this.state.isRefreshing) {
            return
        }

        try {
            const {values} = await getLastValues(this.props.token);
            if (values) {
                this.setState({values});
            }

            const {temp, humi, timestamp} = await getLastValue(this.props.token)
            const {condition , conditionColor} = await getLastCondition(this.props.token)
            if (!!temp && !!humi) {
                this.setState(prev => {
                    return {
                        ...prev,

                        temp,
                        humi,
                        timestamp,
                        condition,
                        conditionColor,

                        isLoading: false,
                    }
                });
            }
        } catch(err) {
            console.log(err)
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('didFocus', async () => {
            await this.loop()
            this.intervalId = setInterval(() => {
                this.loop()
            }, 5000)
        });

        this._unsubscribeBlur = this.props.navigation.addListener('didBlur', () => {
            clearInterval(this.intervalId); 
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe && this._unsubscribe.remove();
        this._unsubscribeBlur && this._unsubscribeBlur.remove();
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true })
        await this.loop(true);
        this.setState({ isRefreshing: false })
    }
    
    render() {
        const date = new Date(this.state.timestamp);

        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth()+1).toString().padStart(2, "0")
        const hours = (date.getHours()).toString().padStart(2, "0")
        const minutes = date.getMinutes().toString().padStart(2, "0")

        return (
            <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
                <Container style={styles.container}>
                    <HeaderHygo/>
                    { this.state.isLoading && (
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

                    { !this.state.isLoading && (
                        <Content 
                            refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh.bind(this)} />}
                            contentContainerStyle = {{ 
                                padding: 10,
                                paddingRight: 10,
                                paddingTop: 10,
                                paddingBottom: 10,
                                disableKBDismissScroll: true,
                            }}>

                            { this.state.values.length > 1 && (
                                <>
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
                                    }} onPress={() => {
                                        if(!this.props.produitPhytoClicked) {
                                            this.props.navigation.navigate('Traitement')
                                        } 
                                    }}>
                                        <Text>{this.state.condition}</Text>
                                    </Button>

                                    <Text style={styles.ecritures}> Dernière mesure : {`le ${day}/${month} à ${hours}:${minutes}`}</Text>
                                        
                                    <View style={{
                                        justifyContent: 'space-around',
                                        flexDirection: 'row',
                                        height:100
                                    }}>
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
                                
                                    <View>
                                        <VChart
                                            values={this.state.values.map((item => ({
                                                x: Date.prototype.getTime.bind(new Date(item.timestamp))(),
                                                y:item.humi
                                            })))}
                                            titleName="  Hygrométrie" // add to space to avoid the title of the graph to be cover on the side - small quick fix
                                            color="blue"
                                        />
                                        <VChart
                                            values={this.state.values.map((item => ({
                                                x: Date.prototype.getTime.bind(new Date(item.timestamp))(),
                                                y:item.temp
                                            })))}
                                            titleName="  Température"// add to space to avoid the title of the graph to be cover on the side - small quick fix
                                            color="green"
                                        />
                                    </View>
                                </>
                            )}
                            
                            { this.state.values.length === 0 && (
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Icon type ="AntDesign" name="aliwangwang-o1" style={styles.icon}/>
                                    <Card style={{ flex: 1, marginLeft: 10 }}>
                                        <CardItem>
                                            <Text style={styles.ecritures}>{`Aucune information reçue ces 4 dernières heures, si vous voulez consulter les anciennes interventions, cliquez sur l’onglet Interventions`}</Text>
                                        </CardItem>
                                    </Card>
                                </View>
                            )}
                            
                            { this.state.values.length === 1 && (
                                <View style={styles.message}>
                                    <Card >
                                        <CardItem>
                                            <Text style={styles.ecritures}>{`1 première mesure, nous attendons la seconde pour commencer à afficher les courbes`}</Text>
                                        </CardItem>
                                    </Card>
                                    <Icon type ="AntDesign" name="aliwangwang-o1" style={styles.icon}/>
                                </View>
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
    },
    ecritures :{
        color : '#194769'
    },
    icon: {
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

const mapDispatchToProps = (dispatch, props) => ({})
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
