import React, { useState, Component, useEffect, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, PanResponder, Dimensions } from 'react-native'

import COLORS from '../../colors'
import _ from 'lodash';
import { CONDITIONS } from '../../constants';

const NUM_ITEMS = 24
const CURSOR_HEIGHT = 45

const conditionsOrdering = ['FORBIDDEN', 'BAD', 'CORRECT', 'GOOD', 'EXCELLENT']

// previously named HygoParcelleIntervention

const ModulationBar = ({ from, initialMin, initialMax, width, onHourChangeEnd, enabled, sizes }) => {
	/**
	 *
	 * @param props
	 * { from, initialMin, initialMax, data ,width, onHourChangeEnd, enabled, sizes}
	 *
	 * Main idea : using a panResponder to handle dragging
	 * the selected slots are made transparent, and there is a rectangle behind
	 * that do the color of the selected slot
	 */

	const computeColorFromSize = (size) => {
		if (size == undefined)
			return COLORS.GREY
		else if (size > 7)
			return COLORS["EXCELLENT_CARDS"]
		else if (size > 2)
			return COLORS["CORRECT_CARDS"]
		else
			return  COLORS["BAD_CARDS"]
	}

	const [selected, setSelected] = useState({
		min: parseInt(initialMin ? initialMin : 0),
		max: parseInt(initialMax ? initialMax : 0)
	})

	useEffect(() => {
		setSelected({
			min: parseInt(initialMin ? initialMin : 0),
			max: parseInt(initialMax ? initialMax : 0)
		})
	}, [initialMax, initialMin])

	//useRef needed for onPanResponderRelease
	const selectedRef = useRef(selected)
	selectedRef.current = selected

	const panResponder = useMemo(() => PanResponder.create({
		onMoveShouldSetPanResponderCapture: () => enabled,
		onStartShouldSetPanResponder: () => enabled,
		onPanResponderStart: (evt, gestureState) => onStart(evt, gestureState),
		onPanResponderMove: (evt, gestureState) => onMove(evt, gestureState),
		onPanResponderRelease: () => {
			//selected is not changing here because we use useMemo()
			if (onHourChangeEnd) {
				onHourChangeEnd(selectedRef.current)
			}
		}
	}), [enabled])

	const onStart = (evt, gestureState) => {
		/**
		* Handle the gesture when touching the finger
		*/
		const xpos = gestureState.x0 + gestureState.dx
		const offset = (Dimensions.get('window').width - width) / 2
		let fv = (xpos - offset) / width * NUM_ITEMS

		// slot number where we are
		let posInsideBar = parseInt(fv)
		// out of bounds ?
		if (posInsideBar > NUM_ITEMS - 1) { posInsideBar = NUM_ITEMS - 1 }
		if (posInsideBar < 0) { posInsideBar = 0 }

		// be careful with the problem of stale closure with react Hooks

		setSelected(({min, max}) => {
			// if we touch outside of the selection : update selection
			return (posInsideBar > max + 1) || (posInsideBar < min - 1) ? ({
				min: posInsideBar,
				max: posInsideBar
			}) : ({min, max})
		})
	}

	const onMove = (evt, gestureState) => {
		/**
		 * Handle the gesture when moving the finger
		 */
		const xpos = gestureState.x0 + gestureState.dx
		const offset = (Dimensions.get('window').width - width) / 2
		let fv = (xpos - offset) / width * NUM_ITEMS
		// dv: where we are inside the slot : 0(top left) -> 1(top right)
		const dv = fv % 1

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

		// be careful with the problem of stale closure with react Hooks
		setSelected((selected) => {
			let {min, max} = selected
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
			return ((max - min) < 12) ? ({min, max}) : (selected)
		})
	}

	const getColor = (i) => {
		// if selected : color is transparent
		// else the color is taken from the data provided
		const isSelected = i <= selected.max && selected.min <= i
		if (isSelected)
			return 'transparent'
		return computeColorFromSize(sizes[i])
	}

	const getItemWidth = (i, isSub) => {

		const w = width
		const margin = parseFloat(w) / NUM_ITEMS * 0.14
		const isSelected = i <= selected.max && selected.min <= i
		return {
			width: parseFloat(w) / NUM_ITEMS,
			paddingHorizontal: isSelected ? 0 : margin,
			paddingVertical: 5,
			height: 55 + (isSelected ? margin : 0),
		}
	}

	const getSelectedWidth = () => {
		/**
		 * Get the width of the rectagle in the background that will do the color
		 *  for the selected slot
		 *  The color is the worst color of all the selected slots
		 */
		if (selected.max < selected.min) {
			return {
				width: 0,
				boderWidth: 0,
			}
		}

		let smallerSize = null
		for (let i = selected.min; i <= selected.max; i++) {
			// find smaller size over the selected slots
			if (!smallerSize || smallerSize > sizes[i + from]) {
				smallerSize = sizes[i + from]
			}
		}

		const w = width, margin = parseFloat(w) / NUM_ITEMS * 0.14
		return {
			width: (selected.max - selected.min + 1) * (parseFloat(w) / NUM_ITEMS),
			marginHorizontal: 0,
			borderWidth: margin,
			borderColor: '#fff',
			height: 45 + margin,
			position: 'absolute',
			left: selected.min * width / NUM_ITEMS,
			backgroundColor: computeColorFromSize(smallerSize)
		}
	}

	const getSelectedHeight = () => {
		if (!sizes || !sizes.length || sizes.length == 0)
			return 45
		try {
			const maxSize = Math.max(...sizes)
			if (maxSize == 0)
				return 15
			const selSize = Math.min(...sizes.slice(selected.min, selected.max + 1))
			const r = 15 + 30 * selSize / maxSize
			return r < 0 ? 45 : r
		} catch(e) {
			return 45
		}
	}

	const getContainerHeight = () => {
		const w = width,
		margin = parseFloat(w) / NUM_ITEMS * 0.14
		return 45 + margin
	}

	const getItemHeight = (i) => {
		if (!sizes || !sizes.length || sizes.length == 0)
			return 45
		try {
			const maxSize = Math.max(...sizes)
			if (maxSize == 0) {
				return 15
			}
			return 15 + 30 * sizes[i] / maxSize
		}catch(e) {
			return 15
		}
	}

	return (
		<View style={[styles.container, { width: width, height: getContainerHeight() }]}>
			{/* Curseur r??actif ?? la souris*/}
			<View style={[styles.parcelleCursor, {
				left: -1 * parseFloat(Dimensions.get('window').width - width) / 2,
				width: Dimensions.get('window').width,
				height: CURSOR_HEIGHT,
			}]}
				{...panResponder.panHandlers}></View>

			{/* The background rectangle*/}
			<View style={[styles.selected, { ...getSelectedWidth(), height: getSelectedHeight() }]}></View>

			{/* The slots */}
			{[...Array(NUM_ITEMS).keys()].map(i => {
				return (
					<TouchableWithoutFeedback key={i} onPress={() => { }}>
						<View style={[styles.parcelle, {
							...getItemWidth(i), height: getItemHeight(i)
						},
						]}>
							<View style={[styles.subTile, { backgroundColor: getColor(i), height: getItemHeight(i)}]}></View>
						</View>
					</TouchableWithoutFeedback>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		paddingVertical: 5,
		justifyContent: 'center',
		alignItems: 'flex-end',
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
