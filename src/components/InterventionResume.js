import React from 'react';
import { Container, Header, Title, Content,Card, CardItem, Left, Right, Footer, FooterTab, Body, Icon, H1, H2, H3, Grid, Row, Col, View, } from 'native-base';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import { Text } from 'react-native-elements';



export default class InterventionResume extends React.Component {
    constructor(props) {
        super(props);
    }

    dureeIntervention = (a,b) => {
        const start = new Date(a)
        const end = new Date(b)
        let diff = new Date (end - start)


    
        return (diff.getHours()-1).toString() + ":"+ diff.getMinutes().toString();
    }
    




    render() {
        return (
            <Card key={this.props.id}>
                <CardItem header bordered>
                    <Text>Intervention du {`${new Date(this.props.starttime).getDate()}/${new Date(this.props.starttime).getMonth()+1} de ${new Date(this.props.starttime).getHours()+1}:${new Date(this.props.starttime).getMinutes()} à ${new Date(this.props.endtime).getHours()+1}:${new Date(this.props.endtime).getMinutes()}`}</Text>
                </CardItem>
                <CardItem>
                    <Left>
                        <Icon type = "FontAwesome5" name= "temperature-low" style={{color : "green"}}/>
                        <View>
                            <Text> {Math.round(this.props.avgtemp*10)/10}°C </Text>
                            <Text note > min {Math.round(this.props.mintemp*10)/10}</Text> 
                            <Text note > max {Math.round(this.props.maxtemp*10)/10}</Text>
                        </View>
                    </Left>
                    <Body style={{flexDirection: 'row'}}>
                        <Icon type = "Entypo" name= "drop" style={{color : "blue"}}/>
                        <View style={{flexDirection: 'column'}}>
                            <Text> {Math.round(this.props.avghumi*10)/10}% </Text>
                            <Text note > min {Math.round(this.props.minhumi*10)/10}</Text> 
                            <Text note > max {Math.round(this.props.maxhumi*10)/10}</Text>
                        </View> 
                    </Body>
                    <Right>
                        <Text>Durée : {this.dureeIntervention(this.props.starttime, this.props.endtime)}</Text>
                    </Right>
                </CardItem>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    progressBar: {
        height:100,
        width: 10,
        flexDirection: 'column-reverse',
        backgroundColor: '#D8D8D8',
        borderColor: '#D8D8D8',
        borderWidth: 1,
        borderRadius: 5
    },
    gauge:{
        flex:1,
        alignItems:"flex-start",

    }
});