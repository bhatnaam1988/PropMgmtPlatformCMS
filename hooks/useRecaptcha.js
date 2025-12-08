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

import { useCallback, useState, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export function useRecaptcha() {
  const { executeRecaptcha: executeGoogleRecaptcha } = useGoogleReCaptcha();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Check if ReCaptcha is ready
  useEffect(() => {
    if (executeGoogleRecaptcha) {
      // Add a small delay to ensure script is fully loaded
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [executeGoogleRecaptcha]);

  /**
   * Execute ReCaptcha and verify with backend
   * @param {string} action - Action name for ReCaptcha (e.g., 'submit_form', 'reserve_booking')
   * @returns {Promise<boolean>} - Returns true if verified, false if failed
   */
  const executeRecaptcha = useCallback(
    async (action = 'submit') => {
      // Check if ReCaptcha is ready
      if (!executeGoogleRecaptcha || !isReady) {
        console.error('ReCaptcha not loaded yet');
        setError('Security verification is loading. Please wait a moment and try again.');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get ReCaptcha token from Google
        const token = await executeGoogleRecaptcha(action);

        if (!token) {
          throw new Error('Failed to generate verification token');
        }

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
          // Provide more specific error messages
          if (response.status === 400) {
            throw new Error('Security verification failed. This might be due to network issues or browser restrictions. Please try again or contact support if the issue persists.');
          }
          throw new Error(result.message || 'Verification failed. Please try again.');
        }

        setIsLoading(false);
        return true;
      } catch (err) {
        console.error('ReCaptcha verification failed:', err);
        
        // User-friendly error messages
        let errorMessage = 'Verification failed. Please try again.';
        
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('token')) {
          errorMessage = 'Security verification issue. Please refresh the page and try again.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setIsLoading(false);
        return false;
      }
    },
    [executeGoogleRecaptcha, isReady]
  );

  return {
    executeRecaptcha,
    isLoading,
    error,
    isReady,
    clearError: () => setError(null),
  };
}
