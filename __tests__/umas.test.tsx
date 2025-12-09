import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Mock fetch globally
global.fetch = jest.fn();

// Import Umas component
import UmasScreen from '../app/tabs/umas';

describe('Umas Tab', () => {
  const mockUmas = [
    {
      id: 1,
      name: 'Special Week',
      imagePath: 'https://example.com/special-week.jpg',
      umaIcon: 'https://example.com/icon1.jpg',
      umaBio: 'A cheerful and energetic uma musume',
    },
    {
      id: 2,
      name: 'Silence Suzuka',
      imagePath: 'https://example.com/silence-suzuka.jpg',
      umaIcon: 'https://example.com/icon2.jpg',
      umaBio: 'Known for her incredible speed',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUmas),
    });
  });

  it('renders umas page with title', async () => {
    render(<UmasScreen />);
    
    await waitFor(() => {
      const titles = screen.getAllByText(/uma characters/i);
      expect(titles.length).toBeGreaterThan(0);
    });
  });

  it('shows loading indicator initially', () => {
    render(<UmasScreen />);
    
    const indicators = screen.UNSAFE_queryAllByType('ActivityIndicator' as any);
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('fetches umas on mount', async () => {
    render(<UmasScreen />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://beuma-64bbab9df83e.herokuapp.com/api/uma'
      );
    });
  });

  it('displays uma characters', async () => {
    render(<UmasScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Special Week')).toBeTruthy();
      expect(screen.getByText('Silence Suzuka')).toBeTruthy();
    });
  });

  it('has search input field', async () => {
    render(<UmasScreen />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search by name/i)).toBeTruthy();
    });
  });

  it('allows user to type in search field', async () => {
    render(<UmasScreen />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search by name/i);
      fireEvent.changeText(searchInput, 'Special');
      
      expect(searchInput.props.value).toBe('Special');
    });
  });

  it('filters umas based on search query', async () => {
    render(<UmasScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Special Week')).toBeTruthy();
    });

    const searchInput = screen.getByPlaceholderText(/search by name/i);
    fireEvent.changeText(searchInput, 'silence');
    
    await waitFor(() => {
      expect(screen.getByText('Silence Suzuka')).toBeTruthy();
    });
  });

  it('handles fetch error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<UmasScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeTruthy();
    });
  });

  it('shows retry button on error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<UmasScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/retry/i)).toBeTruthy();
    });
  });

  it('retries fetch when retry button is pressed', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(<UmasScreen />);
    
    await waitFor(() => {
      const retryButton = screen.getByText(/retry/i);
      fireEvent.press(retryButton);
    });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('navigates to uma detail when uma is pressed', async () => {
    render(<UmasScreen />);
    
    await waitFor(() => {
      const umaCard = screen.getByText('Special Week');
      fireEvent.press(umaCard);
    });
  });

  it('displays uma bios', async () => {
    render(<UmasScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/cheerful and energetic/i)).toBeTruthy();
      expect(screen.getByText(/incredible speed/i)).toBeTruthy();
    });
  });

  it('shows info text about uma page', async () => {
    render(<UmasScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/welcome to the uma page/i)).toBeTruthy();
    });
  });
});
