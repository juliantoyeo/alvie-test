import React, { useEffect, useState } from 'react';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text, Grid, Row, Col } from 'native-base';
import { View, StyleSheet } from 'react-native'
import hygoStyles from '../../styles';
import COLORS from '../../colors'
import { TouchableOpacity } from 'react-native-gesture-handler';



export const HygoList = ({title, items, onPress}) => {
    const [opened, setOpened] = useState(false)
    return ( 
        <View style={styles.container}>
            <View style={{ minHeight: 26, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                    
                     {/* <Icon 
                        type='AntDesign' 
                        name={items.filter((it)=>it.selected == true).length > 0 ? 'arrowdown' : 'arrowright'} 
                        style={{fontSize: 16, color: COLORS.CYAN}} /> */}
             
                    <Text style={[hygoStyles.h1, {flex:1}]}>{title}</Text>
                    <TouchableOpacity onPress={()=>setOpened(!opened)}>
                        <Icon 
                            type='AntDesign' 
                            name={opened ? 'down' : 'right'} 
                            style={{fontSize: 16, color: COLORS.CYAN}}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    {opened && items.map((item,k) => (
                    <TouchableOpacity 
                        key={k}
                        onPress={() => {onPress(item.id, !item.selected)}}
                        style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}
                    >
                        <Icon 
                            type='FontAwesome' 
                            name={item.selected ? 'square' : 'square-o'}
                            style={{fontSize:14, color: COLORS.CYAN, paddingTop: 2 }}  
                        />
                        <Text style={[hygoStyles.text, {flex:1}]}>{item.name}</Text>
                        <Text style={[hygoStyles.text, {textAlign:'right'}]}>{item.area}ha</Text>
                    </TouchableOpacity>
            
                    ))}
                </View>
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
      padding: 20,
      display: 'flex',
      elevation: 2,
      marginBottom: 10
    },
    cardTitle: {
      textTransform: 'uppercase',
      fontFamily: 'nunito-bold',
      fontSize: 14,
      flex: 1,
      color: COLORS.CYAN
    },
  })