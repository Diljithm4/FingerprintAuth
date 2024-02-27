// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
// import TouchID from 'react-native-touch-id';
// import { StackNavigationProp } from '@react-navigation/stack';

// type RootStackParamList = {
//   Login: undefined;
//   Home: undefined;
// };

// type FingerprintLockScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// interface Props {
//   navigation: FingerprintLockScreenNavigationProp;
// }

// const FingerprintLockScreen: React.FC<Props> = ({ navigation }) => {
//   const [isFingerprintAvailable, setIsFingerprintAvailable] = useState<boolean>(false);
//   const [isFingerprintScanning, setIsFingerprintScanning] = useState<boolean>(false);
//   const [enteredCode, setEnteredCode] = useState<string>('');
//   const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

//   useEffect(() => {
//     TouchID.isSupported()
//       .then(() => {
//         setIsFingerprintAvailable(true);
//       })
//       .catch((error) => {
//         console.log('Fingerprint not supported:', error);
//         setIsFingerprintAvailable(false);
//       });

//     return () => {
//       // Cleanup if needed
//     };
//   }, []);

//   const handleFingerprintAuth = () => {
//     if (isFingerprintAvailable) {
//       setIsFingerprintScanning(true);
//       TouchID.authenticate('Authenticate with Fingerprint')
//         .then((biometricType: string | undefined) => {
//           console.log('Biometric Type:', biometricType);
          
//           if (biometricType) {
//             console.log('Fingerprint authentication successful');
//             navigation.navigate('Home');
//           } else {
//             console.log('Fingerprint authentication failed');
//           }
//         })
//         .catch((error: Error) => {
//           console.log('Fingerprint authentication error:', error);
//         })
//         .finally(() => {
//           setIsFingerprintScanning(false);
//         });
//     }
//   };

//   const handleCodeSubmit = () => {
//     const correctCode = '123456';

//     if (enteredCode === correctCode) {
//       navigation.navigate('Home');
//     } else {
//       setRemainingAttempts(remainingAttempts - 1);

//       if (remainingAttempts > 0) {
//         console.log(`Incorrect code. ${remainingAttempts} attempts remaining.`);
//         setEnteredCode('');
//       } else {
//         navigation.navigate('Login');
//       }
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       {isFingerprintAvailable ? (
//         <TouchableOpacity onPress={handleFingerprintAuth}>
//           <View style={{ padding: 20, backgroundColor: 'blue', borderRadius: 10 }}>
//             <Text style={{ color: 'white' }}>Use fingerprint to unlock</Text>
//           </View>
//         </TouchableOpacity>
//       ) : (
//         <View>
//           <Text>Touch ID authentication not available on this device.</Text>
//           <Text>Enter six-digit code:</Text>
//           <TextInput
//             secureTextEntry
//             keyboardType="numeric"
//             value={enteredCode}
//             onChangeText={(text) => setEnteredCode(text)}
//           />
//           <Button title="Submit" onPress={handleCodeSubmit} />
//         </View>
//       )}

//       {isFingerprintScanning && <Text>Scanning fingerprint...</Text>}
//     </View>
//   );
// };

// export default FingerprintLockScreen;


import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import TouchID from 'react-native-touch-id';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type FingerprintLockScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: FingerprintLockScreenNavigationProp;
}

const FingerprintLockScreen: React.FC<Props> = ({ navigation }) => {
  const [isFingerprintAvailable, setIsFingerprintAvailable] = useState<boolean>(false);
  const [isFingerprintScanning, setIsFingerprintScanning] = useState<boolean>(false);
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

  useEffect(() => {
    TouchID.isSupported()
      .then(() => {
        setIsFingerprintAvailable(true);
      })
      .catch((error) => {
        console.log('Fingerprint not supported:', error);
        setIsFingerprintAvailable(false);
      });

    return () => {
      // Cleanup if needed
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleFingerprintAuth = () => {
    if (isFingerprintAvailable) {
      setIsFingerprintScanning(true);
      TouchID.authenticate('Authenticate with Fingerprint')
        .then((biometricType: string | undefined) => {
          console.log('Biometric Type:', biometricType);

          if (biometricType) {
            console.log('Fingerprint authentication successful');
            navigation.navigate('Home');
          } else {
            console.log('Fingerprint authentication failed');
          }
        })
        .catch((error: Error) => {
          console.log('Fingerprint authentication error:', error);
        })
        .finally(() => {
          setIsFingerprintScanning(false);
        });
    }
    else {
      handleCodeSubmit();
    }
  };

  const handleCodeSubmit = () => {
    const correctCode = '123456';

    if (enteredCode === correctCode) {
      navigation.navigate('Home');
    } else {
      setRemainingAttempts(remainingAttempts - 1);

      if (remainingAttempts > 0) {
        console.log(`Incorrect code. ${remainingAttempts} attempts remaining.`);
        setEnteredCode('');
      } else {
        navigation.navigate('Login');
      }
    }
  };

  return (
    <View style={styles.container}>
      {isFingerprintAvailable ? (
        <TouchableOpacity onPress={handleFingerprintAuth}>
          <View style={styles.fingerprintButton}>
            <Text style={styles.buttonText}>Use fingerprint to unlock</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.codeContainer}>
          <Text style={styles.infoText}>Touch ID authentication not available on this device.</Text>
          <Text style={styles.infoText}>Enter six-digit code:</Text>
          <TextInput
            style={styles.codeInput}
            secureTextEntry
            keyboardType="numeric"
            value={enteredCode}
            onChangeText={(text) => setEnteredCode(text)}
          />
          <Button title="Submit" onPress={handleCodeSubmit} />
        </View>
      )}

      {isFingerprintScanning && <Text style={styles.scanningText}>Scanning fingerprint...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
  fingerprintButton: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold'
  },
  codeContainer: {
    alignItems: 'center',
  },
  infoText: {
    marginBottom: 10,
    color: 'white',
  },
  codeInput: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: 'black',
  },
  scanningText: {
    marginTop: 10,
    color: 'white',
  },
});

export default FingerprintLockScreen;
