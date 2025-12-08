/**
 * Custom hook for Google ReCaptcha v3 verification
 * 
 * Usage:
 * const { executeRecaptcha, isLoading, error } = useRecaptcha();
 * 
 * const handleSubmit = async () => {
 *   const isVerified = await executeRecaptcha('submit_form');
 *   if (isVerified) {
 *     // Proceed with submission
 *   }
 * };
 */

import { useCallback, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export function useRecaptcha() {
  const { executeRecaptcha: executeGoogleRecaptcha } = useGoogleReCaptcha();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute ReCaptcha and verify with backend
   * @param {string} action - Action name for ReCaptcha (e.g., 'submit_form', 'reserve_booking')
   * @returns {Promise<boolean>} - Returns true if verified, false if failed
   */
  const executeRecaptcha = useCallback(
    async (action = 'submit') => {
      if (!executeGoogleRecaptcha) {
        console.error('ReCaptcha not loaded yet');
        setError('ReCaptcha not ready. Please refresh and try again.');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get ReCaptcha token from Google
        const token = await executeGoogleRecaptcha(action);

        // Verify token with our backend
        const response = await fetch('/api/verify-recaptcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, action }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Verification failed');
        }

        setIsLoading(false);
        return true;
      } catch (err) {
        console.error('ReCaptcha verification failed:', err);
        setError(err.message || 'Verification failed. Please try again.');
        setIsLoading(false);
        return false;
      }
    },
    [executeGoogleRecaptcha]
  );

  return {
    executeRecaptcha,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
