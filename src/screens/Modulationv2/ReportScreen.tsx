import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Subtitle, Right, Button, Content, Icon, Text, Footer, Grid, Col, Row } from 'native-base';
import { ProductList } from './ProductList';
import HygoButton from '../../components/HygoButton';
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
import capitalize from '../../utils/capitalize';
const hasRacinaire = () => false

const ReportScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext)
    const totalArea = context.selectedFields.reduce((r, f) => r + f.area, 0)
    const volume = totalArea/10000 * context.debit
    const totalPhyto = totalArea/10000 * context.selectedProducts.reduce((r, p) => r + p.dose, 0)
    const water = volume - totalPhyto

    const modAvg = context.mod.length > 0 ? context.mod.reduce((sum, m) => sum + m.mod, 0) / context.mod.length : 0

    return (
        <SafeAreaView style={styles.statusbar} forceInset={{ top: 'always' }}>
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
                        <Title style={styles.headerSubtitle}>Récapitulatif</Title>
                    </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>
                <Content style={styles.content}>
                    {/*=============== Metrics ===============*/}
                    <View style={{ backgroundColor: COLORS.DARK_BLUE }}>
                        <Title style={styles.hourTitle}>{context.selectedSlot.min}h - {context.selectedSlot.max + 1}h</Title>
                        <View style={{ paddingBottom: 20 }}>
                            <Metrics currentHourMetrics={context.metrics} hasRacinaire={hasRacinaire()} />
                        </View>
                        <ExtraMetrics currentHourMetrics={context.metrics} />
                    </View>
                    {/*=============== Quantities ==============*/}
                    <View>
                        <Text style={hygoStyles.h0}>Rapport de pulvérisation</Text>
                        <HygoCard title='Remplissage de cuve'>
                            <HygoCardSmall title='Produits' cardStyle={{ borderWidth: 1, borderColor: '#B4B1B1' }}>
                                <Grid style={{ paddingTop: 10 }}>
                                    {context.selectedProducts.map((p) => {
                                        const mod = context.mod.filter((m) => m.product.id == p.phytoproduct.id)
                                        return (
                                            (mod.length > 0) && (
                                            <Row key={p.id} style={{ paddingLeft: 20 }}>
                                                <Col style={{flex:2, paddingRight: 10}}><Text style={[hygoStyles.text, { color: COLORS.DARK_BLUE, textAlign:'left' }]}>{capitalize(p.name)}</Text></Col>
                                                <Col style={{flex:1, paddingRight: 5}}><Text style={[hygoStyles.text, { color: COLORS.DARK_BLUE, textAlign: 'right' }]}>
                                                    {(p.dose * (100 - mod[0].mod) / 100).toFixed(3)} L/ha
                                                </Text></Col>
                                                <Col style={{flex:0.5}}><Text style={[hygoStyles.text, { color: COLORS.DARK_BLUE, textAlign: 'right' }]}>
                                                    {(p.dose * totalArea/10000 * (100 - mod[0].mod) / 100).toFixed(1)} L
                                                </Text></Col>
                                            </Row>
                                            )
                                        )
                                    })}
                                </Grid>
                            </HygoCardSmall>
                            <Grid style={{ paddingTop: 10 }}>
                                <Row>
                                    <Col><Text style={hygoStyles.text}>Volume de bouillie</Text></Col>
                                    <Col><Text style={[hygoStyles.text, { textAlign: 'right' }]}>{volume.toFixed(1)} L</Text></Col>
                                </Row>
                                <Row>
                                    <Col><Text style={hygoStyles.text}>Eau</Text></Col>
                                    <Col><Text style={[hygoStyles.text, { textAlign: 'right' }]}>{water.toFixed(1)} L</Text></Col>
                                </Row>
                                <Row>
                                    <Col><Text style={hygoStyles.text}>Surface totale</Text></Col>
                                    <Col><Text style={[hygoStyles.text, { textAlign: 'right' }]}>{(totalArea/10000).toFixed(1)} ha</Text></Col>
                                </Row>
                                <Row>
                                    <Col><Text style={hygoStyles.text}>Débit</Text></Col>
                                    <Col><Text style={[hygoStyles.text, { textAlign: 'right' }]}>{context.debit.toFixed(1)} L/ha</Text></Col>
                                </Row>

                            </Grid>
                            <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <Text style={[hygoStyles.h0, { padding: 0, paddingBottom: 0, fontSize: 16, paddingTop: 5 }]}>Total économisé</Text>
                                <Text style={[hygoStyles.h0, { padding: 0, paddingBottom: 0, fontSize: 24 }]}>{`${(totalPhyto * modAvg / 100).toFixed(1)}L (${modAvg.toFixed(0)}%)`}</Text>
                            </View>
                        </HygoCard>
                    </View>
                </Content>
                <Footer style={styles.footer}>
                    <HygoButton
                        label="EXPORTER"
                        onPress={() => {
                        }}
                        icon={{
                            type: 'AntDesign',
                            name: 'arrowright',
                            fontSize: 26,
                        }} />
                </Footer>
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
        flexDirection: "column",
        display: 'flex',
    },
    header: {
        backgroundColor: COLORS.CYAN,
        paddingTop:0
    },
    headerBody: {
        paddingTop: 0,
        flex: 4,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
   
    },
    headerTitle: {
        color: '#fff',
        fontFamily: 'nunito-regular',
        fontSize: 24,
    },
    headerSubtitle: {
        color: '#fff',
        fontFamily: 'nunito-regular',
        fontSize: 20,
    },
    title: {
        paddingTop: 20,
        paddingLeft: 10,
        textTransform: 'uppercase',
        fontFamily: 'nunito-bold',
        fontSize: 16,
        color: COLORS.CYAN
    },
    content: {
        backgroundColor: COLORS.BEIGE
    },
    footer: {
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