import React from 'react'

import { View, Image, Text, StyleSheet } from 'react-native'

const Metrics_v2 = ({ currentHourMetrics, hasRacinaire, color }) => {
	const styles = StyleSheet.create({
		conditionContainer: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-evenly',
			paddingTop: 20,
		},
		conditionItemContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		},
		conditionItemImage: {
			width: 24,
			resizeMode: 'contain',
			tintColor: color,
			marginBottom: 10,
		},
		conditionItemText: {
			fontFamily: 'nunito-bold',
			fontSize: 14,
			color: color,
		},
	})

	return (
		<View style={styles.conditionContainer}>
			<View style={styles.conditionItemContainer}>
				<Image source={require('../../../assets/ICN-Wind.png')} style={styles.conditionItemImage} />
				<View>
					<Text style={styles.conditionItemText}>
						{currentHourMetrics?.winddirection ? `${currentHourMetrics.winddirection} ${Math.round(currentHourMetrics.wind)} km/h`: 'km/h'}
					</Text>
					<Text style={styles.conditionItemText}>
						{currentHourMetrics?.gust ? `RAF ${Math.round(currentHourMetrics.gust)} km/h` : 'km/h'}
					</Text>
				</View>
			</View>
			<View style={styles.conditionItemContainer}>
				<Image source={require('../../../assets/ICN-Rain.png')} style={styles.conditionItemImage} />
				<Text style={styles.conditionItemText}>
					{currentHourMetrics?.precipitation ? `${Math.round(currentHourMetrics.precipitation)} mm` : 'mm'}
				</Text>
				<Text style={styles.conditionItemText}>
					{currentHourMetrics?.probability ? `${Math.round(parseFloat(currentHourMetrics.probability))}%` : '%'}
				</Text>
			</View>
			<View style={styles.conditionItemContainer}>
				<Image source={require('../../../assets/ICN-Temperature.png')} style={styles.conditionItemImage} />
				<Text style={styles.conditionItemText}>
					{currentHourMetrics?.mintemp ? `${Math.round(parseFloat(currentHourMetrics.mintemp))}°C` : '°C'}
				</Text>
				<Text style={styles.conditionItemText}>
					{currentHourMetrics?.maxtemp ? `${Math.round(parseFloat(currentHourMetrics.maxtemp))}°C` : '°C'}
				</Text>
			</View>
			<View style={styles.conditionItemContainer}>
				<Image source={require('../../../assets/ICN-Hygro.png')} style={styles.conditionItemImage} />
				<Text style={styles.conditionItemText}>
					{currentHourMetrics?.minhumi ? `${Math.round(currentHourMetrics.minhumi)}%` : '%'}
				</Text>
				<Text style={styles.conditionItemText}>
					{currentHourMetrics?.maxhumi ? `${Math.round(currentHourMetrics.maxhumi)}%` : '%'}
				</Text>
			</View>
			{ hasRacinaire && (
				<View style={styles.conditionItemContainer}>
					<Image source={require('../../../assets/sprout.png')} style={styles.conditionItemImage} />
					<Text style={styles.conditionItemText}>
						{currentHourMetrics?.minsoilhumi ? `${Math.round(currentHourMetrics.minsoilhumi)}%` : '%'}
					</Text>
					<Text style={styles.conditionItemText}>
						{currentHourMetrics?.maxsoilhumi ? `${Math.round(currentHourMetrics.maxsoilhumi)}%` : '%'}
					</Text>
				</View>
			)}
		</View>
	)
}



export default Metrics_v2
