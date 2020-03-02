import React from 'react';
import { Card, CardItem, Left, Right, Body, Icon, View,Text  } from 'native-base';
import { StyleSheet, } from 'react-native';


export default class LegendMap extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Card>
                <CardItem>
                    <View style={{flex:1}}>
                        <Text note> Légende</Text>
                    </View>
                </CardItem>
                <CardItem>
                    <Body > 
                        <View style={{flex:1, flexDirection: 'row'}}>
                            <View style={{flex:1, backgroundColor: 'rgb(255, 153, 166)', height: 50}}>
                            </View>
                            <View style={{flex:1, backgroundColor: 'rgb(255, 221, 166)', height: 50}}>
                            </View>
                            <View style={{flex:1, backgroundColor: 'rgb(164, 247, 219)', height: 50}}>
                            </View>
                            <View style={{flex:1, backgroundColor: 'rgb(37, 196, 142)', height: 50}}>
                            </View>
                        </View>   
                    </Body>
                </CardItem>
                <CardItem>
                    <Left >
                        <Text note >Conditions{"\n"}Médiocres</Text>
                    </Left>
                    <Right>
                        <Text note>Excellentes{"\n"}Conditions</Text>
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

});