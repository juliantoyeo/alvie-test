import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Icon, Text, H1, H2, H3, Grid, Row, Col } from 'native-base';
import { getLastValue } from '../api/hygoApi';
import Sensor from '../components/Sensor';
import ProductList from '../components/ProductList';
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
                condition : "Mauvaises conditions ",
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
                    flex:2,
                    alignItems: 'center' ,
                    flexDirection: 'row'
                }}>
                    <View style ={{flex: 3}}>
                        <H3>Date : {this.state.date}/{this.state.month}</H3>
                    </View>
                    <View style={{flex:7}}>
                        <ProductList />
                    </View>
                </View>
                <View style ={
                    {
                    flex: 1,
                    justifyContent: 'space-around',
                    alignItems: 'center', 
                    padding: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    }}>
                    <Button large style={{backgroundColor:this.state.conditionColor, justifyContent: 'center'}}>
                        <Text > {this.state.condition} </Text>
                    </Button>
                </View>
                <View style={{
                    flex:3,
                    flexDirection: 'row'}}
                >
                    <Sensor 
                        //style={{flex:1, flexGrow:1}}
                        name="Température"
                        color="green"
                        value={this.state.temp}
                        max={50.0}
                    />
                    <Sensor 
                        //style={{flex:1, flexGrow:1}}
                        name="Hygo"
                        color="blue"
                        value={this.state.humi}
                        max={100.0}
                    />
                </View>
                <View style={{flex:5}}>
                        <LineChart
                            data={{
                            labels: ["1",  "2", "3"],
                            datasets: [
                                {
                                data: this.state.array
                                }
                            ]
                            }}
                            width={Dimensions.get("window").width - 20}
                            height={180}
                            //yAxisLabel={"$"}
                            chartConfig={{
                            backgroundColor: "white", //"#e26a00"
                            backgroundGradientFrom: "#DDDDDD", //"#fb8c00",
                            backgroundGradientTo: "#DDDDDD",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "1", //"6",
                                strokeWidth: "0", //2",
                                stroke: "#ffa726"
                            }
                            }}
                            bezier
                            style={{
                            marginVertical: 8,
                            borderRadius: 10
                            }}
                        />
                        
                    </View>
                <View style={{flex:1}}>
                    <Button
                    onPress={() => {
                        this.setState({
                        array: [10,12,9,7,6,6,6,6,6,7,8,10,11,15,20,22,23,23,24,24,24,25,26,28,33,33,33,33,33,34,34,35,35,15,23,20,22,19,18,17,16,15,14,13,12,12,12,12,11,11,36,36,37],
                        })
                    }}>
                        <Text>test</Text>
                    </Button> 
                </View>
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