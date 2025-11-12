import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

const PortableText = ({ content }) => {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  const renderBlock = (block) => {
    const { _type, _key, style, children, markDefs = [], listItem } = block;

    // Handle image blocks
    if (_type === 'image') {
      const imageUrl = block.asset?.url || urlFor(block).url();
      return (
        <figure key={_key} className="my-8">
          <Image
            src={imageUrl}
            alt={block.alt || 'Blog image'}
            width={1200}
            height={675}
            className="rounded-lg w-full h-auto"
          />
          {block.caption && (
            <figcaption className="text-sm text-muted-foreground mt-2 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // Handle text blocks
    if (_type === 'block') {
      const renderChildren = () => {
        if (!children) return null;

        return children.map((child, index) => {
          if (child._type === 'span') {
            let text = child.text;
            const marks = child.marks || [];

            // Apply marks (bold, italic, links)
            marks.forEach((mark) => {
              if (mark === 'strong') {
                text = <strong key={`${_key}-${index}-strong`}>{text}</strong>;
              } else if (mark === 'em') {
                text = <em key={`${_key}-${index}-em`}>{text}</em>;
              } else {
                // Check if it's a link annotation
                const annotation = markDefs.find((def) => def._key === mark);
                if (annotation && annotation._type === 'link') {
                  text = (
                    <a
                      key={`${_key}-${index}-link`}
                      href={annotation.href}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {text}
                    </a>
                  );
                }
              }
            });

            return <span key={`${_key}-${index}`}>{text}</span>;
          }
          return null;
        });
      };

      // Handle different block styles
      const content = renderChildren();

      if (listItem === 'bullet') {
        return (
          <li key={_key} className="ml-6 list-disc">
            {content}
          </li>
        );
      }

      switch (style) {
        case 'h2':
          return (
            <h2 key={_key} className="text-3xl font-bold mt-8 mb-4">
              {content}
            </h2>
          );
        case 'h3':
          return (
            <h3 key={_key} className="text-2xl font-bold mt-6 mb-3">
              {content}
            </h3>
          );
        case 'h4':
          return (
            <h4 key={_key} className="text-xl font-bold mt-4 mb-2">
              {content}
            </h4>
          );
        case 'blockquote':
          return (
            <blockquote key={_key} className="border-l-4 border-primary pl-4 italic my-4">
              {content}
            </blockquote>
          );
        default:
          return (
            <p key={_key} className="mb-4 leading-relaxed">
              {content}
            </p>
          );
      }
    }

    return null;
  };

  return (
    <div className="prose prose-lg max-w-none">
      {content.map((block) => renderBlock(block))}
    </div>
  );
};

export default PortableText;
