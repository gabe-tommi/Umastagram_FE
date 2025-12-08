import '@testing-library/jest-native/extend-expect';

// Mock Animated API
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

// Mock storage
jest.mock('../lib/storage', () => ({
  storage: {
    getAuth: jest.fn().mockResolvedValue(null),
    saveAuth: jest.fn(),
    clearAuth: jest.fn(),
  },
}));

// Suppress console warnings in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
