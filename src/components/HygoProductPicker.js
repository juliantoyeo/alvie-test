import React, { useState } from 'react'
import { StyleSheet, StatusBar, ScrollView, View, Text , TouchableOpacity} from 'react-native'

import { SafeAreaView } from 'react-navigation'

import { Header, Left, Body, Title, Right, Icon, Button, Container, Content } from 'native-base'

import COLORS from '../colors'

import i18n from 'i18n-js'

import { updateUIPhytoProduct } from '../api/hygoApi'

import { connect } from 'react-redux'
import { updatePhytoProductSelected } from '../store/actions/pulveActions'

const HygoProductPicker = ({ navigation, phytoProductList, updatePhytoProductSelected, phytoProductSelected }) => {
  let notifyUpdate = navigation.getParam('notifyUpdate')
  let source = navigation.getParam('source')
  let initial = navigation.getParam('initial')
  let set = navigation.getParam('set')

  const [selected, setSelected] = useState(source === 'intervention' ? initial : phytoProductSelected)

  const handleClick = (i) => {
    let p = JSON.parse(JSON.stringify(selected))
    if (selected.indexOf(i) > -1) {
      p = p.filter(e => e !== i)
    } else {
      p.push(i)
    }

    if (set) {
      set(p)
    }
    setSelected(p)
    
    if (!source || source !== 'intervention') {
      let p = JSON.parse(JSON.stringify(phytoProductSelected))
      if (phytoProductSelected.indexOf(i) > -1) {
        p = p.filter(e => e !== i)
      } else {
        p.push(i)
      }
      updateUIPhytoProduct(p)
      updatePhytoProductSelected(p)
      if (notifyUpdate) {
        notifyUpdate()
      }
    }
  }

  return (
    <SafeAreaView style={[styles.statusbar]} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <Container style={styles.content}>
        <Header hasTabs style={[styles.header]} androidStatusBarColor={COLORS.BEIGE} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
            {/*<Button transparent onPress={() => back ? navigation.replace(back, backParams||{}) : navigation.goBack()}>*/}
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name='close' style={{ color: COLORS.DARK_GREEN }} />
            </Button>
          </Left>
          <Body style={styles.headerBody}>
            <Title style={styles.headerTitle}>{i18n.t('picker.header')}</Title>
          </Body>
          <Right style={{ flex: 1 }}></Right>
        </Header>
        <Content contentContainerStyle={[styles.container]}>
          <View style={styles.listContent}>
            { source === 'intervention' && (
              <TouchableOpacity style={styles.elemContainer} onPress={() => {
                handleClick(-1)
              }}>
                <Text style={[styles.elemText, { fontWeight: selected.indexOf(-1) > -1 ? 'bold' : 'normal'} ]}>{i18n.t('intervention_map.other_farm_work')}</Text>
                { selected.indexOf(-1) > -1 && (
                  <Icon name="check" type="AntDesign" style={[styles.elemIcon, {color: selected.indexOf(-1) > -1 ? COLORS.DARK_GREEN : COLORS.GREY }]} />
                )}
              </TouchableOpacity>
            )}

            { phytoProductList.map(d => {
              return (
                <TouchableOpacity key={d.id} style={styles.elemContainer} onPress={() => {
                  let i = d.id
                  handleClick(i)
                }}>
                  <Text style={[styles.elemText, { fontWeight: selected.indexOf(d.id) > -1 ? 'bold' : 'normal'} ]}>{i18n.t(`products.${d.name}`)}</Text>
                  { selected.indexOf(d.id) > -1 && (
                    <Icon name="check" type="AntDesign" style={[styles.elemIcon, { color: selected.indexOf(d.id) > -1 ? COLORS.DARK_GREEN : COLORS.GREY } ]} />
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
      </Content>
      </Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.BEIGE,
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
    fontSize: 20,
    color: COLORS.DARK_GREEN
  },  
  statusbar: {
    display: 'flex',
    backgroundColor: COLORS.BEIGE,
    flex: 1,
  },
  elemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  elemText: {
    fontFamily: 'nunito-regular',
    fontSize: 16,
    color: COLORS.DARK_GREEN,
    flex: 1,
  },
  elemIcon: {
    fontSize: 20,
    color: COLORS.GREY
  },
  content: {
    flex: 1,
    display: 'flex',
    backgroundColor: COLORS.BEIGE,
  }
})

const mapStateToProps = (state) => ({
  phytoProductList: state.pulve.phytoProductList,
  phytoProductSelected: state.pulve.phytoProductSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
  updatePhytoProductSelected: (selected) => dispatch(updatePhytoProductSelected(selected)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HygoProductPicker);