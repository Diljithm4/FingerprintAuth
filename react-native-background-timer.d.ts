// declare module 'react-native-background-timer' {
//     const BackgroundTimer: {
//       setInterval: (callback: () => void, delay: number) => number;
//       clearInterval: (intervalId: number) => void;
//       setTimeout: (callback: () => void, delay: number) => number;
//       clearTimeout: (timeoutId: number) => void;
//       runBackgroundTimer: (callback: () => void, delay: number) => void;
//       stopBackgroundTimer: () => void;
//     };
  
//     export default BackgroundTimer;
//   }
  
declare module 'react-native-background-timer' {
    const BackgroundTimer: {
      setInterval: (callback: () => void, delay: number) => number;
      clearInterval: (intervalId: number) => void;
      setTimeout: (callback: () => void, delay: number) => number;
      clearTimeout: (timeoutId: number) => void;
      runBackgroundTimer: (callback: () => void, delay: number) => void;
      stopBackgroundTimer: () => void;
    };
  
    export = BackgroundTimer;
  }
  