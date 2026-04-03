import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/index';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation';

function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
              <AppNavigator />
            </View>
          </TouchableWithoutFeedback>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
