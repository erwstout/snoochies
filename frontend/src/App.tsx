import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApiBase } from './utils/getApiBase';

interface ApiResponse {
  message: string;
}

interface Message {
  id: number;
  text: string;
  createdAt: string;
}

function MessageCard() {
  const apiBase = getApiBase();
  const url = useMemo(() => new URL('/', apiBase).toString(), [apiBase]);
  const messagesUrl = useMemo(() => new URL('/messages', apiBase).toString(), [apiBase]);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<ApiResponse>({
    queryKey: ['root-message'],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Request failed with ${res.status}`);
      }
      const data: unknown = await res.json();
      if (
        !data ||
        typeof data !== 'object' ||
        !('message' in data) ||
        typeof data.message !== 'string'
      ) {
        throw new Error('Invalid response shape');
      }
      return { message: data.message };
    },
  });

  const messagesQuery = useQuery<{ messages: Message[] }>({
    queryKey: ['messages'],
    queryFn: async () => {
      const res = await fetch(messagesUrl);
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      const data: unknown = await res.json();
      if (!data || typeof data !== 'object' || !('messages' in data)) {
        throw new Error('Invalid response shape');
      }
      return {
        messages: Array.isArray((data as { messages: unknown }).messages)
          ? ((data as { messages: unknown[] }).messages ?? [])
              .filter(
                (m) =>
                  m &&
                  typeof m === 'object' &&
                  'text' in m &&
                  typeof (m as { text: unknown }).text === 'string',
              )
              .map((m) => ({
                id: typeof (m as { id?: number }).id === 'number' ? (m as { id: number }).id : 0,
                text: (m as { text: string }).text,
                createdAt:
                  typeof (m as { createdAt?: string }).createdAt === 'string'
                    ? (m as { createdAt: string }).createdAt
                    : '',
              }))
          : [],
      };
    },
  });

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <h1 style={styles.title}>MoobyStack Frontend</h1>
        <div style={styles.headerActions}>
          <button style={styles.button} onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            style={styles.secondaryButton}
            onClick={() => messagesQuery.refetch()}
            disabled={messagesQuery.isFetching}
          >
            {messagesQuery.isFetching ? 'Refreshing list...' : 'Refresh list'}
          </button>
        </div>
      </div>
      {isLoading && <p style={styles.muted}>Loading message from API…</p>}
      {isError && (
        <p style={{ ...styles.muted, color: '#c0392b' }}>
          Could not load message: {error instanceof Error ? error.message : String(error)}
        </p>
      )}
      {data && (
        <p style={styles.message}>
          <span style={styles.label}>API says:</span> {data.message}
        </p>
      )}
      <div style={styles.list}>
        <div style={styles.listHeader}>
          <h2 style={styles.subheading}>Messages (Prisma)</h2>
          {messagesQuery.isLoading && <span style={styles.muted}>Loading…</span>}
        </div>
        {messagesQuery.isError && (
          <p style={{ ...styles.muted, color: '#c0392b' }}>
            Could not load messages:{' '}
            {messagesQuery.error instanceof Error
              ? messagesQuery.error.message
              : String(messagesQuery.error)}
          </p>
        )}
        {messagesQuery.data && (
          <ul style={styles.listItems}>
            {messagesQuery.data.messages.map((msg) => (
              <li key={`${msg.id}-${msg.createdAt}`} style={styles.listItem}>
                <span style={styles.badge}>#{msg.id || 0}</span>
                <span>{msg.text}</span>
              </li>
            ))}
            {messagesQuery.data.messages.length === 0 && (
              <li style={styles.listItemMuted}>No messages yet.</li>
            )}
          </ul>
        )}
      </div>
      <p style={styles.meta}>
        Talking to <code>{url}</code>
      </p>
    </section>
  );
}

export default function App() {
  return (
    <main style={styles.page}>
      <MessageCard />
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 20% 20%, #f7d794 0, #f7d794 20%, #f5f6fa 20%)',
    padding: '2rem',
  },
  card: {
    maxWidth: 640,
    width: '100%',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    padding: '1.5rem',
    border: '1px solid #f0f1f3',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1rem',
  },
  headerActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.4rem',
    letterSpacing: '-0.01em',
    color: '#2c3e50',
  },
  button: {
    border: 'none',
    borderRadius: 10,
    padding: '0.6rem 1rem',
    background: '#6c5ce7',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  secondaryButton: {
    border: '1px solid #dfe6e9',
    borderRadius: 10,
    padding: '0.6rem 1rem',
    background: '#fff',
    color: '#2c3e50',
    cursor: 'pointer',
    fontWeight: 600,
  },
  muted: {
    margin: 0,
    color: '#7f8c8d',
  },
  message: {
    margin: '0.25rem 0 0.75rem',
    fontSize: '1.1rem',
    color: '#2d3436',
  },
  label: {
    color: '#6c5ce7',
    fontWeight: 700,
    marginRight: 6,
  },
  meta: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#95a5a6',
  },
  list: {
    marginTop: '1rem',
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'space-between',
  },
  subheading: {
    margin: 0,
    fontSize: '1rem',
    color: '#2c3e50',
  },
  listItems: {
    listStyle: 'none',
    padding: 0,
    margin: '0.5rem 0 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f8f9fa',
    borderRadius: 10,
    padding: '0.75rem',
    border: '1px solid #ecf0f1',
  },
  listItemMuted: {
    padding: '0.5rem',
    color: '#95a5a6',
  },
  badge: {
    background: '#dfe6e9',
    borderRadius: 8,
    padding: '0.2rem 0.5rem',
    fontSize: '0.8rem',
    color: '#2c3e50',
  },
};
