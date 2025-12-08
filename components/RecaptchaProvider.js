'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useEffect, useState } from 'react';

/**
 * ReCaptcha Provider Component
 * Wraps the application with Google ReCaptcha v3 context
 * 
 * This provides ReCaptcha functionality to all child components
 */
export function RecaptchaProvider({ children }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!siteKey) {
    console.warn('⚠️ ReCaptcha site key is not configured');
    // Return children without ReCaptcha if key is missing
    // This allows the app to work even if ReCaptcha is not configured
    return <>{children}</>;
  }

  // Don't render ReCaptcha provider until mounted (client-side only)
  if (!mounted) {
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
      container={{
        parameters: {
          badge: 'bottomright', // or 'bottomleft', 'inline'
          theme: 'light',
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
