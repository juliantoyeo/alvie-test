import React from 'react';
import { Card, CardItem, Left, Right, Body, Icon, View,Text  } from 'native-base';
import { StyleSheet, } from 'react-native';

import { ProductListIntervention } from './ProductListIntervention';
import { updateIntervention } from '../api/hygoApi'

export default class InterventionResumeMap extends React.Component {
    constructor(props) {
        super(props);
    }

    dureeIntervention = (a,b) => {
        const start = new Date(a)
        const end = new Date(b)
        let diff = new Date (end - start)
        return (diff.getHours()-1).toString() + ":"+ diff.getMinutes().toString();
    }
    updatePhytoIntervention = async (value) => {
        await updateIntervention(value, this.props.interventionDeviceId, this.props.interventionid)
        this.props.updatefields();
        
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
                        <Text style={styles.titleIntervention}>Intervention du {`${day}/${month} de ${hoursStart}:${minutesStart} à ${hoursEnd}:${minutesEnd}`}</Text>
                        { (this.props.number_fields == 1) ? (
                            <Text note>{this.props.number_fields} parcelle traitée </Text> 

                        ):(
                        <Text note>{this.props.number_fields} parcelles traitées </Text> 
                        )}
                    </Body>
                </CardItem>
                <CardItem
                    button 
                    onPress = {() => this.props.onPress(this.props.intervention)}
                >
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
                <CardItem footer bordered>
                    {/*<View style={{backgroundColor : '#D9EEF6', borderColor: 'B7DAE3',color:'#194769', height: 20}}>*/}
                        <ProductListIntervention
                            onProductChangeIntervention={this.updatePhytoIntervention}
                            // onProductChangeIntervention={ async (value) => { 
                            //     await this.updatePhytoIntervention(value);
                            //     }
                            // }
                            produitPhytoClicked ={this.props.produitPhytoClickedIntervention}    
                        />
                    {/*</View>
                    */}
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
    },
    titleIntervention:{
        color: "black",
        

    }

});