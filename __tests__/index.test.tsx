import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Mock fetch globally
global.fetch = jest.fn();

// Mock storage module
jest.mock('../lib/storage', () => ({
  storage: {
    saveAuth: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock expo-linking to avoid import issues
jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
}));

// Import the Index component
import Index from '../app/index';

describe('Login Component (Index)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders login form with username and password inputs', () => {
    render(<Index />);
    
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('shows error modal when fields are empty and login is pressed', async () => {
    render(<Index />);
    
    const loginButton = screen.getByText('Login');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('Please enter both username and password')).toBeTruthy();
    });
  });

  it('allows user to type in username field', () => {
    render(<Index />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.changeText(usernameInput, 'testuser');
    
    expect(usernameInput.props.value).toBe('testuser');
  });

  it('allows user to type in password field', () => {
    render(<Index />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.changeText(passwordInput, 'password123');
    
    expect(passwordInput.props.value).toBe('password123');
  });

  it('password input is secure', () => {
    render(<Index />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('has a signup button', () => {
    render(<Index />);
    
    const signupButton = screen.getByText("Don't have an account? Signup!");
    expect(signupButton).toBeTruthy();
  });

  it('closes modal when OK button is pressed', async () => {
    render(<Index />);
    
    const loginButton = screen.getByText('Login');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
    });
    
    const okButton = screen.getByText('OK');
    fireEvent.press(okButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Error')).toBeNull();
    });
  });

  it('makes API call when both fields are filled', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        token: 'test-token',
        userId: '123',
        username: 'testuser',
        email: 'test@example.com',
        message: 'Login successful'
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<Index />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    
    const loginButton = screen.getByText('Login');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://beuma-64bbab9df83e.herokuapp.com/user/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'testuser', password: 'password123' }),
        })
      );
    });
  });

  it('shows error modal when API returns error', async () => {
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: 'Invalid credentials'
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<Index />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    
    const loginButton = screen.getByText('Login');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Login Failed')).toBeTruthy();
      expect(screen.getByText('Invalid credentials')).toBeTruthy();
    });
  });

  it('shows generic error when API call fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<Index />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    
    const loginButton = screen.getByText('Login');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('An error occurred during login. Please try again.')).toBeTruthy();
    });
  });
});
