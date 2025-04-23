import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

// Pre-step, call this before any NFC operations
NfcManager.start();

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [tagInfo, setTagInfo] = useState<string | null>(null);

  async function readNdef() {
    try {
      setIsScanning(true);
      setTagInfo('Scanning for NFC tag...');
      
      // Request Ndef technology
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      // Get the tag
      const tag = await NfcManager.getTag();
      console.warn('Tag found:', tag);

      if (tag && tag.ndefMessage) {
        // Process NDEF message
        const ndefMessage = tag.ndefMessage[0];
        console.log('NDEF Message:', ndefMessage);
        const payload = new Uint8Array(ndefMessage.payload);
        console.log('Raw Payload:', Array.from(payload).map(byte => byte.toString(16).padStart(2, '0')).join(' '));
        const payloadString = Ndef.text.decodePayload(payload);
        console.log('Decoded Payload:', payloadString);
        
        setTagInfo(`Tag ID: ${tag.id}\nType: ${tag.type}\nPayload: ${payloadString}`);
      } else {
        setTagInfo(`Tag ID: ${tag?.id}\nType: ${tag?.type}\nNo NDEF data found`);
      }
      
    } catch (ex) {
      console.warn('Oops!', ex);
      setTagInfo('Error scanning tag. Please try again.');
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
      setIsScanning(false);
    }
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={[styles.button, isScanning && styles.buttonScanning]} 
        onPress={readNdef}
        disabled={isScanning}
      >
        {isScanning ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Scan Tag</Text>
        )}
      </TouchableOpacity>
      
      {tagInfo && (
        <View style={styles.tagInfoContainer}>
          <Text style={styles.tagInfoText}>{tagInfo}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonScanning: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagInfoContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  tagInfoText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
});

export default App;