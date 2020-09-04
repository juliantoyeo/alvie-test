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

const PICTO_MAP = {
    'SUN': require('../../../assets/sunny.png'),
    'CLOUD': require('../../../assets/cloudy.png'),
    'STORM': require('../../../assets/stormy.png'),
    'RAIN': require('../../../assets/rainy.png'),
    'SNOW': require('../../../assets/snowy.png'),
  }
const slotsData: any = [
    {
        title: 'LUN',
        pictocode: 'SUN'
    },
    {
        title: 'MAR',
        pictocode: 'CLOUD'
    },
    {
        title: 'MER',
        pictocode: 'STORM'
    },
    {
        title: 'JEU',
        pictocode: 'RAIN'
    },
    {
        title: 'VEN',
        pictocode: 'SNOW'
    },
]
const SelectSlotScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext) 
    const [currentDay, setCurrentDay] = useState<dayType>('Lundi')
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
                            <Title style={styles.headerTitle}>Choix du créneau</Title>
                        </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>
                <Content>
                <View style={styles.tabBar}>
            { slotsData.slice(0, 5).map((d, i)=> {
              return (
                <TouchableOpacity key={i} style={[styles.tabHeading, { backgroundColor: currentDay === d.title ? '#fff' : COLORS.DARK_BLUE }]} onPress={() => setCurrentDay(d)}>
                  <Text style={[ styles.tabText, { color: currentDay === d.title ? COLORS.DARK_BLUE : '#fff' } ]}>{d.title}</Text>
                  <View style={styles.weatherContainer}>
                    <Image source={PICTO_MAP[d.pictocode]} style={styles.weatherImage} />
                  </View>
                </TouchableOpacity>
              )
            })}
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "black",
        opacity: 0.7
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      tabBar: {
        display: 'flex',
        flexDirection: 'row',
      },  
      tabHeading: {
        padding: 15,
        width: Dimensions.get('window').width / 5 - 4,
        backgroundColor: COLORS.DARK_BLUE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 20,
        marginHorizontal: 2,
      },
      tabText: {
        fontFamily: 'nunito-heavy',
        fontSize: 14,
        color: '#fff',
      },
      weatherContainer: {
        padding: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.BEIGE,
        marginTop: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      weatherImage: {
        width: 24,
        height: 24,
        tintColor: COLORS.DARK_BLUE
      },
  });
  
  const mapStateToProps = (state) => ({
    
  });
  
  const mapDispatchToProps = (dispatch, props) => ({
    
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SelectSlotScreen);