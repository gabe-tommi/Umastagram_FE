import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Mock fetch globally
global.fetch = jest.fn();

// Mock storage module
jest.mock('../lib/storage', () => ({
  storage: {
    getAuth: jest.fn(),
    saveAuth: jest.fn().mockResolvedValue(undefined),
    clearAuth: jest.fn().mockResolvedValue(undefined),
  },
}));

// Import Account component
import AccountPage from '../app/tabs/account';
import { storage } from '../lib/storage';

describe('Account Tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (storage.getAuth as jest.Mock).mockResolvedValue({
      username: 'testuser',
      token: 'test-token',
      userId: 123,
      email: 'test@example.com',
    });
  });

  it('renders account page with username', async () => {
    render(<AccountPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/testuser/i)).toBeTruthy();
    });
  });

  it('loads user data on mount', async () => {
    render(<AccountPage />);
    
    await waitFor(() => {
      expect(storage.getAuth).toHaveBeenCalled();
    });
  });

  it('has sign out button', async () => {
    render(<AccountPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/sign out/i)).toBeTruthy();
    });
  });

  it('has change username button', async () => {
    render(<AccountPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/change username/i)).toBeTruthy();
    });
  });

  it('has delete account button', async () => {
    render(<AccountPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/delete account/i)).toBeTruthy();
    });
  });

  it('opens username change modal when change username is pressed', async () => {
    render(<AccountPage />);
    
    await waitFor(() => {
      const changeButton = screen.getByText(/change username/i);
      fireEvent.press(changeButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/enter your new username below/i)).toBeTruthy();
    });
  });

  it('opens delete confirmation modal when delete account is pressed', async () => {
    render(<AccountPage />);
    
    await waitFor(() => {
      const deleteButton = screen.getByText(/delete account/i);
      fireEvent.press(deleteButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeTruthy();
    });
  });

  it('handles successful username change', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        username: 'newusername',
      }),
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<AccountPage />);
    
    await waitFor(() => {
      const changeButton = screen.getByText(/change username/i);
      fireEvent.press(changeButton);
    });
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/enter your username/i);
      fireEvent.changeText(input, 'newusername');
    });
    
    const confirmButton = screen.getByText('OK');
    fireEvent.press(confirmButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://beuma-64bbab9df83e.herokuapp.com/user/username/change',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('handles account deletion', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        message: 'Account deleted',
      }),
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<AccountPage />);
    
    await waitFor(() => {
      const deleteButton = screen.getByText(/delete account/i);
      fireEvent.press(deleteButton);
    });
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText(/delete/i);
      // Press the 'Delete' button in the modal (not the 'Delete Account' button)
      const modalDeleteButton = deleteButtons.find(btn => btn.children && btn.children[0] === 'Delete');
      if (modalDeleteButton) {
        fireEvent.press(modalDeleteButton);
      } else {
        // Fallback: press the last delete button
        fireEvent.press(deleteButtons[deleteButtons.length - 1]);
      }
    });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://beuma-64bbab9df83e.herokuapp.com/user/delete',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(storage.clearAuth).toHaveBeenCalled();
    });
  });
});
