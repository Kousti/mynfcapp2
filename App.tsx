import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

// Pre-step, call this before any NFC operations
NfcManager.start();

function App() {
  async function readNdef() {
    try {
      // Request ISO-DEP technology for NTAG 424
      await NfcManager.requestTechnology(NfcTech.IsoDep);
      
      // Get the tag
      const tag = await NfcManager.getTag();
      console.warn('Tag found:', tag);
      
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={readNdef}>
        <Text>Scan Tag</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;