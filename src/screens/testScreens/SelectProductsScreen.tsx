import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, RefreshControl, StatusBar, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Footer } from 'native-base';
import { ProductList } from './ProductList';
import { FinderList } from './FinderList';
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
 
    
    const [viewMode, setViewMode] = useState<boolean>(true)
    useEffect(() => {
        setProducts(productsData)
        // context.setSelectedProducts([
        //     {type: 'fongicide', name: 'Fusilator', dose: '0.7 L/ha', id: 3},
        //     {type: 'herbicide', name: 'Eliminator', dose: '1.3 L/ha', id: 2}
        // ])
    }, [])

    const removeProduct = (id) => {
        context.removeProduct(id)
        const item:any = products.find((p) => p.id == id)
        setProducts([...products.filter((p) => p.id != id), {...item, selected:false}])
    }

    const Pulve = () => (
        <View>
            <Text>Débit : {context.debit}</Text>
        </View>
    )
    const Recap = () => (
        <View>
            { context.selectedProducts.length > 0 ? (
            <ProductList 
                items={context.selectedProducts.sort((it1, it2) => it1.id - it2.id)} 
                onPress={(id) => removeProduct(id)}
            />
            ) : (
            <Text>Sélectionner un produit dans la liste</Text>
            )}
        </View>
    )

    const Finder = () => {
        const [doseModalVisible, setDoseModalVisible] = useState<boolean>(false)
        const [select, setSelect] = useState<any>()

        const addProduct = (item:productType) => {
            setSelect(item)
            const dose: string = '0.7'
            setDoseModalVisible(true)
        }
        return (
            <View>
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
                />
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
                    />
                    
                    <Pulve/>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                        <Text style={styles.title}>Mes Produits</Text>
                        <Button transparent onPress={()=>{setViewMode(!viewMode)}}>
                            <Icon type='AntDesign' name ={viewMode ? 'search1' : 'check'} style={{ color: COLORS.CYAN }} />
                        </Button>
                    </View>
                    { viewMode  ? <Recap/> : <Finder/>}

                </Content>
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