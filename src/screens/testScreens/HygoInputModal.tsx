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

const HygoInputModal = ({onClose, modalVisible, setModalVisible, defaultValue, setInput}) => {
    const [value, setValue] = useState<any>(defaultValue)
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>Hello World!</Text>
                    <TextInput 
                      onChangeText={text => setValue(text)}
                      value={value}
                    />
                    <TouchableHighlight
                    onPress={() => {
                        setInput(value)
                        setModalVisible(!modalVisible);
                    }}
                    >
                    <Text>Hide Modal</Text>
                    </TouchableHighlight>
                </View>
            </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
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

export default HygoInputModal
