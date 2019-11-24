import React,{ Component }  from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, Button } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Right, Body, Icon, H1, H2, H3, Grid, Row, Col } from 'native-base';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

export default class SensorEvolution extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            array: this.props.dataList,
        }  
    }
    render() {
        return (
        <View>
            <H2>{this.props.titleName}</H2>
            <LineChart
                        data={{
                        labels: ["8",  "9", "10", "11"],
                        datasets: [
                            {
                            data: this.state.array
                            }
                        ]
                        }}
                        width={Dimensions.get("window").width - 20}
                        height={180}
                        yAxisLabel={""}
                        
                        chartConfig={{
                        backgroundColor: "white", //"#e26a00"
                        backgroundGradientFrom: "#FFFFFF", //"#fb8c00",
                        backgroundGradientTo: "#FFFFFF",
                        decimalPlaces: 0,// optional, defaults to 2dp
                        strokeWidth:1, // epaiseur de la courbe
                        
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForBackgroundLines: {
                            strokeWidth:"0"
                            // solid background lines with no dashes
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
        );

    }
 }