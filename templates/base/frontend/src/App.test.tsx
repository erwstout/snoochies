import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./utils/getApiBase', () => ({
  getApiBase: () => 'http://localhost:3000',
}));

const mockFetch = jest.fn<typeof fetch>();

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  mockFetch.mockReset();
  (globalThis as typeof globalThis & { fetch: typeof fetch }).fetch =
    mockFetch as unknown as typeof fetch;
});

afterEach(() => {
  mockFetch.mockReset();
});

describe('App', () => {
  test('renders the API message and messages list', async () => {
    mockFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.endsWith('/messages')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ messages: [{ id: 1, text: 'Seed message', createdAt: '' }] }),
          status: 200,
        } as unknown as Response);
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ message: 'Test message' }),
        status: 200,
      } as Response);
    });

    renderApp();

    expect(screen.getByRole('heading', { name: /MoobyStack Frontend/i })).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText(/API says:/i)).toBeTruthy();
      expect(screen.getByText(/Test message/)).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText(/#1/)).toBeTruthy();
      expect(screen.getByText(/Seed message/)).toBeTruthy();
    });
  });

  test('shows an error message when the API request fails', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 } as Response);

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/Could not load message:\s*Request failed with 500/i)).toBeTruthy();
      expect(screen.getByText(/Could not load messages:\s*Request failed with 500/i)).toBeTruthy();
    });
  });

  test('shows a validation error when the payload shape is unexpected', async () => {
    mockFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.endsWith('/messages')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ messages: [] }),
          status: 200,
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ message: 42 }),
        status: 200,
      } as Response);
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/Could not load message/i)).toBeTruthy();
      expect(screen.getByText(/Invalid response shape/i)).toBeTruthy();
    });
  });
});
