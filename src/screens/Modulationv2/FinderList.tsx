import React, { useEffect, useState } from 'react';
import { Icon, Text } from 'native-base';
import { View, StyleSheet, FlatList } from 'react-native'
import COLORS from '../../colors'
import hygoStyles from '../../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HygoInputModal from './HygoInputModal';
import { activeProductType } from '../../types/activeproduct.types';
import HygoButton from '../../components/v2/HygoButton';

type productType={
    type:string,
    name:string,
    selected: boolean,
    id: number
}
type finderListProps = {
    title: string,
    items: Array<activeProductType>,
    onPress: any,
    collapseEnabled: boolean
}
type itemProps = {
    item: activeProductType,
    onPress: any
}

const Item = ({ item, onPress}: itemProps) => {
    return (
        <View style={styles.item}>
            {item.selected ? (
            <View style={{display: 'flex', flexDirection:'row'}}>
                <Icon type='AntDesign' name={'check'} style={{fontSize: 14, color: COLORS.DARK_BLUE, paddingTop: 2}} />
                <Text style={[hygoStyles.text, {flex:1, paddingLeft:10}]}>{item.name}</Text>
                {/* <Text style={hygoStyles.text}>{item.dose && item.dose.toString() + 'L/ha'}</Text> */}
            </View>
            ): (
            <TouchableOpacity
            style={{display: 'flex', flexDirection:'row'}} 
                onPress={()=>onPress(item)}
            >
                <Icon type='AntDesign' name={'pluscircleo'} style={{fontSize: 14, color: COLORS.DARK_BLUE, paddingTop: 2}} />
                <Text style={[hygoStyles.text, {flex:1, paddingLeft:10}]}>{item.name}</Text>
            </TouchableOpacity>
            )}
        </View>
    )
}

export const FinderList = ({title, items, onPress, collapseEnabled}: finderListProps) => {
    const [opened, setOpened] = useState(false)
    const onAdd = (item) => {
        onPress(item)
    }
    // useEffect(() => {   
    //     if (!collapseEnabled) {
    //         setOpened(false)
    //     }
    // }, [collapseEnabled])
    return ( 
        <View style={styles.container}>
            
            <View style={{  display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <TouchableOpacity 
                    // onPress={()=> collapseEnabled && setOpened(!opened)}
                    onPress={()=> setOpened(!opened)}
                    style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', borderBottomWidth: 1, borderColor: '#D1CFCF'}}
                >
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Icon 
                        type='AntDesign' 
                        name={opened ? 'down' : 'right'} 
                        style={{fontSize: 16, color: COLORS.DARK_BLUE, padding: 10, paddingRight: 20}} />
                </TouchableOpacity>

                {opened && items.sort((a, b) => a.name.localeCompare(b.name)).map((item,k) => {

                    return (<Item key={k} item={item} onPress={onAdd}/>
                    )
                })}
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
    // cardTitle: {
    //   textTransform: 'uppercase',
    //   fontFamily: 'nunito-bold',
    //   fontSize: 14,
    //   flex: 1,
    //   color: COLORS.DARK_BLUE
    // },
    cardTitle: {
        ...hygoStyles.h1,
      flex: 1,
      padding: 10,
      paddingLeft: 20
    },
    item: {
        // display: 'flex', 
        // flexDirection: 'row', 
        // justifyContent:'space-between', 
        marginTop: 10, 
        paddingLeft:20, 
        paddingRight: 20 }
  })