import React from 'react'
import { View, Dimensions } from 'react-native'
import formatTime from '../../utils/formatTime'
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { VictoryArea, VictoryChart, VictoryTheme, VictoryAxis, VictoryScatter, VictoryLabel } from "victory-native";

const HygoChart = ({ data, mainColor, secondaryColor, label, yUnit }) => {

	if (!data || data.length <= 0)
		data = [{x:0, y: 0}]
	const getDomain = () => {
		let min = Math.min(...data.map(d => d.y)), max = Math.max(...data.map(d => d.y))
		return (min == max) ? {
			y: [
				min - 1,
				max + 1
			]
		} : {
			y: [
				min - 0.30 * (max - min),
				max
			]
		}
	}

	const getAreaData = () => {
		let min = Math.min(...data.map(d => d.y)), max = Math.max(...data.map(d => d.y))
		return data.map(d => {
			return {
				...d,
				y0: min - 0.25 * (max - min),
			}
		})
	}

	return (
		<View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<VictoryChart
				//theme={VictoryTheme.material}
				domainPadding={{ x: 15 }}
				scale={{ x: "time" }}
				padding={{ top: 30, bottom: 30, left: 50, right: 30 }}
				width={Dimensions.get('window').width - 10}
				height={210}
				animate={false}>
				<Defs>
					<LinearGradient id="gradientFill"
						x1="0%" y1="0%" x2="0%" y2="100%">
						<Stop offset="20%" stopColor={secondaryColor} stopOpacity="0.7" />
						<Stop offset="100%" stopColor={mainColor} />
					</LinearGradient>
				</Defs>
				<VictoryAxis
					tickFormat={(x) => formatTime(x, 'h')}
					offsetY={30}
					style={{
						ticks: { stroke: "black", size: 5 },

					}}
				/>
				<VictoryAxis
					dependentAxis
					crossAxis={false}
					label={yUnit ? yUnit : ''}
					style={{
						grid: { stroke: "#DDDDDD", strokeDasharray: "15, 10" },
						ticks: { stroke: "black", size: 5 },
						axisLabel: { padding: 35 }
					}}
				/>
				<VictoryArea
					style={{ data: { fill: 'url(#gradientFill)', stroke: mainColor, strokeWidth: 2 } }}
					//   animate={{
					//     duration: 2000,
					//     onLoad: { duration: 1000 }
					//   }}
					domain={getDomain()}
					data={getAreaData()}
				/>
				<VictoryLabel
					text={label.toLocaleUpperCase()}
					textAnchor="middle"
					verticalAnchor="middle"
					y={160} x={Dimensions.get('window').width / 2}
					style={{
						fill: '#fff',
						fontSize: 16,
						fontWeight: 500,
						//fontFamily: 'nunito-heavy',
					}}
				/>
				<VictoryScatter
					style={{ data: { fill: mainColor } }}
					size={4}
					data={data}
				/>
			</VictoryChart>
		</View>
	)
}

export default HygoChart
