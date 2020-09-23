import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer, Picker, Grid, Row, Col } from 'native-base';
import { ProductList } from './ProductList';
import { FinderList } from './FinderList';
import HygoInputModal from './HygoInputModal';
import HygoPickerModal from './HygoPickerModal';
import HygoButton from'../../components/v2/HygoButton';
import { HygoCard } from '../../components/v2/HygoCards';
import { ModulationContext } from '../../context/modulation.context';
import i18n from 'i18n-js';
import HygoStyles from '../../styles';
import COLORS from '../../colors'

import {
    Alert,
    Modal,
    TouchableHighlight,
  } from "react-native";
import hygoStyles from '../../styles';
import { toISOString } from 'core-js/fn/date';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getEquipment } from '../../api/hygoApi';

import { productType, productsData } from './staticData';

const types=["fongicide", "herbicide"]
const buses=["Orange", "Bleu", "Verte", "Jaune", "Blanche"]

const SelectProductsScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext) 
    const [products, setProducts] = useState<Array<productType>>([])
    const [debitModalVisible, setDebitModalVisible] = useState<boolean>(true)
    const [ready, setReady] = useState<boolean>(false)
    const [viewMode, setViewMode] = useState<boolean>(true)
    const totalArea = context.selectedFields.reduce((r, f) => r + f.area, 0)

    useEffect(() => {
        setProducts(productsData)
        const asyncFunction = async () => {
          const equ = {buses: buses[0]} //await getEquipment()
          context.setBuses(equ.buses)
        }
        asyncFunction()
    }, [])

    useEffect(() => {
      setReady(context.selectedProducts.length > 0)
    }, [context.selectedProducts])

    const removeProduct = (id) => {
        context.removeProduct(id)
        const item:any = products.find((p) => p.id == id)
        setProducts([...products.filter((p) => p.id != id), {...item, selected:false}])
    }

    const Cuve = () => {
      const [buseModalVisible, setBuseModalVisible] = useState<boolean>(false)
      return(
    
        <View>
          <Text style={hygoStyles.h0}>Ma Cuve</Text>
          <HygoCard>
            <View style={styles.grid}>
              <View style={styles.row}>
                <Text style={styles.colLeft}>Débit</Text>
                <TouchableOpacity onPress={() => setDebitModalVisible(true)}>
                  <Text style={styles.colRight}>{context.debit} L/ha</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <Text style={styles.colLeft}>Type de buse</Text>
                <TouchableOpacity onPress={() => setBuseModalVisible(true)}>
                  <Text style={styles.colRight}>{context.buses}</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <Text style={styles.colLeft}>Volume de bouillie</Text>
                <Text style={[styles.colRight, {borderWidth: 0}]}>{(context.debit * totalArea).toFixed(1)} L</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.colLeft}>Total surface</Text>
                <Text style={[styles.colRight, {borderWidth: 0}]}>{totalArea.toFixed(1)} ha</Text>
              </View>
            </View>
          </HygoCard>
          <HygoPickerModal 
                    onClose={()=>{}} 
                    modalVisible={buseModalVisible} 
                    setModalVisible={setBuseModalVisible}
                    defaultValue={context.buses}
                    items = {buses}
                    setInput={(item)=>{
                        context.setBuses(item)
                    }}
                    title={`Type de buses`}
                />
        </View>
    )}
    const Recap = () => (
        <View>
            {context.selectedProducts.length > 0 ? (
            <ProductList 
                items={context.selectedProducts.sort((it1, it2) => it1.id - it2.id)} 
                onPress={(id) => removeProduct(id)}
            />
            ) : (
            <Text style={[hygoStyles.h0, {textAlign:'center'}]}>Ajouter les produits phytosanitaires que vous voulez utiliser</Text>
            )}
      </View>
    )

    const Finder = () => {
        const [doseModalVisible, setDoseModalVisible] = useState<boolean>(false)
        const [select, setSelect] = useState<productType>()

        const addProduct = (item:productType) => {
            setSelect(item)
            setDoseModalVisible(true)
        }
        return (
            <View>
                {types.map((t, k) => {
                    const items:Array<any> = products.filter( (p) => p.type == t)
                    return (
                        items.length > 0 && 
                        <FinderList 
                            key={k} 
                            title={t} 
                            items={items.sort((it1, it2) => it1.id - it2.id)} 
                            onPress={addProduct}
                        />
                    )
                })}
                <HygoInputModal 
                    onClose={()=>{}} 
                    modalVisible={doseModalVisible} 
                    setModalVisible={setDoseModalVisible}
                    defaultValue={'0.6'}
                    setInput={(str)=>{
                        const newItem: productType = {...select, selected: true}
                        context.addProduct({...newItem, dose: parseFloat(str)})
                        setProducts([...products.filter((p) => p.id != select.id), newItem])
                    }}
                    title={select && `Concentration pour ${select.name}`}
                />
            </View>
        )
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
                        <Title style={styles.headerTitle}>Choix des produits</Title>
                    </Body>
                    <Right style={{ flex: 1 }}></Right>
                </Header>
                <Content style={styles.content}>
                    <HygoInputModal 
                        onClose={()=>{}} 
                        modalVisible={debitModalVisible} 
                        setModalVisible={setDebitModalVisible}
                        defaultValue={context.debit.toString()}
                        setInput={(str) => context.setDebit(parseInt(str))}
                        title="Débit de pulvérisation"
                    />
                    
                    <Cuve/>

                    <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                        <Text style={hygoStyles.h0}>Mes Produits</Text>
                        <TouchableOpacity   onPress={()=>{setViewMode(!viewMode)}} >
                            <Icon type='AntDesign' name ={viewMode ? 'pluscircleo' : 'check'} style={styles.iconTitle} />
                        </TouchableOpacity>
                    </View>
                    { viewMode  ? <Recap/> : <Finder/>}

                </Content>
                { viewMode && (
                <Footer style={styles.footer}>
                <HygoButton  
                    label="CHOIX DU CRÉNEAU" 
                    onPress={() => { 
                        navigation.navigate('TestPageSlot') }
                    }
                    icon={{
                      type: 'AntDesign',
                      name: 'arrowright',
                      fontSize: 26,
                    }}
                    enabled={ready}
                  />
                </Footer>
                )}
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
      color: COLORS.DARK_BLUE
    },
    iconTitle: {
      color: COLORS.DARK_BLUE,
      padding: 10,
    },
    content: {
      backgroundColor: COLORS.BEIGE
    },
    footer:{
      backgroundColor: COLORS.BEIGE
    },
    grid: {
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection:'column'
    },
    row : {
      display: 'flex',
      justifyContent:'space-between',
      flexDirection:'row',
      paddingBottom:5
    },
    colRight: {
      ...hygoStyles.text,
      textAlign:'right',
      borderWidth: 1,
      borderColor: '#AAA',
      flex: 1,
      padding :2,
      paddingBottom:2
    },
    colLeft: {
      ...hygoStyles.text,
      flex: 3,
      padding: 2,
      paddingBottom:2
    }
  });
  
  const mapStateToProps = (state) => ({
    
  });
  
  const mapDispatchToProps = (dispatch, props) => ({
    
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SelectProductsScreen);