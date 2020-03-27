import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { Container, Spinner, Content, Card, CardItem, Icon, Text, H2, View } from 'native-base';
import HeaderHygo from '../components/HeaderHygo';
import InterventionResume from '../components/InterventionResume';
import { getLastInterventions } from '../api/hygoApi';
import { updateInterv } from '../store/actions/intervActions';

class InterventionScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date().getDate(),
            month: new Date().getMonth() + 1,
            interventionValues: this.props.interventionValues,
            isLoading: true,
            isRefreshing: false,
        }
    }    

    loop = async (isRefresh) => {
        if (!isRefresh && this.state.isRefreshing) {
            return
        }
        
        try {
            let {interventionValues} = await getLastInterventions(this.props.token);
            if (!!interventionValues) {
                this.props.updateInterv(interventionValues);
                this.setState({isLoading:false})
            }

            if (!interventionValues) {
                this.setState({isLoading:false})  
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

    cardOnPress = (intervention) => {
        this.props.navigation.navigate('InterventionMapScreen', {intervention})
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true })
        await this.loop(true);
        this.setState({ isRefreshing: false })
    }

    render() {
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
                            <H2 style={styles.ecritures}>Initialisation des données du capteur Hygo, merci de patienter quelques instants</H2>
                        </Content> 
                    )}

                    { !this.state.isLoading && (
                        <Content contentContainerStyle = {{ 
                            padding: 10,
                            paddingRight: 10,
                            paddingTop: 10,
                            paddingBottom: 10,
                            disableKBDismissScroll: true
                        }} refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh.bind(this)} />}>

                        { this.props.interventionValues.length >= 1 && (
                            <View>
                            {
                                this.props.interventionValues.map((intervention) => {
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


                        )}
                        
                        { this.props.interventionValues.length < 1 && (
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
    //produitPhytoClicked : state.pulve.produitPhytoClicked,
    newSession: state.pulve.newSession,
    lastSession: state.pulve.lastSession,
    interventionValues: state.interv.interventions
});
const mapDispatchToProps = (dispatch, props) => ({
    updateInterv: (interventionValues)=>dispatch(updateInterv(interventionValues)),

})
  
export default connect(mapStateToProps, mapDispatchToProps)(InterventionScreen);


  
