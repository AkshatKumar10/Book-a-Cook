import './global.css';
import AppNavigation from './navigation/appNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppNavigation />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
