import React, { useState, Component, useEffect, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, PanResponder, Dimensions } from 'react-native'

import COLORS from '../../colors'
import _ from 'lodash';
import { CONDITIONS } from '../../constants';

const NUM_ITEMS = 24
const CURSOR_HEIGHT = 120

const conditionsOrdering = ['FORBIDDEN', 'BAD', 'CORRECT', 'GOOD', 'EXCELLENT']

// previously named HygoParcelleIntervention

const ModulationBarTiny = ({ width, height, sizes }) => {
	/**
	 *
	 * @param props
	 * { from, initialMin, initialMax, data ,width, onHourChangeEnd}
	 *
	 */

	const h = height || 10
	const w = width || 60

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

	return (
		<View style={[styles.container, { width: w, height: h}]}>

			{/* The slots */}
			{[...Array(NUM_ITEMS).keys()].map(i => {
				return (
					<TouchableWithoutFeedback key={i} onPress={() => { }}>
						<View style={[styles.parcelle, {
							width: parseFloat(w) / NUM_ITEMS,
							height: h,
						},
						]}>
							<View
								style={[
									styles.subTile,
									{
										backgroundColor: computeColorFromSize(sizes[i]),
										height:h
									}
								]}>
							</View>
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

})

export default ModulationBarTiny
