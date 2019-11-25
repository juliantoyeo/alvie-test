import React from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Right, Body, Icon, H1, H2, H3, Grid, Row, Col, View } from 'native-base';
import {VictoryChart, VictoryLine, VictoryAxis, VictoryScatter } from 'victory-native';

const data=[
    {x:0, y: 2 },
    {x:1, y: 3 },
    {x:2, y: 5 },
    {x:3, y: 4 },
    {x:4, y: 7 }
];

//*
const getXValues = (item) => {
    if (typeof this.x == 'undefined') {
        this.x = Date(item.x).getHours();
    }
    if (this.x < Date(item.x).getHours()) {
        this.x = Date(item.x).getHours();
        return this.x.toString + "h";
    } else {
        return ""
    }
}
//*/
/*
const getXValues = (item) => {
    if (item.x % 2 >= 0) {
        return item.x.toString();
    } else {
        return ""
    }
}//*/

export default VChart = (props) => (
    <View>
        <H2>{props.titleName}</H2>
        <VictoryChart 
            polar={false} 
            height={180}
           //domain={{ x: [0, 5], y: [0, 7] }}
        >
            
            <VictoryAxis
            // tickValues specifies both the number of ticks and where
            // they are placed on the axis
            tickValues={[0,1,2,3,4]}
            tickFormat={props.values.map(getXValues)}
            crossAxis={false}
            //tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
            />
            <VictoryAxis
            dependentAxis
            // tickFormat specifies how ticks should be displayed
            //tickFormat={(x) => (`$${x / 1000}k`)}
            />
            <VictoryScatter data={props.values.map((item => item.y))}
            size={3}
            style={{ data: { fill: "#c43a31" } }}
            />
        </VictoryChart>
    </View>
);
