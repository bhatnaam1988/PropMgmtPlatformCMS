import { getPageMetadata } from '@/lib/metadata';

export const metadata = getPageMetadata('about');

export default function AboutLayout({ children }) {
  return children;
}
