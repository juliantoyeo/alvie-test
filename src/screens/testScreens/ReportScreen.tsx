import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer } from 'native-base';
import { ProductList } from './ProductList';
import HygoButton from'../../components/HygoButton';
import { getInterventions } from '../../api/hygoApi';
import { ModulationContext } from '../../context/modulation.context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from 'i18n-js'
import COLORS from '../../colors'
import Metrics from '../../components/pulverisation-detailed/Metrics';
import HourScale from '../../components/pulverisation-detailed/HourScale';
import ExtraMetrics from '../../components/pulverisation-detailed/ExtraMetrics';
import Modulation from '../../components/pulverisation-detailed/Modulation';
import HygoParcelleIntervention from '../../components/HygoParcelleIntervention';

const hasRacinaire = () => false

const next12HoursData = {
    '00': {condition : 'EXCELLENT'},
    '01': {condition : 'GOOD'},
    '02': {condition : 'CORRECT'},
    '03': {condition : 'BAD'},
    '04': {condition : 'FORBIDDEN'},
    '05': {condition : 'EXCELLENT'},
    '06': {condition : 'GOOD'},
    '07': {condition : 'CORRECT'},
    '08': {condition : 'BAD'},
    '09': {condition : 'FORBIDDEN'},
    '10': {condition : 'EXCELLENT'},
    '11': {condition : 'GOOD'},
    '12': {condition : 'CORRECT'},
    '13': {condition : 'BAD'},
    '14': {condition : 'FORBIDDEN'},
    '15': {condition : 'CORRECT'},
    '16': {condition : 'EXCELLENT'},
    '17': {condition : 'GOOD'},
    '18': {condition : 'BAD'},
    '19': {condition : 'FORBIDDEN'},
    '20': {condition : 'CORRECT'},
    '21': {condition : 'FORBIDDEN'},
    '22': {condition : 'EXCELLENT'},
    '23': {condition : 'CORRECT'},
}

const ReportScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext) 
    console.log(context)
    return (
        <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
            <StatusBar translucent backgroundColor="transparent" />
            <Container contentContainerStyle={[styles.container, StyleSheet.absoluteFill]}>
                <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => navigation.goBack()}>
                            <Icon type='AntDesign' name='arrowleft' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                        <Body style={styles.headerBody}>
                            <Title style={styles.headerTitle}>Pulvérisation</Title>
                            <Title style={styles.headerTitle}>Récapitulatif</Title>
                        </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>
                <Content style={styles.content}>
                    {/*=============== Metrics ===============*/}
                    <View style={{ backgroundColor: COLORS.DARK_BLUE}}>
                        <Text>{context.selectedSlot.min}h - {context.selectedSlot.max}h</Text>
                        <Metrics currentHourMetrics={context.metrics} hasRacinaire={hasRacinaire()} />
                        <ExtraMetrics currentHourMetrics={context.metrics} />
                    </View>
                    {/*=============== Quantities ==============*/}
                    <View>
                        <Title>Rapport de pulvérisation</Title>
                    </View>
                </Content>
            </Container>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    statusbar: { 
      flex: 1, 
      display: 'flex',
      backgroundColor: Platform.OS === 'ios' ? 'black' : COLORS.CYAN,
    },
    container: { 
      backgroundColor: COLORS.BEIGE,
      flexDirection:"column",
      display: 'flex', 
    },
    header: {
      backgroundColor: COLORS.CYAN
    },
    headerBody: {
      flex: 4,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      color: '#fff',
      fontFamily: 'nunito-regular',
      fontSize: 24
    },  
    title: {
      paddingTop:20,
      paddingLeft:10,
      textTransform: 'uppercase',
      fontFamily: 'nunito-bold',
      fontSize: 16,
      color: COLORS.CYAN
    },
    content: {
      backgroundColor: COLORS.BEIGE
    },
    footer:{
      backgroundColor: COLORS.BEIGE
    },
    sliderContainer: {
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
})

const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = (dispatch, props) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen);