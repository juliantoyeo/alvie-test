import React, { useEffect, useState } from 'react';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Grid, Row, Col } from 'native-base';
import { View, StyleSheet } from 'react-native'
import hygoStyles from '../../styles';
import COLORS from '../../colors'
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from 'i18n-js';


export const HygoList = ({title, items, onPress}) => {
    const [opened, setOpened] = useState(true)
    return ( 
        <View style={styles.container}>
            <View style={{  display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', borderBottomWidth: 1, borderColor: '#D1CFCF'}}>
                    
                     {/* <Icon 
                        type='AntDesign' 
                        name={items.filter((it)=>it.selected == true).length > 0 ? 'arrowdown' : 'arrowright'} 
                        style={{fontSize: 16, color: COLORS.CYAN}} /> */}
             
                    <Text style={styles.cardTitle}>{title}</Text>
                    <TouchableOpacity onPress={()=>setOpened(!opened)}>
                        <Icon 
                            type='AntDesign' 
                            name={opened ? 'down' : 'right'} 
                            style={{fontSize: 16, color: COLORS.DARK_BLUE, padding: 10, paddingRight:20}}
                        />
                    </TouchableOpacity>
                </View>
                {opened && 
                <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: 10, paddingLeft:20, paddingRight: 20 }}>
                    {items.map((item,k) => (
                    <TouchableOpacity 
                        key={k}
                        onPress={() => {onPress(item.id, !item.selected)}}
                        style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', paddingVertical:5}}
                    >
                        <Icon 
                            type='FontAwesome' 
                            name={item.selected ? 'square' : 'square-o'}
                            style={{fontSize:16, color: COLORS.DARK_BLUE, paddingTop: 3 }}  
                        />
                        <Text style={[hygoStyles.text, {flex:1, paddingLeft: 10}]}>{i18n.t(`cultures.${item.name}`)}</Text>
                        <Text style={[hygoStyles.text, {textAlign:'right'}]}>{item.area}ha</Text>
                    </TouchableOpacity>
            
                    ))}
                </View>
                }
            </View>
        </View>
       
    )
}

const styles = StyleSheet.create({
    container: {
      borderTopRightRadius: 20,
      backgroundColor: '#fff',
      shadowOffset: { width: 0, height: 2},
      shadowColor: '#000000',
      shadowRadius: 2,
      shadowOpacity: .2,
      display: 'flex',
      elevation: 2,
      marginBottom: 10,
    },
    cardTitle: {
        ...hygoStyles.h1,
      flex: 1,
      padding: 10,
      paddingLeft: 20
    },
  })