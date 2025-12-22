/**
 * Property Structured Data Component
 * Adds Accommodation schema.org markup to property pages
 * Improves SEO with rich search results
 */

import { getVacationRentalSchema } from '@/lib/schemas';

export function PropertyStructuredData({ property }) {
  if (!property) return null;
  
  const schema = getVacationRentalSchema(property);
  
  if (!schema) return null;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
