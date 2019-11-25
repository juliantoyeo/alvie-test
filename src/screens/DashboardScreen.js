import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Dimensions, Image, StyleSheet,AsyncStorage  } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Card, CardItem, Button, Row, Body, Icon, Text, H1, Grid, H2, H3, Col, View } from 'native-base';
import HeaderHygo from '../components/HeaderHygo';
import Sensor from '../components/Sensor';
import VChart from '../components/VChart';
import { getLastValue, getLastValues } from '../api/hygoApi';

const data=[
    {x:0, y: 2 },
    {x:1, y: 3 },
    {x:2, y: 5 },
    {x:3, y: 4 },
    {x:4, y: 7 }
];

class DashboardScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date().getDate(),
            month: new Date().getMonth() + 1,
            temp: 0,
            humi: 0,
            values: undefined,
            loop: true,
            condition : "evaluation",
            conditionColor : "white",
        }
    }    

    loop = async () => {
        try {
            const {values} = await getLastValues(this.props.token);
            if (values) {
                this.setState({values});
            }
            const {temp, humi} = await getLastValue(this.props.token)
            if (!!temp && !!humi) {
                this.setState({
                    ...this.state,
                    temp,
                    humi
                });
                this.onConditionchange()
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
    }


    onConditionchange = ()=>{
        if (this.state.humi>65){
            this.setState({
                    ...this.state,
                    condition : "Bonnes conditions",
                    conditionColor : '#6DE298',
                })
            }
        else if (this.state.humi>50){
            this.setState({
                    ...this.state,
                    condition : "Conditions médiocres",
                    conditionColor : '#FFDDA6',
                });
             }
        else{
            this.setState({
                ...this.state,
                condition : "Mauvaises conditions",
                conditionColor : '#FF99A6',
            });
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }} forceInset={{top:'always'}}>
            <Container style={styles.container}>
                <HeaderHygo/>
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
                        />
                        <Sensor 
                            name="%"
                            color="blue"
                            value={this.state.humi}
                            max={100.0}
                            iconName="drop"
                            iconType="Entypo"
                        />
                    </View>
                    {this.state.values && <VChart
                        values={this.state.values.map((item => ({x: item.timestamp, y:item.temp})))}
                        titleName="Température"
                        color="green"
                    />}
                    {/*<VChart
                        values={this.state.values.map((item => ({x: item.timestamp, y:item.humi})))}
                        titleName="Température"
                        color="green"
                    />  */}     
                </Content>    
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
// <SensorEvolution
//                         labels={this.state.values ? (
//                             this.state.values.map((item => item.timestamp))
//                         ) : [0]}
//                         dataList={this.state.values ? (
//                             this.state.values.map((item => item.humi))
//                         ) : [0]}
//                         titleName="Hygrométrie"
//                         color="blue"
//                     />
//                     <SensorEvolution
//                         labels={this.state.values ? (
//                             this.state.values.map((item => item.timestamp))
//                         ) : [0]}
//                         dataList={ this.state.values ? (
//                             this.state.values.map((item => item.temp))
//                         ) : [0]}
//                         titleName="Température"
//                         color="green"
//                     />