/**
 * Structured Data Component
 * Renders JSON-LD schema in <script> tags
 */

export default function StructuredData({ schema }) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Multiple schemas component
 */
export function MultipleStructuredData({ schemas }) {
  if (!schemas || schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, index) => (
        <StructuredData key={index} schema={schema} />
      ))}
    </>
  );
}
