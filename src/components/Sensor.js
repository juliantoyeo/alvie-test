import React from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Text } from 'react-native-elements';
import { Icon, Content, Grid, Row, Col, H3 } from 'native-base';

export default class Sensor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: new Animated.Value(0)
        };
    }

    componentDidMount() {
        Animated.timing(
            this.state.height,
            {
              toValue: this.props.value,
            },
          ).start();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value) {
            Animated.timing(
                this.state.height,
                {
                  toValue: this.props.value,
                },
              ).start();
        } 
    }

    render() {
        return (
        <Content contentContainerStyle = {{flex: 1, alignContent:'center'}}>
            <Grid style={{
                justifyContent: "space-around",
                
                }}
            
            >
                <Col style={{
                    flex:2,
                    justifyContent: 'space-around',
                    
                    alignItems:"center",
                    height:100}}
                >
                    <Icon type = {this.props.iconType} name= {this.props.iconName} style={{color : this.props.color|| "black", fontSize: 50}}/>
                    <H3 style ={{
                        fontWeight :"bold",
                        color : this.props.color|| "black"
                    }}
                    
                    >{this.props.value.toFixed(0)+ this.props.name}</H3>
                </Col>
                <Col style={styles.gauge}>
                    <View style={styles.progressBar}>
                    <Animated.View style={
                        [StyleSheet.absoluteFill], 
                        {
                            backgroundColor: this.props.color || "black", 
                            height: this.state.height.interpolate({
                                inputRange: [0, this.props.max],
                                outputRange: ['0%', '100%']
                            })
                        }
                    }/>
                    </View> 
                </Col>
            </Grid>
           
        </Content>
        );
    }
}

const styles = StyleSheet.create({
    progressBar: {
        height:100,
        width: 10,
        flexDirection: 'column-reverse',
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
    gauge:{
        flex:1,
        alignItems:"flex-start",

    }
});