import React from 'react';
import { Dimensions, Image, StyleSheet,  } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content,Button, View, Text, H3} from 'native-base';
import { getLastValue } from '../api/hygoApi';
import Sensor from '../components/Sensor';
import SelectPhyto from './SelectPhyto';
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
        return (
        <Container>
            <HeaderHygo/>
            
            {!(this.props.produitPhytoClicked) ? (
            <Content contentContainerStyle = {{flex: 1}}>
                <SelectPhyto
                    userName = {this.props.userName}
                    date = {this.state.date}
                    month = {this.state.month}
                />
            </Content>
            ) : (
            <Content contentContainerStyle = {{flex: 1}}>
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
                    //justifyContent: 'space-around',
                    //alignItems: 'center' 
                    }}>
                        <Button >
                            <Text h3 > large conditionsconditions
                            </Text>
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
                )}
        </Container>  
    )}
}

const mapStateToProps = (state) => ({
    token: state.authen.token,
    userName: state.authen.userName,
    produitPhytoClicked : state.pulve.produitPhytoClicked
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);