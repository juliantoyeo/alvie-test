import React from 'react';
import { Card, CardItem, Left, Right, Body, Icon, View, Text } from 'native-base';
import { StyleSheet, } from 'react-native';
import { ProductList } from './ProductList';


export default class InterventionResume extends React.Component {
    constructor(props) {
        super(props);
    }

    dureeIntervention = (a,b) => {
        const start = new Date(a)
        const end = new Date(b)
        let diff = new Date (end - start)
        return (diff.getHours()-1).toString() + ":"+ diff.getMinutes().toString().padStart(2, "0");
    }


    render() {
        const starttime = new Date(this.props.starttime);
        const endtime = new Date(this.props.endtime);

        const day = starttime.getDate().toString().padStart(2, "0")
        const month = (starttime.getMonth()+1).toString().padStart(2, "0")
        const hoursStart = (starttime.getHours()).toString().padStart(2, "0")
        const minutesStart = starttime.getMinutes().toString().padStart(2, "0")
        const hoursEnd = (endtime.getHours()).toString().padStart(2, "0")
        const minutesEnd = endtime.getMinutes().toString().padStart(2, "0")
   
        return (
            <Card key={this.props.id}>
                <CardItem 
                    header bordered button 
                    onPress = {() => this.props.onPress(this.props.intervention)}
                >
                    <Body>
                        <Text>Intervention du {`${day}/${month} de ${hoursStart}:${minutesStart} à ${hoursEnd}:${minutesEnd}`}</Text>
                        { (this.props.intervention.number_fields == 1) ? (
                            <Text note>{this.props.intervention.number_fields} parcelle traitée </Text> 

                        ):(
                        <Text note>{this.props.intervention.number_fields} parcelles traitées </Text> 
                        )}
                    </Body>     
                </CardItem>
                <CardItem
                    button 
                    onPress = {() => this.props.onPress(this.props.intervention)}
                >
                    <Left>
                        <Icon type = "FontAwesome5" name= "temperature-low" style={styles.iconTemp}/>
                        <View>
                            <Text> {Math.round(this.props.avgtemp*10)/10}°C </Text>
                            <Text note > min {Math.round(this.props.mintemp*10)/10}</Text> 
                            <Text note > max {Math.round(this.props.maxtemp*10)/10}</Text>
                        </View>
                    </Left>
                    <Body style={styles.humitab}>
                        <Icon type = "Entypo" name= "drop" style={styles.iconHumi}/>
                        <View style={{flexDirection: 'column'}}>
                            <Text> {Math.round(this.props.avghumi*10)/10}% </Text>
                            <Text note > min {Math.round(this.props.minhumi*10)/10}</Text> 
                            <Text note > max {Math.round(this.props.maxhumi*10)/10}</Text>
                        </View> 
                    </Body>
                    <Right style={{flexDirection: 'column'}}>
                        <Text>Durée : {this.dureeIntervention(this.props.starttime, this.props.endtime)}</Text>
                    </Right>
                </CardItem>
                
                {
                    (!this.props.intervention.phytoproduct)? (
                        <CardItem
                            button 
                            onPress = {() => this.props.onPress(this.props.intervention)}
                        >
                            <Body style={styles.phytoParagraphe}>
                                <Icon type ="Entypo" name="lab-flask" style={{color : '#194769'}}/>
                                <Text>Absence de produit phyto associé à l'intervention</Text>
                                <Icon type = "AntDesign" name= "right" style={styles.iconGeneral}/>
                            </Body>
                            </CardItem>
                    ):(
                        (this.props.intervention.phytoproduct=='Autres travaux agricoles')?
                        (
                            <CardItem
                                button 
                                onPress = {() => this.props.onPress(this.props.intervention)}
                            >
                                <Body style={styles.phytoParagraphe}>
                                    <Icon type ="FontAwesome5" name="tractor" style={styles.iconGeneral}/>
                                    <Text>  {this.props.intervention.phytoproduct}</Text>
                                </Body>
                            </CardItem>
                        ):
                        (
                            <CardItem
                            button 
                            onPress = {() => this.props.onPress(this.props.intervention)}
                            >
                                <Body style={styles.phytoParagraphe}>
                                    <Icon type ="Entypo" name="lab-flask" style={styles.iconGeneral}/>
                                    <Text>Phyto : {this.props.intervention.phytoproduct}</Text>
                                </Body>
                            </CardItem>
                        )
                    )
                }    
                
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
    },
    phytoParagraphe:{
        flexDirection: 'row',
        alignItems:'center',  
    },
    iconTemp: {
        color : "green"
    },
    iconHumi: {
        color : "blue"
    },
    humitab: {
        flexDirection: 'row',
        alignItems:'center', 
    },
    iconGeneral:{
        color : '#194769'
    }

});