import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import PuzzleUi from './src/screens/PuzzleUI';
const App = () => {
  return (
    <SafeAreaView style={{flex:1}}>
    <PuzzleUi />
    </SafeAreaView>
  );
};
export default App;