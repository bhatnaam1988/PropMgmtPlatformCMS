/**
 * Skip to Main Content Link
 * WCAG 2.1 AA - Bypass Blocks (2.4.1)
 * Allows keyboard users to skip navigation and go directly to main content
 */

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  );
}
