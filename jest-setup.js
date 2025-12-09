// Jest setup file

// Mock Expo runtime globals
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
};
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: 'Screen',
  },
  Link: 'Link',
}));

// Mock expo-linking
jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  parseURL: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo modules
jest.mock('expo-constants', () => ({
  expoConfig: {},
}));

jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: jest.fn(),
}));

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
  const actual = jest.requireActual('react-native/Libraries/Utilities/Dimensions');
  return {
    ...actual,
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  };
});

// Global setup
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
