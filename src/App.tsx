/* eslint-disable react-native/no-inline-styles */
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ScreenWrapper from './components/layout/ScreenWrapper';
// import GlobalBottomSheet from './components/reusable/GlobalBottomSheet/GlobalBottomSheet';
// import GlobalModal from './components/reusable/GlobalModal/GlobalModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GlobalModal from './components/reusable/GlobalModal/GlobalModal';
import GlobalBottomSheet from './components/reusable/GlobalBottomSheet/GlobalBottomSheet';
import { NavigationContainer } from '@react-navigation/native';
import { NotificationManager } from './components/NotificationManager';
import { DevResetPanel } from './components/dev/DevResetPanel';
import ZoomProvider from './providers/ZoomProvider';
// import { DevResetPanel } from './components/dev/DevResetPanel';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'#EDDEAD'}
      />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <SafeAreaProvider> */}
        <ZoomProvider>
          <NavigationContainer>
            <NotificationManager />
            <ScreenWrapper>
              <RootNavigator />
            </ScreenWrapper>
            <GlobalBottomSheet />
            <GlobalModal />
            {/* <DevResetPanel/>  */}
          </NavigationContainer>
        </ZoomProvider>
        {/* </SafeAreaProvider> */}
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
