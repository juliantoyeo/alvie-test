import React from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Right, Body, Icon, H1, H2, H3, Grid, Row, Col, View } from 'native-base';
import {VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryScatter } from 'victory-native';

const data=[
    {x:0, y: 2 },
    {x:1, y: 3 },
    {x:2, y: 5 },
    {x:3, y: 4 },
    {x:4, y: 7 }
];

const getXValues = (item) => {
    const date = new Date(item.x);

    return date.getHours().toString() + ":"+ date.getMinutes().toString();
}
/*
const getXValues = (item) => {
    const hours = new Date(item.x).getHours();
    if (this.x == 'undefined') {
        this.x = hours;
        return this.x.toString() + "h";
    }
    if (this.x != hours) {
        this.x = hours;
        return this.x.toString() + "h";
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


export default VChart = (props) => {
    const marginX = Math.abs(Math.min(...props.values.map((item => item.x))) - Math.max(...props.values.map((item => item.x))));
    const marginY = Math.abs(Math.min(...props.values.map((item => item.y))) - Math.max(...props.values.map((item => item.y))));
    return (
    <View pointerEvents="none">
        <H2 style={{
            color:props.color
        }}
        >{props.titleName}</H2>
        <VictoryChart 
            polar={false} 
            height={180}
            domain={{
                x: [
                    Math.min(...props.values.map((item => item.x))) - 20/100*marginX,
                    Math.max(...props.values.map((item => item.x))) + 20/100*marginX
                ],
                y: [
                    Math.min(...props.values.map((item => item.y))) - 20/100*marginY,
                    Math.max(...props.values.map((item => item.y))) + 20/100*marginY,
                ]
            }}
        >
            
            <VictoryAxis
            // tickValues specifies both the number of ticks and where
            // they are placed on the axis
            tickValues={props.values.map((item, index) => item.x)}
            tickFormat={props.values.map(getXValues)}
            fixLabelOverlap={true}
           //tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
            />
            <VictoryAxis
            dependentAxis
            // tickFormat specifies how ticks should be displayed
            //tickFormat={(x) => (`$${x / 1000}k`)}
            />
            <VictoryArea
            style={{ data: { fill: props.color } }}
            interpolation="catmullRom" 
            data={props.values}//.map((item => item.y))}
            />
            {/*
            <VictoryScatter 
            data={props.values} //.map((item => item.y))}
            size={3}
            style={{ data: { fill: props.color} }}
            />
            */}
        </VictoryChart>
    </View>
    );
}
