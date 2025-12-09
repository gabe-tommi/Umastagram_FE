import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Simple component for testing
const SimpleComponent = () => (
  <View>
    <Text>Hello World</Text>
  </View>
);

describe('Simple Test Suite', () => {
  it('renders a simple component', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('performs basic arithmetic', () => {
    expect(1 + 1).toBe(2);
  });

  it('checks array includes item', () => {
    const arr = ['apple', 'banana', 'orange'];
    expect(arr).toContain('banana');
  });
});
