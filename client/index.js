import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import { Assets as StackAssets } from '@react-navigation/stack';
import App from './App';

Asset.loadAsync(StackAssets);
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);