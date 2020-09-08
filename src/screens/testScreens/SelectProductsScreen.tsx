import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer, Grid, Row, Col } from 'native-base';
import { ProductList } from './ProductList';
import { FinderList } from './FinderList';
import HygoInputModal from './HygoInputModal';
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

const types=["fongicide", "herbicide"]

type productType={
    type:string,
    name:string,
    selected: boolean,
    id: number
}

const productsData: Array<productType> = [
  
  {
    type : "fongicide",
    name:"Prozator",
    selected: false,
    id: 1
  },
  {
    type : "fongicide",
    name: "Eliminator",
    selected: false,
    id: 2
  },
  {
    type: "herbicide",
    name:"Fusilator",
    selected: false,
    id: 3
  },
  {
    type: "herbicide",
    name:"destoyator",
    selected: false,
    id: 4
  }
]



const SelectProductsScreen = ({ navigation }) => {
    const context = React.useContext(ModulationContext) 
    const [products, setProducts] = useState<Array<productType>>([])
    const [debitModalVisible, setDebitModalVisible] = useState<boolean>(true)
    const [ready, setReady] = useState<boolean>(false)
    const [viewMode, setViewMode] = useState<boolean>(true)
    const totalArea = context.selectedFields.reduce((r, f) => r + f.area, 0)

    useEffect(() => {
        setProducts(productsData)
        // context.setSelectedProducts([
        //     {type: 'fongicide', name: 'Fusilator', dose: '0.7 L/ha', id: 3},
        //     {type: 'herbicide', name: 'Eliminator', dose: '1.3 L/ha', id: 2}
        // ])
        const asyncFunction = async () => {
          const equ = await getEquipment()
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

    const Cuve = () => (
        <View>
          <Text style={hygoStyles.h0}>Ma Cuve</Text>
          <HygoCard>
            <View style={styles.grid}>
              <View style={styles.row}>
                <Text style={styles.colLeft}>Débit</Text>
                <Text style={styles.colRight}>{context.debit} L/ha</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.colLeft}>Type de buse</Text>
                <Text style={styles.colRight}>{context.buses}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.colLeft}>Volume de bouillie</Text>
                <Text style={[styles.colRight, {borderWidth: 0}]}>{context.debit * totalArea} L</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.colLeft}>Total surface</Text>
                <Text style={[styles.colRight, {borderWidth: 0}]}>{totalArea} ha</Text>
              </View>
            </View>
          </HygoCard>
        </View>
    )
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
                            <Icon type='AntDesign' name ={viewMode ? 'search1' : 'check'} style={styles.iconTitle} />
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