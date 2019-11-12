import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Icon, Text, H1 } from 'native-base';
import { getLastValue } from '../api/hygoApi';
import Sensor from '../components/Sensor';
import ProductList from '../components/ProductList';

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
            lastValue: 0,
            array: [10,12,15,23,20,22,19,18,17,16,15,14,13,12,12,12,12,11,11,9,7,6,6,6,6,6,7,8,10,11,15,20,22,23,23,24,24,24,25,26,28,33,33,33,33,33,34,34,35,35,36,36,37],
            loop: true,
            isProductSelected: false,
            date: new Date().getDate(),
        }
       
    }
    loop = async () => {
        try {
            const {value} = await getLastValue(this.props.token, 'temp')
            if (value) {
                this.setState({
                    ...this.state,
                    lastValue: value
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
        const isLoggedIn = this.state.isProductSelected;
        
        console.log(this.state.date);
        
        
        if (isLoggedIn){
            return (
               <Container>
                <Header style={styles.header}>
                    <Right>
                         <Image style={styles.image} source={require('../../assets/HYGO_by_Alvie_logo.png')} />
                    </Right>
                </Header>
                <Content contentContainerStyle={{ flexGrow: 1}} >
                    <View style = {
                        {
                            flex: 1,
                            flexDirection: 'column',
                            alignItems:'center', 
                            alignContent:'center',
                            justifyContent : 'space-around',
                            
                        }
                    }>
                        <H1 >
                            Bonjour {this.props.userName} ! 
                        </H1>
                        <Text>
                            Nous sommes le mercredi {this.state.date}
                        </Text>
                        <Text>
                            Quel Produit utilisez-vous aujourd'hui?
                        </Text>
                        <ProductList/>
                    </View>
                </Content>
                <Footer>
                  <FooterTab>
                    <Button full>
                      <Text>Footer</Text>
                    </Button>
                  </FooterTab>
                </Footer>
              </Container>
                
            );
        } else {
             return (
                <SafeAreaView 
                forceInset = {{top: 'always'}}
                justifyContent= 'center'
                alignItems= 'center'
                >
                    <Text h1>Dashboard - {this.props.userName}</Text>
                    <ProductList/>
                    <Text h3 style={{backgroundColor: this.state.lastValue > 0.5 ? '#EBF6EC' : '#FF99A6'}}>
                        {this.state.lastValue > 0.5 ? 'Bonnes' : 'Mauvaises'} conditions
                    </Text>
                    <Sensor 
                        name="Température"
                        color="green"
                        value={this.state.lastValue}
                    />
                    <Sensor 
                        name="Hygo"
                        color="blue"
                        value={this.state.lastValue}
                    />
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
                    <Button
                        title="test"
                        onPress={() => {
                            this.setState({
                                array: [10,12,9,7,6,6,6,6,6,7,8,10,11,15,20,22,23,23,24,24,24,25,26,28,33,33,33,33,33,34,34,35,35,15,23,20,22,19,18,17,16,15,14,13,12,12,12,12,11,11,36,36,37],
                            })
                        }} 
                    />
                </SafeAreaView>
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
    header: {
        backgroundColor: '#FCFCFC',
    }
   
});


const mapStateToProps = (state) => ({
    token: state.authen.token,
    userName: state.authen.userName
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);