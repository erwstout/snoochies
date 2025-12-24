import { describe, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./utils/getApiBase', () => ({
  getApiBase: () => 'http://localhost:3000',
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockFetch = jest.fn<typeof fetch>();

beforeEach(() => {
  mockFetch.mockResolvedValue({
    ok: true,
    // eslint-disable-next-line @typescript-eslint/require-await
    json: async () => ({ message: 'Test message' }),
  } as unknown as Response);
  (globalThis as typeof globalThis & { fetch: typeof fetch }).fetch =
    mockFetch as unknown as typeof fetch;
  queryClient.clear();
});

afterEach(() => {
  mockFetch.mockReset();
});

describe('App', () => {
  test('renders the message card heading', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
    expect(screen.getByRole('heading', { name: /MoobyStack Frontend/i })).toBeTruthy();
  });
});
