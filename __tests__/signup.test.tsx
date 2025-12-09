import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Mock fetch globally
global.fetch = jest.fn();

// Mock expo-linking to avoid import issues
jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
}));

// Import the Signup component
import Signup from '../app/signup';

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders signup form with all input fields', () => {
    render(<Signup />);
    
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Signup')).toBeTruthy();
  });

  it('shows error modal when fields are empty and signup is pressed', async () => {
    render(<Signup />);
    
    const signupButton = screen.getByText('Signup');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('Please fill in all fields')).toBeTruthy();
    });
  });

  it('allows user to type in email field', () => {
    render(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'test@example.com');
    
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('allows user to type in username field', () => {
    render(<Signup />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.changeText(usernameInput, 'testuser');
    
    expect(usernameInput.props.value).toBe('testuser');
  });

  it('allows user to type in password field', () => {
    render(<Signup />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.changeText(passwordInput, 'password123');
    
    expect(passwordInput.props.value).toBe('password123');
  });

  it('password input is secure', () => {
    render(<Signup />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('has a back to login button', () => {
    render(<Signup />);
    
    const backButton = screen.getByText('Back to login');
    expect(backButton).toBeTruthy();
  });

  it('closes modal when OK button is pressed', async () => {
    render(<Signup />);
    
    const signupButton = screen.getByText('Signup');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
    });
    
    const okButton = screen.getByText('OK');
    fireEvent.press(okButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Error')).toBeNull();
    });
  });

  it('makes API call when all fields are filled', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        userId: 123,
        username: 'testuser',
        email: 'test@example.com'
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    
    const signupButton = screen.getByText('Signup');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://beuma-64bbab9df83e.herokuapp.com/user/signup',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: 'testuser', 
            email: 'test@example.com',
            password: 'password123' 
          }),
        })
      );
    });
  });

  it('shows success modal when signup is successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        userId: 123,
        username: 'testuser',
        email: 'test@example.com'
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    
    const signupButton = screen.getByText('Signup');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Signup Successful!')).toBeTruthy();
      expect(screen.getByText('Welcome, testuser! You can now log in.')).toBeTruthy();
    });
  });

  it('shows error modal when API returns error', async () => {
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: 'Username already exists'
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(usernameInput, 'existinguser');
    fireEvent.changeText(passwordInput, 'password123');
    
    const signupButton = screen.getByText('Signup');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Signup Failed')).toBeTruthy();
      expect(screen.getByText('Username already exists')).toBeTruthy();
    });
  });

  it('shows network error when API call fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    
    const signupButton = screen.getByText('Signup');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('Network error. Please try again.')).toBeTruthy();
    });
  });

  it('shows error when only email is filled', async () => {
    render(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'test@example.com');
    
    const signupButton = screen.getByText('Signup');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('Please fill in all fields')).toBeTruthy();
    });
  });

  it('shows error when only username is filled', async () => {
    render(<Signup />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.changeText(usernameInput, 'testuser');
    
    const signupButton = screen.getByText('Signup');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('Please fill in all fields')).toBeTruthy();
    });
  });

  it('shows error when only password is filled', async () => {
    render(<Signup />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.changeText(passwordInput, 'password123');
    
    const signupButton = screen.getByText('Signup');
    fireEvent.press(signupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('Please fill in all fields')).toBeTruthy();
    });
  });
});
