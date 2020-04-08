import React from 'react';
import { Icon, Picker } from 'native-base'
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import {updatePhyto} from '../store/actions/pulveActions';

import i18n from 'i18n-js'

const HygoProductList = ({ phytoProductList, updatePhyto, produitPhytoClicked, onProductChange }) => {
  const buildList = () => {
    let l = phytoProductList.map(p => {
      return (
        <Picker.Item key={p.id} label={p.name} value={p.name} />
      )
    })

    if (Platform.OS === 'android') {
      l.unshift(<Picker.Item key={0} label={i18n.t('phyto.no_phyto')} value={null} />)
    }

    return l
  }

  const update = async (value) => {
    updatePhyto(value)
    onProductChange(value)
  }

  return (
    <Picker
      mode="dropdown"
      iosIcon={<Icon name="arrow-down" />}
      placeholder={i18n.t('phyto.no_phyto')}
      itemTextStyle={{
        flex: 1,
        color: '#aaa',
        fontSize: 16,
        fontFamily: 'nunito-regular',
      }}
      note={false}
      placeholderStyle={{ color: "#194769" }}
      headerBackButtonText ='retour'
      placeholderIconColor="59DFD6"
      selectedValue={produitPhytoClicked}
      onValueChange={(v) => update(v)}>
      { buildList() }
    </Picker>
  )
}

const mapStateToProps = (state) => ({
  phytoProductList : state.pulve.phytoProductList,
  produitPhytoClicked : state.pulve.produitPhytoClicked,
});

const mapDispatchToProps = (dispatch, props) => ({
  updatePhyto: (produitPhytoClicked) => dispatch(updatePhyto(produitPhytoClicked)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HygoProductList);
