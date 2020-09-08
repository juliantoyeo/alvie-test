import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer, Grid, Col, Row } from 'native-base';
import { ProductList } from './ProductList';
import HygoButton from'../../components/HygoButton';
import { getInterventions } from '../../api/hygoApi';
import { ModulationContext } from '../../context/modulation.context';
import { HygoCard, HygoCardSmall } from '../../components/v2/HygoCards';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from 'i18n-js';
import hygoStyles from '../../styles';
import COLORS from '../../colors';
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
    const totalArea = context.selectedFields.reduce((r, f) => r + f.area, 0)
    const volume = totalArea * context.debit
    const totalPhyto = totalArea * context.selectedProducts.reduce((r, p) => r + p.dose, 0)
    const water = volume - totalPhyto
   
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
                        <Title style={styles.hourTitle}>{context.selectedSlot.min}h - {context.selectedSlot.max}h</Title>
                        <View style={{paddingBottom:20}}>
                        <Metrics currentHourMetrics={context.metrics} hasRacinaire={hasRacinaire()} />
                        </View>
                        <ExtraMetrics currentHourMetrics={context.metrics} />
                    </View>
                    {/*=============== Quantities ==============*/}
                    <View>
                        <Text style={hygoStyles.h0}>Rapport de pulvérisation</Text>
                        <HygoCard title='Remplissage de cuve'>
                          <HygoCardSmall title='Matières actives' cardStyle={{ borderWidth:1, borderColor: '#B4B1B1'}}>
                            <Grid style={{paddingTop: 10}}>
                            {context.selectedProducts.map((p)=>(
                              <Row key={p.id} style={{paddingLeft:20}}>
                                <Col><Text style={[hygoStyles.text, {color:COLORS.DARK_BLUE}]}>{p.name}</Text></Col>
                                <Col><Text style={[hygoStyles.text, {color:COLORS.DARK_BLUE, textAlign:'right'}]}>
                                  {p.dose * totalArea * (100 - context.mod) / 100}L
                                </Text></Col>
                              </Row>
                            ))}
                            </Grid>
                          </HygoCardSmall>
                          <Grid style={{paddingTop: 10}}>
                            <Row>
                              <Col><Text style={hygoStyles.text}>Volume de bouillie</Text></Col>
                              <Col><Text style={[hygoStyles.text, { textAlign:'right'}]}>{volume}L</Text></Col> 
                            </Row>
                            <Row>
                              <Col><Text style={hygoStyles.text}>Eau</Text></Col>
                              <Col><Text style={[hygoStyles.text, { textAlign:'right'}]}>{water}L</Text></Col>
                            </Row>
                            <Row>
                              <Col><Text style={hygoStyles.text}>Surface totale</Text></Col>
                              <Col><Text style={[hygoStyles.text, { textAlign:'right'}]}>{totalArea}ha</Text></Col>
                            </Row>
                            <Row>
                              <Col><Text style={hygoStyles.text}>Débit</Text></Col>
                              <Col><Text style={[hygoStyles.text, { textAlign:'right'}]}>{context.debit}L/ha</Text></Col>
                            </Row>
                          </Grid>
                        </HygoCard>
                      {/*============= Final result ====================*/}
                        <View style={{paddingTop: 20, paddingBottom: 40}}>
                    <HygoCard>
                        <View style={{display: 'flex', justifyContent:'space-between', flexDirection:'row', alignItems: 'center'}}>
                        <Text style={[hygoStyles.h0, {padding:0}]}>Total économisé</Text>
                        <Text style={[hygoStyles.h0, {padding:0, fontSize: 26}]}>{`${totalPhyto * context.mod / 100}L (${context.mod}%)`}</Text>
                      </View>
                    </HygoCard>
                    </View>
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
    hourTitle: {
      color: '#FFF',
      textTransform: 'uppercase',
      fontFamily: 'nunito-bold',
      fontSize: 26,
      paddingTop: 20
    }
})

const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = (dispatch, props) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen);