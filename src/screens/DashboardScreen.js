import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Card, CardItem, Button, Row, Body, Icon, Text, H1, Grid, H2, H3, Col } from 'native-base';
import { getLastValue } from '../api/hygoApi';
import Sensor from '../components/Sensor';
import SelectPhyto from '../components/SelectPhyto';
import ProductList from '../components/ProductList';
import HeaderHygo from '../components/HeaderHygo';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

class DashboardScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            temp: 0,
            humi: 0,
            array: [10,12,15,23,20,22,19,18,17,16,15,14,13,12,12,12,12,11,11,9,7,6,6,6,6,6,7,8,10,11,15,20,22,23,23,24,24,24,25,26,28,33,33,33,33,33,34,34,35,35,36,36,37],
            loop: true,
            date: new Date().getDate(),
            month: new Date().getMonth()+1 
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


    render() {
        
        console.log(this.state.date);
        
        
        if (!this.props.produitPhytoClicked){
            return (
                <Container style={styles.container}>
                    <HeaderHygo/>    
                    <SelectPhyto
                        userName = {this.props.userName}
                        date = {this.state.date}
                        month = {this.state.month}
                    /> 
                </Container> 
            );
        } else {
             return (
                <Container>
                    <HeaderHygo/>
                    <Content>
                        <Grid>
                            <Row >
                                <Col size={30} style ={
                                    {
                                    justifyContent: 'space-around',
                                    alignItems: 'center' 
                                    }
                                }>
                                    <H3>Date : {this.state.date}/{this.state.month}</H3>
                                </Col>
                                <Col size={70}>
                                    <ProductList />
                                </Col>
                            </Row>
                            <Row style ={
                                {
                                justifyContent: 'space-around',
                                alignItems: 'center' 
                                }}>
                                <Col size={70}>
                                    <Button large>
                                        <Text h3 > large conditionsconditions
                                        </Text>
                                    </Button> 
                                </Col>  
                            </Row>
                            <Row>
                                <Sensor 
                                    name="Température"
                                    color="green"
                                    value={this.state.temp}
                                    max={50.0}
                                />
                            </Row>
                            <Row>
                                <Sensor 
                                    name="Hygo"
                                    color="blue"
                                    value={this.state.humi}
                                    max={100.0}
                                />
                            </Row>
                            <Row>
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
                                    height={220}
                                    //yAxisLabel={"$"}
                                    chartConfig={{
                                    backgroundColor: "white", //"#e26a00"
                                    backgroundGradientFrom: "#ECECEC", //"#fb8c00",
                                    backgroundGradientTo: "#8EE915",
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16
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
                            </Row>
                            <Row>
                                <Button
                                    onPress={() => {
                                        this.setState({
                                        array: [10,12,9,7,6,6,6,6,6,7,8,10,11,15,20,22,23,23,24,24,24,25,26,28,33,33,33,33,33,34,34,35,35,15,23,20,22,19,18,17,16,15,14,13,12,12,12,12,11,11,36,36,37],
                                    })
                                }}>
                                    <Text>test</Text>
                                </Button> 
                            </Row>
                        </Grid>
                    </Content>     
                </Container> 
                );
            }
            
        
    }
}
const width = Dimensions.get('window').width
const height = 220

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
    produitPhytoClicked : state.pulve.produitPhytoClicked
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);