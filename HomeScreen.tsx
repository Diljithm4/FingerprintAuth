
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, AppState, AppStateStatus, BackHandler } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { Appbar, Menu, Provider } from 'react-native-paper';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  FingerprintLock: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const initialTime = (60 * 60) * 24;

  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const isFocused = useIsFocused();
  const route = useRoute();

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      } else {
        clearInterval(interval);
        Alert.alert('Session expired!');
        navigation.navigate('Login');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, navigation]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const appState = useRef<AppStateStatus>(AppState.currentState);
  const backgroundTimeRef = useRef<number | null>(null);
  const [isMenuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => {
      return true; // Return true to prevent default back button behavior
    }
  );

  //return () => backHandler.remove();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current === 'active' &&
        nextAppState === 'background'
      ) {
        backgroundTimeRef.current = Date.now();
      } else if (
        appState.current === 'background' &&
        nextAppState === 'active'
      ) {
        if (backgroundTimeRef.current) {
          const backgroundDuration = moment().diff(
            moment(backgroundTimeRef.current),
            'seconds'
          );
          const currentScreenName = route.name;
          if (currentScreenName !== 'Login') {
            if (backgroundDuration > 900 && backgroundDuration < 86400) {
              navigation.navigate('FingerprintLock');
            } else if (backgroundDuration >= 86400) {
              navigation.navigate('Login');
            }
          }
          backgroundTimeRef.current = null;
        }
      }

      appState.current = nextAppState;
    };

    AppState.addEventListener('change', handleAppStateChange);

  }, [navigation, route]);

  return (
    <Provider>
      <View style={styles.container}>
        <Appbar.Header style={styles.transparentHeader}>
          <Appbar.Content title="" />
          <Menu
            visible={isMenuVisible}
            onDismiss={closeMenu}
            anchor={<Appbar.Action icon="dots-vertical" color="white" onPress={openMenu} />}
          >
            <Menu.Item onPress={handleLogout} title="Logout" />
          </Menu>
        </Appbar.Header>
        <View style={styles.contentContainer}>
          <Text style={styles.message}>Session will expire in</Text>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db', // Background color for the entire screen
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white', // Text color for the timer
  },
  message: {
    fontSize: 20,
    color: 'white', // Text color for the message
  },
  transparentHeader: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default HomeScreen;
