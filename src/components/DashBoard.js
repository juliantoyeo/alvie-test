import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Icon, Text, H1, H2, H3, Grid, Row, Col } from 'native-base';
import { getLastValue } from '../api/hygoApi';
import Sensor from '../components/Sensor';
import SensorEvolution from '../components/SensorEvolution';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";





class DashBoard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            temp: 0,
            humi: 0,
            array: [10,12,15,23,20,22,19,18,17,16,15,14,13,12,12,12,12,11,11,9,7,6,6,6,6,6,7,8,10,11,15,20,22,23,23,24,24,24,25,26,28,33,33,33,33,33,34,34,35,35,36,36,37],
            loop: true,
            date: this.props.date,
            month: this.props.month,
            condition : "evaluation",
            conditionColor : "white",
        }
       
    }
    loop = async () => {
        try {
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
            
            <Content contentContainerStyle = {{
                flex: 1,
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
                    <H3>Date : {this.state.date}/{this.state.month}</H3>
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
                <SensorEvolution
                    dataList={this.state.array}
                    titleName="Hygrométrie"
                    color="blue"
                />
                <SensorEvolution
                    dataList={this.state.array}
                    titleName="Température"
                    color="green"
                />
               
                        
        </Content> 
        );
    }
} 
const mapStateToProps = (state) => ({
    token: state.authen.token,
    userName: state.authen.userName,
    produitPhytoClicked : state.pulve.produitPhytoClicked
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);