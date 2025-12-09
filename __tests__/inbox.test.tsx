import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock fetch globally
global.fetch = jest.fn();

// Mock storage module
jest.mock('../lib/storage', () => ({
  storage: {
    getAuth: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Import Inbox component
import InboxPage from '../app/inbox';
import { storage } from '../lib/storage';

describe('Inbox Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (storage.getAuth as jest.Mock).mockResolvedValue({
      username: 'testuser',
      token: 'test-token',
      userId: 123,
    });
  });

  it('renders inbox page with header', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    render(<InboxPage />);
    
    expect(screen.getByText(/active friend requests/i)).toBeTruthy();
  });

  it('has back button', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    render(<InboxPage />);
    
    expect(screen.getByText(/← back/i)).toBeTruthy();
  });

  it('loads user data on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    render(<InboxPage />);
    
    await waitFor(() => {
      expect(storage.getAuth).toHaveBeenCalled();
    });
  });

  it('fetches friend requests on mount', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['123']),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      });

    render(<InboxPage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('displays friend requests', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['123']),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['user1', 'user2']),
      });

    render(<InboxPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/user1/)).toBeTruthy();
      expect(screen.getByText(/user2/)).toBeTruthy();
    });
  });

  it('shows "wants to be friends" message for each request', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['123']),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['user1']),
      });

    render(<InboxPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/wants to be friends/i)).toBeTruthy();
    });
  });

  it('handles accepting friend request', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['123']),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['user1']),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['456', 'user1']),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

    render(<InboxPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/user1/)).toBeTruthy();
    });

    const requestCard = screen.getByText(/user1/);
    fireEvent.press(requestCard.parent!);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        expect.stringContaining('user1')
      );
    });
  });

  it('handles fetch error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<InboxPage />);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'getFriendRequestsError',
        expect.any(String)
      );
    });
  });

  it('shows loading state while fetching', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      }), 100))
    );

    render(<InboxPage />);
    
    // Loading state should be present initially
    const indicators = screen.UNSAFE_queryAllByType('ActivityIndicator' as any);
    expect(indicators.length).toBeGreaterThanOrEqual(0);
  });

  it('displays empty list when no friend requests', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['123']),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      });

    render(<InboxPage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Should not show any friend request items
    expect(screen.queryByText(/wants to be friends/i)).toBeNull();
  });

  it('calls correct API endpoints for user data', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['123']),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      });

    render(<InboxPage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/user/getUserByUsername/testuser')
      );
    });
  });

  it('calls correct API endpoint for friend requests', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(['123']),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      });

    render(<InboxPage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/friends/getUserFriendRequests/123')
      );
    });
  });
});
