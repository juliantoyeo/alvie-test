import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer } from 'native-base';
import { ProductList } from './ProductList';
import HygoInputModal from './HygoInputModal';
import HygoButton from'../../components/HygoButton';
import { ModulationContext } from '../../context/modulation.context';
import i18n from 'i18n-js'
import COLORS from '../../colors'

import {
    Alert,
    Modal,
    TouchableHighlight,
  } from "react-native";

const types=["fongicide", "herbicide"]

const productsData = [
  
  {
    type : "fongicide",
    name:"Prozator",
    id: 1
  },
  {
    type : "fongicide",
    arg1: "Eliminator",
    id: 2
  },
  {
    type: "herbicide",
    arg1:"Fusilator",
    id: 3
  },
  {
    type: "herbicide",
    arg1:"destoyator",
    id: 4
  }
]
    

const SelectProductsScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext) 
    const [debitModalVisible, setDebitModalVisible] = useState<any>(true)
    useEffect(() => {
        context.setSelectedProducts([
            {type: 'fongicide', name: 'Fusilator', dose: '0.7 L/ha', id: 3},
            {type: 'herbicide', name: 'Eliminator', dose: '1.3 L/ha', id: 2}
        ])
    }, [])

  return (
      <SafeAreaView style={styles.statusbar} forceInset={{top:'always'}}>
          <StatusBar translucent backgroundColor="transparent" />
          <Container contentContainerStyle={[styles.container, StyleSheet.absoluteFill]}>
              <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
                  <Left style={{ flex: 1 }}></Left>
                  <Body style={styles.headerBody}>
                      <Title style={styles.headerTitle}>Pulvérisation</Title>
                      <Title style={styles.headerTitle}>Choix des produits</Title>
                  </Body>
                  <Right style={{ flex: 1 }}></Right>
              </Header>
              <Content style={styles.content}>
                    <Text>Débit : {context.debit}</Text>
                    <HygoInputModal 
                        onClose={()=>{}} 
                        modalVisible={debitModalVisible} 
                        setModalVisible={setDebitModalVisible}
                        defaultValue={context.debit.toString()}
                        setInput={(str) => context.setDebit(parseInt(str))}
                    />
                    <View>
                        <Text style={styles.title}>Mes Produits</Text>
                        {types.map((t, k) => {
                        const items = context.selectedProducts.filter( (p) => p.type == t)
                        return (
                            items.length > 0 && 
                            <ProductList 
                                key={k} 
                                title={t} 
                                items={items.sort((it1, it2)=>it2.id <= it1.id)} 
                                onPress={(id) => context.removeProduct(id)}/>
                        )
                        })}
                    </View>
                </Content>
                <Footer style={styles.footer}>
                <HygoButton  
                        label="CHOIX DU CRÉNEAU" 
                        onPress={() => navigation.navigate('TestPageSlot') }
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
  });
  
  const mapStateToProps = (state) => ({
    
  });
  
  const mapDispatchToProps = (dispatch, props) => ({
    
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SelectProductsScreen);