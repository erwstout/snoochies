import { useQuery } from '@tanstack/react-query';
import { fetchJson } from './client';
import {
  messagesResponseSchema,
  rootMessageSchema,
  type MessagesResponse,
  type RootMessageResponse,
} from './schemas';

export const queryKeys = {
  root: ['root-message'] as const,
  messages: ['messages'] as const,
};

export function useRootMessageQuery() {
  return useQuery<RootMessageResponse>({
    queryKey: queryKeys.root,
    queryFn: () => fetchJson('/', rootMessageSchema),
  });
}

export function useMessagesQuery() {
  return useQuery<MessagesResponse>({
    queryKey: queryKeys.messages,
    queryFn: () => fetchJson('/messages', messagesResponseSchema),
  });
}
