import React,{ Component }  from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, Button } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Right, Body, Icon, H1, H2, H3, Grid, Row, Col } from 'native-base';
import {
    LineChart
  } from "react-native-chart-kit";

export default SensorEvolution = (props) => (
        <View>
            <H2>{props.titleName}</H2>
            <LineChart
                        data={{
                        labels: [10,20,30],
                        datasets: [
                            {
                            data: props.dataList,
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
                        decimalPlaces: 2,// optional, defaults to 2dp
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