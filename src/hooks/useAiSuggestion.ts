
import { useState, useRef, useCallback } from 'react';
import {
  generateSituationSections,
  SituationSuggestionResult,
} from '../services/aiService';
import { ApplicationData } from '../features/applicationForm/applicationContext';

interface UseAiSuggestionResult {
  loading: boolean;
  error: string | null;
  sections: SituationSuggestionResult | null;
  generate: (data: ApplicationData) => Promise<SituationSuggestionResult | null>;
}

export function useAiSuggestion(): UseAiSuggestionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<SituationSuggestionResult | null>(null);

  // Cache keyed by JSON.stringify(applicationData)
  const cache = useRef<Record<string, SituationSuggestionResult>>({});

  // Timestamp of last invocation, used for throttling
  const lastTime = useRef<number>(0);

  // Map of internal error codes → user-friendly messages
  const errorMessages: Record<string, string> = {
    rate_limit: 'You’ve hit the rate limit. Please wait a moment or upgrade your plan.',
    server_error: 'Something went wrong on our side. Please try again later.',
    timeout: 'The request timed out. Please try again.',
    network_error: 'Network error. Please check your connection and try again.',
  };

  const generate = useCallback(
    async (fullData: ApplicationData) => {
      const key = JSON.stringify(fullData);

      // 1) Return cached result, if any
      if (cache.current[key]) {
        setSections(cache.current[key]);
        return cache.current[key];
      }

      // 2) Throttle: require 2s between calls
      const now = Date.now();
      if (now - lastTime.current < 2000) {
        setError('Please wait a moment before requesting again.');
        return null;
      }
      lastTime.current = now;

      setLoading(true);
      setError(null);
      setSections(null);

      try {
        const result = await generateSituationSections(fullData);
        cache.current[key] = result;
        setSections(result);
        return result;
      } catch (err: any) {
        const code = (err as Error).message;
        // Extract client_error message if present
        const msg =
          code.startsWith('client_error:')
            ? code.slice('client_error:'.length)
            : errorMessages[code] ?? 'An unexpected error occurred.';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, sections, generate };
}