'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

/**
 * ReCaptcha Provider Component
 * Wraps the application with Google ReCaptcha v3 context
 * 
 * This provides ReCaptcha functionality to all child components
 */
export function RecaptchaProvider({ children }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error('ReCaptcha site key is not configured');
    // Return children without ReCaptcha if key is missing
    // This allows the app to work even if ReCaptcha is not configured
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
