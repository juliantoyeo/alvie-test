import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer } from 'native-base';
import { HygoList } from './HygoList';
import HygoButton from'../../components/HygoButton';
import { getInterventions } from '../../api/hygoApi';
import { ModulationContext } from '../../context/modulation.context';
import i18n from 'i18n-js'
import COLORS from '../../colors'
import {Amplitude, AMPLITUDE_EVENTS} from '../../amplitude'
const {selectParcelsScreen: ampEvent} = AMPLITUDE_EVENTS

const types=["ble", "mais"]

const fieldsData = [
  
  {
    type : "ble",
    arg1:"Parcelle1",
    arg2: "30ha",
    selected: false,
    id: 1
  },
  {
    type : "ble",
    arg1: "Parcelle2",
    arg2: "60ha",
    selected: false,
    id: 2
  },
  {
    type: "mais",
    arg1:"Parcelle3",
    arg2:"36ha",
    selected: false,
    id: 3
  },
  {
    type: "mais",
    arg1:"Parcelle4",
    arg2:"64ha",
    selected: false,
    id: 4
  }
]
    

const SelectParcelsScreen = ({ navigation }) => {
  const context = React.useContext(ModulationContext)
  const [fields, setFields] = useState<any>([])

  useEffect(() => {
    setFields(fieldsData)
    context.cleanFields()
  }, [])

  const updateList = (id, newSelected) => {
    const touchedField = {...fields.find( (p) => p.id == id), selected: newSelected}
    setFields([ ...fields.filter((p) => p.id != id), touchedField])
    if (newSelected == true) {
      context.addField(touchedField)
    } else {
      context.removeField(touchedField)
    }
  }
  return (
      <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
          <StatusBar translucent backgroundColor="transparent" />
          <Container contentContainerStyle={[styles.container, StyleSheet.absoluteFill]}>
              <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
                  <Left style={{ flex: 1 }}></Left>
                  <Body style={styles.headerBody}>
                      <Title style={styles.headerTitle}>Pulvérisation</Title>
                      <Title style={styles.headerTitle}>Choix des parcelles</Title>
                  </Body>
                  <Right style={{ flex: 1 }}></Right>
              </Header>
              <Content style={styles.content}>
                  <View>
                    <Text style={styles.title}>Mes Parcelles</Text>
                    {types.map((t, k) => {
                      const items = fields.filter( (p) => p.type == t)
                      return (
                        !!items && 
                        <HygoList key={k} title={t} items={items.sort((it1, it2)=>it2.id <= it1.id)} onPress={updateList}/>
                      )
                    })}
                  </View>
              </Content>
              <Footer style={styles.footer}>
              <HygoButton  
                    label="CHOIX DES PRODUITS" 
                    icon={{
                      type: 'AntDesign',
                      name: 'arrowright',
                      fontSize: 26
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
    }
  });
  
  const mapStateToProps = (state) => ({
    
  });
  
  const mapDispatchToProps = (dispatch, props) => ({
    
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SelectParcelsScreen);