import { getPageMetadata } from '@/lib/metadata';

export const metadata = getPageMetadata('legal');

export default function LegalLayout({ children }) {
  return children;
}
