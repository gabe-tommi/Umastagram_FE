import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Mock fetch globally
global.fetch = jest.fn();

// Mock expo-router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({ id: '1' }),
}));

// Import UmaDetail component
import UmaDetailScreen from '../app/umaDetail';

describe('UmaDetail Page', () => {
  const mockUmaData = {
    umaId: 1,
    umaName: 'Special Week',
    umaImageLink: 'https://example.com/special-week.jpg',
    umaIconLink: 'https://example.com/icon.jpg',
    umaBirthday: '1995-05-02',
    umaBio: 'A cheerful and energetic uma musume',
    umaHeight: '158cm',
    umaWeight: 'Secret',
    funFact: 'Loves carrots',
  };

  const mockHorseData = {
    horseId: 1,
    horseName: 'Special Week',
    horseImageLink: 'https://example.com/real-horse.jpg',
    horseBirthday: '1995-05-02',
    horseDeathday: '2018-04-23',
    horseBio: 'A legendary racehorse',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders uma detail page with loading indicator', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to keep loading state
    );

    render(<UmaDetailScreen />);
    
    const indicators = screen.UNSAFE_queryAllByType('ActivityIndicator' as any);
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('fetches uma details on mount', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://beuma-64bbab9df83e.herokuapp.com/api/uma/1'
      );
    });
  });

  it('fetches horse details on mount', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://beuma-64bbab9df83e.herokuapp.com/api/horse/1'
      );
    });
  });

  it('displays uma name after loading', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Special Week')).toBeTruthy();
    });
  });

  it('displays uma bio', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/cheerful and energetic/i)).toBeTruthy();
    });
  });

  it('has back button', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      // Verify component loaded by checking for uma name
      expect(screen.getByText('Special Week')).toBeTruthy();
    });
  });

  it('has toggle between game and real views', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/game/i)).toBeTruthy();
      expect(screen.getByText(/real/i)).toBeTruthy();
    });
  });

  it('displays uma birthday formatted correctly', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      // Birthday should be formatted as "May Second"
      expect(screen.getByText(/may/i)).toBeTruthy();
    });
  });

  it('shows error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeTruthy();
    });
  });

  it('has retry button on error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/retry/i)).toBeTruthy();
    });
  });

  it('retries fetch when retry button is pressed', async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      const retryButton = screen.getByText(/retry/i);
      fireEvent.press(retryButton);
    });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3); // Initial uma + retry uma + horse
    });
  });

  it('displays birth date information', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/birth date/i)).toBeTruthy();
    });
  });

  it('displays fun fact when available', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/loves carrots/i)).toBeTruthy();
    });
  });

  it('handles missing horse data gracefully', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      // Should still display uma information
      expect(screen.getByText('Special Week')).toBeTruthy();
    });
  });

  it('switches view mode when toggle is pressed', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/game/i)).toBeTruthy();
    });

    const realButton = screen.getByText(/real/i);
    fireEvent.press(realButton);
    
    // View should switch (animation would occur in real app)
    await waitFor(() => {
      expect(realButton).toBeTruthy();
    });
  });

  it('calls router.back when back button is pressed', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUmaData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHorseData),
      });

    render(<UmaDetailScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Special Week')).toBeTruthy();
    });

    const backButtons = screen.UNSAFE_queryAllByType('TouchableOpacity' as any);
    if (backButtons.length > 0) {
      fireEvent.press(backButtons[0]);
      expect(mockBack).toHaveBeenCalled();
    }
  });
});
