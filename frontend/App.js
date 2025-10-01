import './global.css';
import AppNavigation from './navigation/appNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarkProvider } from './context/BookmarkContext';

export default function App() {
  return (
    <BookmarkProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppNavigation />
        </SafeAreaProvider>
      </ThemeProvider>
    </BookmarkProvider>
  );
}
