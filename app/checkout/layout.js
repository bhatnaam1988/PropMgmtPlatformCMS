import { getPageMetadata } from '@/lib/metadata';

export const metadata = getPageMetadata('checkout');

export default function CheckoutLayout({ children }) {
  return children;
}
