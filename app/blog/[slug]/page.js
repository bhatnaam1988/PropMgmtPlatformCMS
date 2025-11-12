import { getBlogPostBySlug, getAllBlogPostSlugs } from '@/lib/sanity';
import { generateBlogPostMetadata } from '@/lib/metadata';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDateForDisplay } from '@/lib/date-utils';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import PortableText from '@/components/PortableText';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();
  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return generateBlogPostMetadata(post);
}

export const revalidate = 300; // Revalidate every 5 minutes

export default async function BlogPostPage({ params }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      {post.mainImage?.asset?.url && (
        <div className="relative w-full h-[400px] md:h-[500px] mb-8">
          <Image
            src={post.mainImage.asset.url}
            alt={post.mainImage.alt || post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 pb-16 max-w-4xl">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
          {post.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <time dateTime={post.publishedAt}>
                {formatDateForDisplay(new Date(post.publishedAt))}
              </time>
            </div>
          )}

          {post.author?.name && (
            <div className="flex items-center gap-2">
              {post.author.image?.asset?.url && (
                <Image
                  src={post.author.image.asset.url}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              {!post.author.image?.asset?.url && <User className="h-5 w-5" />}
              <span>{post.author.name}</span>
            </div>
          )}

          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.slug.current}
                  className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Body Content */}
        <div className="text-foreground">
          <PortableText content={post.body} />
        </div>

        {/* Author Bio */}
        {post.author && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-start gap-4">
              {post.author.image?.asset?.url && (
                <Image
                  src={post.author.image.asset.url}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <div>
                <h3 className="text-xl font-bold mb-2">About {post.author.name}</h3>
                {post.author.bio && post.author.bio.length > 0 && (
                  <div className="text-muted-foreground">
                    {post.author.bio.map((block) => (
                      <p key={block._key}>
                        {block.children?.map((child) => child.text).join('')}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
