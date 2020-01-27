import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Dimensions, Image, StyleSheet,AsyncStorage  } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Spinner, Content, Card, CardItem, Button, Row, Body, Icon, Text, H1, Grid, H2, H3, Left, Right, View } from 'native-base';
import HeaderHygo from '../components/HeaderHygo';
import InterventionResume from '../components/InterventionResume';
import { getLastGeometryFields} from '../api/hygoApi';
import  MapView, {Polygon} from 'react-native-maps';
import Geojson from 'react-native-geojson';


class InterventionMapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.intervention = this.props.navigation.getParam('intervention')
        this.state = {
            date: new Date().getDate(),
            month: new Date().getMonth() + 1,
            temp: 0,
            humi: 0,
            timestamp: '',
            fieldValues: [],
            loop: true,
            condition : "evaluation",
            conditionColor : "white",
            isLoadingMap: true,
            region: {
                latitude: 49.961518,
                longitude: 2.976213,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
             
        }
    } 


    onRegionChange = (region) => {
    this.setState({ region });
    }
    transformGeojsonPolygon = () =>{

    }

    loop = async () => {
        try {
            // console.log('deviceid');
            // console.log(this.intervention.deviceid);
            // console.log('interventionid ');
            // console.log(this.intervention.interventionid);
            const {fieldValues} = await getLastGeometryFields(this.intervention.deviceid, this.intervention.interventionid);
            console.log(fieldValues);
            // console.log('resulto :');
            // console.log(resulto);
            // const {fieldValues} = resulto;
            if (fieldValues) {
                // console.log('fieldValues 2:');
                // console.log(fieldValues);
                this.setState({fieldValues});
                console.log('fieldValues :');
                console.log(fieldValues);
                this.setState({isLoadingMap:false})
            }
            if(this.state.loop) {
                setTimeout(() => this.loop(),30000);
            }
        } catch(err)
        {
            console.log(err)
            return;
        }
    }

    async componentDidMount() {
        this.loop();            
    }

    componentWillUnmount() { 
        this.setState({loop: false});
        this.setState({isLoadingMap: false});
        
    }


    render() {
        const myPlace = { 
            "type" : "Featurecollection", 
            "features" : [
                {
                    "type" : "Feature", 
                    
                    "geometry" : {
                        "type":"Polygon",
                        "coordinates":[[[2.977614,49.962026],[2.976637,49.961518],[2.976213,49.961853],[2.97719,49.96236],[2.977614,49.962026]]]
                    }
                }
            ]
        };

        return (
            <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
            <Container style={styles.container}>
            {(this.state.fieldValues.length > 1) ? (
                <MapView
                    provider = "google"
                    //mapType = "hybrid"
                    region={this.state.region}
                    //onRegionChange={this.onRegionChange}
                    style={styles.map}
                >
                    <Polygon
                        coordinates = 
                        {[
                            {latitude: 49.962863, longitude:2.979011},
                            {latitude: 49.962722, longitude:2.979145},
                            {latitude: 49.961673, longitude:2.980235},
                            {latitude: 49.960503, longitude:2.972783}
                        ]}
                    />
               
                {/*
                    this.state.fieldValues.map((fieldValue) => {
                        return (
                            <Geojson geojson={fieldValue.features_rpg} />  
                        );
                        }
                    )
                    */}
                </MapView>
                ): (
                    <View style={styles.message}>
                    <Card >
                        <CardItem>
                            <Text style={styles.ecritures}> Aucune parcelle enregistrée, en cas de problème, vous pouvez nous contacter au 06 68 48 38 83 </Text>
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
        width : 600,
        height : 400,
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
    userName: state.authen.userName,
    produitPhytoClicked : state.pulve.produitPhytoClicked,
    newSession: state.pulve.newSession,
    lastSession: state.pulve.lastSession
});
const mapDispatchToProps = (dispatch, props) => ({
})
  
export default connect(mapStateToProps, mapDispatchToProps)(InterventionMapScreen);
