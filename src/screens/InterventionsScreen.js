import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Dimensions, Image, StyleSheet,AsyncStorage  } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Spinner, Content, Card, CardItem, Button, Row, Body, Icon, Text, H1, Grid, H2, H3, Left, Right, View } from 'native-base';
import HeaderHygo from '../components/HeaderHygo';
import InterventionResume from '../components/InterventionResume';
import VChart from '../components/VChart';
import { getLastValue, getLastInterventions, evalConditions} from '../api/hygoApi';



class InterventionScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date().getDate(),
            month: new Date().getMonth() + 1,
            temp: 0,
            humi: 0,
            timestamp: '',
            interventionValues: [],
            loop: true,
            condition : "evaluation",
            conditionColor : "white",
            isLoading: true,
            
           
        }
    }    

    loop = async () => {
        try {
            const {interventionValues} = await getLastInterventions(this.props.token);
            if (interventionValues) {
                this.setState({interventionValues});
               // console.log(interventionValues);
                this.setState({isLoading:false})
            }
            if(this.state.loop) {
                //setTimeout(() => this.loop(),3000);
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

    cardOnPress = (intervention) => {
        this.props.navigation.navigate('InterventionMapScreen',{intervention})
    }



    render() {
       
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
                        <H2 style={styles.ecritures}>Initialisation des données du capteur Hygo, merci de patienter quelques instants</H2>
                    </Content> 
                )}
                {!this.state.isLoading && (
                    <Content contentContainerStyle = {{ 
                        padding: 10,
                        paddingRight: 10,
                        paddingTop: 10,
                        paddingBottom: 10,
                        disableKBDismissScroll: true
                    }}>
                    {(this.state.interventionValues.length > 1) ? (
                        <View>
                        {
                            this.state.interventionValues.map((intervention) => {
                                return (
                                    <InterventionResume 
                                        key={intervention.id}
                                        id = {intervention.id}
                                        interventionid = {intervention.interventionid}
                                        starttime = {intervention.starttime}
                                        endtime = {intervention.endtime}
                                        avgtemp = {intervention.avgtemp}
                                        maxtemp = {intervention.maxtemp}
                                        mintemp = {intervention.mintemp}
                                        avghumi = {intervention.avghumi}
                                        maxhumi = {intervention.maxhumi}
                                        minhumi = {intervention.minhumi}
                                        intervention = {intervention}
                                        onPress = {(interv) => this.cardOnPress(interv)}
                                    /> 
                                );
                            })
                        }
                        </View>


                    ): (
                        <View style={styles.message}>
                            <Card >
                                <CardItem>
                                    <Text style={styles.ecritures}> Aucune information enregistrée sur les anciennes interventions, en cas de problème, vous pouvez nous contacter au 06 68 48 38 83 </Text>
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
    userName: state.authen.userName,
    produitPhytoClicked : state.pulve.produitPhytoClicked,
    newSession: state.pulve.newSession,
    lastSession: state.pulve.lastSession
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(InterventionScreen);
