import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer } from 'native-base';
import { HygoList } from './HygoList';
import HygoButton from'../../components/v2/HygoButton';
import { getInterventions } from '../../api/hygoApi';
import { ModulationContext } from '../../context/modulation.context';
import i18n from 'i18n-js'
import hygoStyles from '../../styles';
import COLORS from '../../colors';
import {Amplitude, AMPLITUDE_EVENTS} from '../../amplitude'
const {selectParcelsScreen: ampEvent} = AMPLITUDE_EVENTS

const types=["ble", "mais"]

const fieldsData = [
  
  {
    type : "ble",
    name:"Parcelle1",
    area: 30,
    selected: false,
    id: 1
  },
  {
    type : "ble",
    name: "Parcelle2",
    area: 60,
    selected: false,
    id: 2
  },
  {
    type: "mais",
    name:"Parcelle3",
    area:36,
    selected: false,
    id: 3
  },
  {
    type: "mais",
    name:"Parcelle4",
    area:64,
    selected: false,
    id: 4
  }
]
    

const SelectParcelsScreen = ({ navigation }) => {
  const context = React.useContext(ModulationContext)
  const [fields, setFields] = useState<any>([])
  const [ready, setReady] = useState<boolean>(false)

  useEffect(() => {
    setFields(fieldsData)
    context.cleanFields()
  }, [])

  useEffect(() => {
    setReady(context.selectedFields.length > 0)
  }, [context.selectedFields])

  const updateList = (id, newSelected) => {
    const touchedField = {...fields.find( (p) => p.id == id), selected: newSelected}
    setFields([ ...fields.filter((p) => p.id != id), touchedField])
    if (newSelected == true) {
      context.addField(touchedField)
    } else {
      context.removeField(touchedField.id)
    }
  }
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
                      <Title style={styles.headerTitle}>Choix des parcelles</Title>
                  </Body>
                  <Right style={{ flex: 1 }}></Right>
              </Header>
              <Content style={styles.content}>
                  <View>
                    <Text style={hygoStyles.h0}>Mes Parcelles</Text>
                    {types.map((t, k) => {
                      const items = fields.filter( (p) => p.type == t)
                      return (
                        items.length > 0 && 
                        <HygoList key={k} title={t} items={items.sort((it1, it2)=>it1.id - it2.id)} onPress={updateList}/>
                      )
                    })}
                  </View>
              </Content>
              <Footer style={styles.footer}>
              <HygoButton  
                label="CHOIX DES PRODUITS" 
                onPress={() => {navigation.navigate('TestPageProducts')}}
                enabled={ready}
                icon={{
                  type: 'AntDesign',
                  name: 'arrowright',
                  fontSize: 26
                }}
              />
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
    },
  });
  const buttonStyle = StyleSheet.create({
    inner:{
      backgroundColor: '#AFAEAE'
    }
  });
  
  const mapStateToProps = (state) => ({
    
  });
  
  const mapDispatchToProps = (dispatch, props) => ({
    
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SelectParcelsScreen);