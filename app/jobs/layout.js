import { getPageMetadata } from '@/lib/metadata';

export const metadata = getPageMetadata('jobs');

export default function JobsLayout({ children }) {
  return children;
}
