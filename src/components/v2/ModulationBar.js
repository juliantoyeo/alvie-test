import React, { useState, Component, useEffect } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, PanResponder, Dimensions } from 'react-native'

import COLORS from '../../colors'
import _ from 'lodash';
import { CONDITIONS } from '../../constants';

const NUM_ITEMS = 24
const CURSOR_HEIGHT = 120

const conditionsOrdering = ['FORBIDDEN', 'BAD', 'CORRECT', 'GOOD', 'EXCELLENT']

// previously named HygoParcelleIntervention

class ModulationBar extends Component {
    /**
     * 
     * @param props
     * { from, initialMin, initialMax, data ,width, onHourChangeEnd}
     * 
     * Main idea : using a panResponder to handle dragging
     * the selected slots are made transparent, and there is a rectangle behind 
     * that do the color of the selected slot
     */

    constructor(props) {
        super(props);

        this.onHourChangeDelayed = _.debounce((h) => { props.onHourChange(h) }, 100);

        this.state = {
          selected: {
            min: parseInt(props.initialMin ?props.initialMin : 0),
            max: parseInt(props.initialMax ?props.initialMax : 0)
          },
        }
    }

    panResponder = PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => true,
        onStartShouldSetPanResponder: () => true,
        onPanResponderStart: (evt, gestureState) => this.onStart(evt, gestureState),
        onPanResponderMove: (evt, gestureState) => this.onMove(evt, gestureState),
        onPanResponderRelease: () => {
            if (this.props.onHourChangeEnd) {
                this.props.onHourChangeEnd(this.state.selected)
            }
        }
    })

    onStart = (evt, gestureState) => {
    /**
    * Handle the gesture when touching the finger
    */
        const  xpos = gestureState.x0 + gestureState.dx
        const  offset = (Dimensions.get('window').width - this.props.width) / 2
        let  fv = (xpos - offset) / this.props.width * NUM_ITEMS

        // slot number where we are
        let posInsideBar = parseInt(fv)
        // out of bounds ?
        if (posInsideBar > NUM_ITEMS - 1) { posInsideBar = NUM_ITEMS - 1 }
        if (posInsideBar < 0) { posInsideBar = 0 }

        const { min, max } = this.state.selected

        // if we touch outside of the selection : update selection
        if ((posInsideBar > max + 1) || (posInsideBar < min - 1)) {
            this.setState({
                selected: {
                    min: posInsideBar,
                    max: posInsideBar
                }
            })
        } 

    }
    
    onMove = (evt, gestureState) => {
    /**
     * Handle the gesture when moving the finger
     */
        const  xpos = gestureState.x0 + gestureState.dx
        const  offset = (Dimensions.get('window').width - this.props.width) / 2
        let  fv = (xpos - offset) / this.props.width * NUM_ITEMS
        // where we are inside the slot : 0(top left) -> 1(top right)
        const  dv = fv % 1

        if (gestureState.vx > 0) {
            if (dv >= 0.65) { fv = parseInt(fv) + 1 }
            else { fv = parseInt(fv) }
        } else if (gestureState.vx < 0) {
            if (dv <= 0.35) { fv = parseInt(fv) }
            else { fv = parseInt(fv) + 1 }
        }

        // slot number where we are
        let posInsideBar = fv
        // if we are out of bound : reframe
        if (posInsideBar > NUM_ITEMS - 1) { posInsideBar = NUM_ITEMS - 1 }
        if (posInsideBar < 0) { posInsideBar = 0 }

        let { min, max } = this.state.selected

        // compare with current min and max
        if (gestureState.vx > 0) {
            if (posInsideBar === max + 1) {
                max = posInsideBar
            } else if (posInsideBar === min && max !== posInsideBar) {
                min = posInsideBar + 1
            }
        } else {
            if (posInsideBar === min - 1) {
                min = posInsideBar
            } else if (posInsideBar === max && posInsideBar !== min) {
                max = posInsideBar - 1
            }
        }

        //Update the selected slots if size < 12 slots
        if((max - min) < 12) {
            this.setState({
                selected: {
                    min,
                    max
                }
            })
        }
    }

    getColor = (i) => {
        // if selected : color is transparent
        // else the color is taken from the data provided
        const isSelected = i <= this.state.selected.max && this.state.selected.min <= i
        if (isSelected)
            return 'transparent'

        const padded = `${i + this.props.from}`.padStart(2, '0')
        return COLORS[`${CONDITIONS[this.props.data[i + this.props.from]]}_CARDS`];
    }

    getItemWidth = (i, isSub) => {

        const w = this.props.width
        const margin = parseFloat(w) / NUM_ITEMS * 0.14
        const isSelected = i <= this.state.selected.max && this.state.selected.min <= i
        return {
            width: parseFloat(w) / NUM_ITEMS,
            paddingHorizontal: isSelected ? 0 : margin,
            paddingVertical: 5,
            height: 55 + (isSelected ? margin : 0),
        }
    }

    getSelectedWidth = () => {
        /**
         * Get the width of the rectagle in the background that will do the color
         *  for the selected slot
         *  The color is the worst color of all the selected slots
         */
        if (this.state.selected.max < this.state.selected.min) {
            return {
                width: 0,
                boderWidth: 0,
            }
        }

        let curCond = null
        for (let i = this.state.selected.min; i <= this.state.selected.max; i++) {
            // let padded = `${i + this.props.from}`.padStart(2, '0')
             if (!curCond || CONDITIONS.indexOf(curCond) >= this.props.data[i + this.props.from]) {
                curCond = CONDITIONS[this.props.data[i + this.props.from]]
             }
        }

        const w = this.props.width, margin = parseFloat(w) / NUM_ITEMS * 0.14
        return {
            width: (this.state.selected.max - this.state.selected.min + 1) * (parseFloat(w) / NUM_ITEMS),
            marginHorizontal: 0,
            borderWidth: margin,
            borderColor: '#fff',
            height: 45 + margin,
            position: 'absolute',
            left: this.state.selected.min * this.props.width / NUM_ITEMS,
            backgroundColor: COLORS[`${curCond}_CARDS`],
        }
    }

    getContainerHeight = () => {
        const w = this.props.width, margin = parseFloat(w) / NUM_ITEMS * 0.14
        return 45 + margin
    }

    render() {
        return (
            <View style={[styles.container, { width: this.props.width, height: this.getContainerHeight() }]}>
                <View style={[styles.parcelleCursor, {
                    left: -1 * parseFloat(Dimensions.get('window').width - this.props.width) / 2,
                    width: Dimensions.get('window').width,
                    height: this.props.cursorHeight || CURSOR_HEIGHT,
                }]}
                    {...this.panResponder.panHandlers}></View>

                {/* The background rectangle*/}
                <View style={[styles.selected, {...this.getSelectedWidth() }]}></View>

                {/* The slots */}
                {[...Array(NUM_ITEMS).keys()].map(i => {
                    return (
                        <TouchableWithoutFeedback key={i} onPress={() => {}}>
                            <View style={[styles.parcelle, {
                                ...this.getItemWidth(i)
                            },
                            ]}>
                                <View style={[styles.subTile, { backgroundColor: this.getColor(i), }]}></View>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    parcelleCursor: {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    parcelle: {
        height: 45,
        zIndex: 5,
    },
    subTile: {
        height: 45,
        zIndex: 5
    },
    selected: {
        height: 45,
        zIndex: 1,
    }
})

export default ModulationBar