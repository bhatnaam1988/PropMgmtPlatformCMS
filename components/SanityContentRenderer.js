import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import * as Icons from 'lucide-react';

export function SanityContentRenderer({ content }) {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  return (
    <div className="space-y-12">
      {content.map((block, index) => {
        switch (block._type) {
          case 'textBlock':
            return <TextBlock key={block._key || index} block={block} />;
          case 'imageBlock':
            return <ImageBlock key={block._key || index} block={block} />;
          case 'ctaBlock':
            return <CTABlock key={block._key || index} block={block} />;
          case 'featureGrid':
            return <FeatureGrid key={block._key || index} block={block} />;
          case 'testimonialBlock':
            return <TestimonialBlock key={block._key || index} block={block} />;
          case 'statsBlock':
            return <StatsBlock key={block._key || index} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function TextBlock({ block }) {
  const { heading, text } = block;

  return (
    <div className="container mx-auto px-4 py-8">
      {heading && (
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
      )}
      {text && (
        <div className="prose prose-lg max-w-none">
          {text.map((textBlock, idx) => {
            if (textBlock._type === 'block') {
              const content = textBlock.children?.map(child => child.text).join('');
              
              switch (textBlock.style) {
                case 'h2':
                  return <h2 key={textBlock._key || idx} className="text-3xl font-bold mt-8 mb-4">{content}</h2>;
                case 'h3':
                  return <h3 key={textBlock._key || idx} className="text-2xl font-bold mt-6 mb-3">{content}</h3>;
                default:
                  return <p key={textBlock._key || idx} className="mb-4 leading-relaxed">{content}</p>;
              }
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

function ImageBlock({ block }) {
  const { image, layout = 'contained' } = block;
  
  if (!image?.asset) return null;

  const imageUrl = image.asset.url || urlFor(image).url();
  const containerClass = layout === 'full' 
    ? 'w-full' 
    : layout === 'contained' 
    ? 'container mx-auto px-4' 
    : 'container mx-auto px-4';

  return (
    <div className={containerClass}>
      <figure>
        <div className="relative w-full h-[400px] md:h-[600px]">
          <Image
            src={imageUrl}
            alt={image.alt || 'Content image'}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
        {image.caption && (
          <figcaption className="text-sm text-muted-foreground mt-2 text-center">
            {image.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

function CTABlock({ block }) {
  const { heading, text, buttonText, buttonLink, style = 'primary' } = block;

  const variantMap = {
    primary: 'default',
    secondary: 'secondary',
    accent: 'outline',
  };

  return (
    <div className="bg-primary/5 py-16">
      <div className="container mx-auto px-4 text-center">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
        )}
        {text && (
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {text}
          </p>
        )}
        {buttonText && buttonLink && (
          <Link href={buttonLink}>
            <Button size="lg" variant={variantMap[style]}>
              {buttonText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function FeatureGrid({ block }) {
  const { heading, features, columns = 3 } = block;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {heading && (
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          {heading}
        </h2>
      )}
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
        {features?.map((feature, idx) => {
          const IconComponent = Icons[feature.icon] || Icons.Circle;
          
          return (
            <Card key={feature._key || idx}>
              <CardContent className="pt-6">
                <IconComponent className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TestimonialBlock({ block }) {
  const { quote, author, authorTitle, authorImage, rating } = block;

  return (
    <div className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {rating && (
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: rating }).map((_, i) => (
                <Icons.Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          )}
          {quote && (
            <blockquote className="text-2xl font-medium mb-6 italic">
              "{quote}"
            </blockquote>
          )}
          <div className="flex items-center justify-center gap-4">
            {authorImage?.asset && (
              <Image
                src={authorImage.asset.url || urlFor(authorImage).url()}
                alt={author || 'Testimonial author'}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div className="text-left">
              {author && <p className="font-semibold">{author}</p>}
              {authorTitle && (
                <p className="text-sm text-muted-foreground">{authorTitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsBlock({ block }) {
  const { stats } = block;

  if (!stats || stats.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <div key={stat._key || idx} className="text-center">
            <div className="text-3xl md:text-4xl font-medium text-primary mb-2">
              {stat.number}
            </div>
            <div className="text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
