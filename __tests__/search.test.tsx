import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Mock fetch globally
global.fetch = jest.fn();

// Mock storage module
jest.mock('../lib/storage', () => ({
  storage: {
    getAuth: jest.fn(),
  },
}));

// Import Search component
import SearchPage from '../app/tabs/search';
import { storage } from '../lib/storage';

describe('Search Tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (storage.getAuth as jest.Mock).mockResolvedValue({
      username: 'testuser',
      token: 'test-token',
      userId: 123,
    });
  });

  it('renders search page with title', () => {
    render(<SearchPage />);
    
    expect(screen.getByText(/search users/i)).toBeTruthy();
  });

  it('has search input field', () => {
    render(<SearchPage />);
    
    expect(screen.getByPlaceholderText(/search for users/i)).toBeTruthy();
  });

  it('has search button', () => {
    render(<SearchPage />);
    
    const searchTexts = screen.getAllByText(/search/i);
    expect(searchTexts.length).toBeGreaterThan(0);
  });

  it('allows user to type in search field', () => {
    render(<SearchPage />);
    
    const searchInput = screen.getByPlaceholderText(/search for users/i);
    fireEvent.changeText(searchInput, 'friend');
    
    expect(searchInput.props.value).toBe('friend');
  });

  it('performs search when search button is pressed', async () => {
    const mockResults = ['user1', 'user2', 'user3'];
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResults),
    });

    render(<SearchPage />);
    
    const searchInput = screen.getByPlaceholderText(/search for users/i);
    fireEvent.changeText(searchInput, 'user');
    
    // Submit the search (fires onSubmitEditing)
    fireEvent(searchInput, 'submitEditing');
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/user/userSearch/user')
      );
    });
  });

  it('displays search results', async () => {
    const mockResults = ['user1', 'user2', 'user3'];
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResults),
    });

    render(<SearchPage />);
    
    const searchInput = screen.getByPlaceholderText(/search for users/i);
    fireEvent.changeText(searchInput, 'user');
    
    fireEvent(searchInput, 'submitEditing');
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeTruthy();
      expect(screen.getByText('user2')).toBeTruthy();
      expect(screen.getByText('user3')).toBeTruthy();
    });
  });

  it('filters out current user from results', async () => {
    const mockResults = ['testuser', 'user1', 'user2'];
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResults),
    });

    render(<SearchPage />);
    
    await waitFor(() => {
      expect(storage.getAuth).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(/search for users/i);
    fireEvent.changeText(searchInput, 'user');
    
    fireEvent(searchInput, 'submitEditing');
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeTruthy();
      expect(screen.getByText('user2')).toBeTruthy();
      expect(screen.queryByText('testuser')).toBeNull();
    });
  });

  it('shows empty results when no users found', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    render(<SearchPage />);
    
    const searchInput = screen.getByPlaceholderText(/search for users/i);
    fireEvent.changeText(searchInput, 'nonexistent');
    
    fireEvent(searchInput, 'submitEditing');
    
    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeTruthy();
    });
  });

  it('does not search when query is empty', async () => {
    render(<SearchPage />);
    
    const searchInput = screen.getByPlaceholderText(/search for users/i);
    fireEvent(searchInput, 'submitEditing');
    
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('has back button', () => {
    render(<SearchPage />);
    
    expect(screen.getByText(/← back/i)).toBeTruthy();
  });
});
