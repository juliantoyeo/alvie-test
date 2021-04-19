import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput
} from "react-native";
import hygoStyles from '../../styles';
import COLORS from  '../../colors';
import HygoButton from '../../components/v2/HygoButton';

const regex = new RegExp("^[0-9]*[0-9\.,]?[0-9]*$")
const HygoModal = ({modalVisible, setModalVisible,title}) => {

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
        >
            <View style={[styles.backdrop, StyleSheet.absoluteFill]}/>
            <View style={{justifyContent: "center", flex:1}}>
              <View style={styles.modalView}>
                  <View style={styles.title}>
                    <Text style={hygoStyles.h0}>{title}</Text>
                  </View>
                    <HygoButton
                      label='OK'
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}
                    />
              </View>
            </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "center",
        //alignItems: "center",
        // marginTop: 22,
        backgroundColor: "black",
        opacity: 0.5
      },
      modalView: {
        //margin: 20,
        backgroundColor: "white",
        borderTopRightRadius: 20,
        // padding: 35,
        //alignItems: "center",
        shadowOffset: { width: 0, height: 2},
        shadowColor: '#000000',
        shadowRadius: 2,
        shadowOpacity: .2,
        elevation: 5,
        },
      title: {
        borderColor: '#D1CFCF',
        borderBottomWidth: 1,
        alignItems:'center'
      },
      button: {
        height: 60,
        // width: 100,
        backgroundColor: COLORS.DARK_BLUE,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'nunito-bold',
      }
  });

export default HygoModal
