import React from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Text } from 'react-native-elements';

export default class Sensor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: new Animated.Value(0)
        };
    }

    componentDidMount() {
        Animated.timing(
            this.state.width,
            {
              toValue: this.props.value,
            },
          ).start();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value) {
            Animated.timing(
                this.state.width,
                {
                  toValue: this.props.value,
                },
              ).start();
        } 
    }

    render() {
        return (
        <View style={{flex:1}}>
            <Text h5>{this.props.name + ' - ' + this.props.value.toFixed(2)}</Text>
            <View style={styles.progressBar}>
                <Animated.View style={
                    [StyleSheet.absoluteFill], 
                    {
                        backgroundColor: this.props.color || "black", 
                        height: this.state.width.interpolate({
                            inputRange: [0, this.props.max],
                            outputRange: ['0%', '100%']
                        })
                    }
                }/>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    progressBar: {
        flex:3,
        flexDirection: 'column-reverse',
        width: 20,
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    }
});