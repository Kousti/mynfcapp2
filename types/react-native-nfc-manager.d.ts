import { NativeEventEmitter } from 'react-native';
import NfcManager from 'react-native-nfc-manager';

declare module 'react-native-nfc-manager' {
  interface NfcManager {
    start(): Promise<boolean>;
    requestTechnology(tech: string): Promise<any>;
    getTag(): Promise<any>;
    cancelTechnologyRequest(): Promise<void>;
    getIsoDepHandlerAndroid(): {
      transceive(data: number[]): Promise<number[]>;
    };
  }

  const NfcManager: NfcManager;
  export default NfcManager;
} 