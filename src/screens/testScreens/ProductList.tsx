import React, { useEffect, useState } from 'react';
import { Container, Header, Left, Body, Title, Right, Button, Content, Icon, Text } from 'native-base';
import { View, StyleSheet } from 'react-native'
import COLORS from '../../colors'
import { TouchableOpacity } from 'react-native-gesture-handler';

const HygoItem = ({ item, onPress }) => {
    return (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={() => {onPress(item.id)}}>
                <Icon type='AntDesign' name='delete' style={{fontSize: 14}} />
            </TouchableOpacity>
            <Text>{item.name}</Text>
            <Text>{item.dose}</Text>
        </View>
    )
}

export const ProductList = ({title, items, onPress}) => {
    const [opened, setOpened] = useState(true)
    return ( 
        <View style={styles.container}>
            <View style={{ minHeight: 26, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                {/* <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <TouchableOpacity onPress={()=>setOpened(!opened)}>
                        <Icon type='AntDesign' name={opened ? 'arrowdown' : 'arrowright'} style={{fontSize: 16}} />
                    </TouchableOpacity>
                </View> */}
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