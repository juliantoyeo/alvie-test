import React, { useState } from 'react'
import { StyleSheet, StatusBar, ScrollView, View, Text , TouchableOpacity} from 'react-native'

import { SafeAreaView } from 'react-navigation'

import { Header, Left, Body, Title, Right, Icon, Button, Container, Content } from 'native-base'

import COLORS from '../colors'

import i18n from 'i18n-js'

import { connect } from 'react-redux'
import { updateCulturesSelected } from '../store/actions/pulveActions'

import { updateUICultures } from '../api/hygoApi'

const HygoCulturePicker = ({ navigation, cultures, culturesSelected, updateCulturesSelected }) => {
  return (
    <SafeAreaView style={[styles.statusbar]} forceInset={{top:'always'}}>
      <StatusBar translucent backgroundColor="transparent" />
      <Container style={styles.content}>
        <Header hasTabs style={[styles.header]} androidStatusBarColor={COLORS.BEIGE} iosBarStyle="light-content">
          <Left style={{ flex: 1 }}>
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
            { cultures.map(d => {
              return (
                <TouchableOpacity key={d.id} style={styles.elemContainer} onPress={() => {
                  let i = d.id
                  
                  let p = JSON.parse(JSON.stringify(culturesSelected))
                  if (culturesSelected.indexOf(i) > -1) {
                    updateCulturesSelected(p.filter(e => e !== i))
                  } else {
                    p.push(i)

                    updateUICultures(p)
                    updateCulturesSelected(p)
                  }
                }}>
                  <Text style={styles.elemText}>{d.name}</Text>
                  { culturesSelected.indexOf(d.id) > -1 && (
                    <Icon name="check" type="AntDesign" style={styles.elemIcon} />
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
  cultures: state.metadata.cultures,
  culturesSelected: state.pulve.culturesSelected,
});

const mapDispatchToProps = (dispatch, props) => ({
  updateCulturesSelected: (selected) => dispatch(updateCulturesSelected(selected)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HygoCulturePicker);