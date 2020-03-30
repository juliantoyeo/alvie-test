import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Dimensions, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Container, Spinner, Content, Card, CardItem, Icon, Text, H2, View } from 'native-base';
import HeaderHygoBack from '../components/HeaderHygoBack';
import InterventionResumeMap from '../components/InterventionResumeMap';
import LegendMap from '../components/LegendMap';
import { getLastGeometryFields} from '../api/hygoApi';
import  MapView, {Polygon} from 'react-native-maps';
import {updatePhytoSelect} from '../store/actions/intervActions';


class InterventionMapScreen extends React.Component {
    _isMounted = false;
    polygons = {};

    constructor(props) {
        super(props);
        this.intervention = this.props.navigation.getParam('intervention')
        this.state = {
            fieldValues: [],
            isLoadingMap: true,
            region: {
                latitude: '',
                longitude: '',
                latitudeDelta: '',
                longitudeDelta: '',
            }
        }
    }

    onRegionChange = (region) => {
        this.setState({ region });
    }

    loop = async () => {
        try {
            const {fieldValues} = await getLastGeometryFields(this.intervention.deviceid, this.intervention.interventionid);
            
            if (!!fieldValues) {
                if (this._isMounted) {
                    this.setState({fieldValues});

                    const region = {latitude: (this.intervention.avglat_centroid || fieldValues[0].lat_centroid), longitude: (this.intervention.avglon_centroid || fieldValues[0].lon_centroid), latitudeDelta: (this.intervention.lat_delta || 0.0222),longitudeDelta: (this.intervention.lon_delta || 0.0121 )}
                    this.setState({region})
                    this.setState({isLoadingMap:false});
                }
            } else if (!fieldValues){
                if (this._isMounted) {
                    this.setState({isLoadingMap:false});
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        this.loop();            
    }

    componentWillUnmount() { 
        this._isMounted = false;
        this.setState({isLoadingMap: true});
    }

    updatefielsvalues = async (value) => {
        const {fieldValues} = await getLastGeometryFields(this.intervention.deviceid, this.intervention.interventionid);

        this.setState({fieldValues})
        this.props.updatePhytoSelect(value, this.intervention.deviceid, this.intervention.interventionid);
    }

    render() {
        return (
            <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
                <Container style={styles.container}>
                    <HeaderHygoBack/>
                    { this.state.isLoadingMap && (
                        <Content contentContainerStyle = {{ 
                            padding: 10,
                            paddingRight: 10,
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}>
                            <Spinner color='#194769' />
                            <Icon type ="FontAwesome5" name="tractor" style={{color : '#194769', fontSize: 65}}/>
                            <H2 style={styles.ecritures}>Chargement des données du capteur Hygo, merci de patienter quelques instants</H2>
                        </Content> 
                    )}

                    { !this.state.isLoadingMap && this.state.fieldValues.length > 0 && (
                        <Content contentContainerStyle = {{ 
                            padding: 10,
                            paddingRight: 10,
                            paddingTop: 10,
                            paddingBottom: 10,
                            alignItems: 'center',
                            alignContent: 'center',
                        }}>
                            <View style={styles.containerMap}>
                                <MapView
                                    provider="google"
                                    mapType="hybrid"
                                    region={this.state.region}
                                    onRegionChangeComplete={this.onRegionChange}
                                    style={styles.map}>
                                    { this.state.fieldValues.map((fieldValue) => {
                                        let fid = fieldValue.id
                                        return (
                                            <Polygon
                                                key={fieldValue.id}
                                                strokeWidth={1}
                                                strokeColor={'rgba(89,223,214,1)'}
                                                ref={ref => (this.polygons[fid] = ref)}
                                                onLayout={() => this.polygons[fid].setNativeProps({
                                                    fillColor: fieldValue.color_field
                                                })}
                                                tappable={true}
                                                onPress={() => {
                                                    Alert.alert(
                                                        `Parcelle : ${fieldValue.id_parcelles_rpg}`, 
                                                        `Température moyenne : ${Math.round(fieldValue.avgtemp)}°C
                                                         Hygrométrie moyenne : ${Math.round(fieldValue.avghumi)}%`
                                                    );
                                                }}
                                                coordinates={
                                                    fieldValue.features_rpg.geometry.coordinates[0].map((coordinate) => {
                                                        let hello ={};
                                                        hello.latitude = coordinate[1];
                                                        hello.longitude = coordinate[0];
                                                        return (hello);
                                                    })
                                                }
                                            />  
                                        );
                                    })}
                                </MapView>

                                <LegendMap />

                                <InterventionResumeMap 
                                    id={this.intervention.id}
                                    interventionid={this.intervention.interventionid}
                                    starttime={this.intervention.starttime}
                                    endtime={this.intervention.endtime}
                                    avgtemp={this.intervention.avgtemp}
                                    maxtemp ={this.intervention.maxtemp}
                                    mintemp = {this.intervention.mintemp}
                                    avghumi = {this.intervention.avghumi}
                                    maxhumi = {this.intervention.maxhumi}
                                    minhumi = {this.intervention.minhumi}
                                    number_fields = {this.intervention.number_fields}
                                    interventionDeviceId = {this.intervention.deviceid}
                                    updatefields = {this.updatefielsvalues}
                                    produitPhytoClickedIntervention = {this.state.fieldValues[0].phytoproduct}
                                    onPress = {(interv) => (interv)}/> 
                            </View>
                        </Content>
                    )}

                    { !this.state.isLoadingMap && this.state.fieldValues.length === 0 && (
                        <View style={styles.message}>
                            <Card>
                                <CardItem>
                                    <Text style={styles.ecritures}> Aucune parcelle enregistrée lors de cette intervention, en cas de problème, vous pouvez nous contacter au 06 68 48 38 83 </Text>
                                </CardItem>
                            </Card>
                            <Icon type ="AntDesign" name="aliwangwang-o1" style={styles.icon}/>
                        </View>
                    )}
                </Container> 
            </SafeAreaView>
        )
    }  
}

const styles = StyleSheet.create({
    map :{
        justifyContent :"center",
        flexDirection: 'column',
        height : Dimensions.get('window').height*3/6,
    },
    containerMap :{
        height : Dimensions.get('window').height,
        width : Dimensions.get('window').width-10,
        justifyContent :"center",
    },
    message :{
        flex: 1,
        justifyContent :"center",
        flexDirection: 'column',
    },
    icon :{
        color : '#194769',
        fontSize: 80
    },
    container: {
        backgroundColor: '#F6F6E9',
    },
    statusbar: {
        backgroundColor: '#F6F6E9',
        flex: 1
    }, 
});

const mapStateToProps = (state) => ({
    token: state.authen.token,
    interventionValues: state.interv.interventions
});

const mapDispatchToProps = (dispatch, props) => ({
    updatePhytoSelect: (produitPhytoClicked, deviceid, interventionid)=>dispatch(updatePhytoSelect(produitPhytoClicked, deviceid, interventionid)),
})
  
export default connect(mapStateToProps, mapDispatchToProps)(InterventionMapScreen);


