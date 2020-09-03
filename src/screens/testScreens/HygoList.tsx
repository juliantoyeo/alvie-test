import React, { useEffect, useState } from 'react';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text } from 'native-base';
import { View, StyleSheet } from 'react-native'
import HygoCard from '../../components/HygoCard';
import COLORS from '../../colors'
import { TouchableOpacity } from 'react-native-gesture-handler';

const HygoItem = ({ item, onPress }) => {
    return (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={() => {onPress(item.id, !item.selected)}}>
                <Icon type='AntDesign' name={item.selected ? 'arrowdown' : 'arrowright'} style={{fontSize: 14}} />
            </TouchableOpacity>
            <Text>{item.arg1}</Text>
            <Text>{item.arg2}</Text>
        </View>
    )
}

export const HygoList = ({title, items, onPress}) => {
    const [opened, setOpened] = useState(false)
    console.log(title)
    console.log(items.filter((it)=>it.selected == true))
    console.log(items.filter((it)=>it.selected == true).length > 0)
    return ( 
        <View style={styles.container}>
            <View style={{ minHeight: 26, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                    
                     <Icon type='AntDesign' name={items.filter((it)=>it.selected == true).length > 0 ? 'arrowdown' : 'arrowright'} style={{fontSize: 16}} />
             
                    <Text style={styles.cardTitle}>{title}</Text>
                    <TouchableOpacity onPress={()=>setOpened(!opened)}>
                        <Icon type='AntDesign' name={opened ? 'arrowdown' : 'arrowright'} style={{fontSize: 16}} />
                    </TouchableOpacity>
                </View>
                {opened && items.map((item,k) => (<HygoItem key={k} item={item} onPress={onPress}/>
                    )
                )}
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
    }
  })