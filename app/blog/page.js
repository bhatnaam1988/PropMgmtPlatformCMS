import { getAllBlogPosts } from '@/lib/sanity';
import { generateBlogListMetadata } from '@/lib/metadata';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateForDisplay } from '@/lib/date-utils';
import { Calendar, User } from 'lucide-react';

export const metadata = generateBlogListMetadata();

export const revalidate = 300; // Revalidate every 5 minutes

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
            Discover travel tips, local insights, and stories from the Swiss Alps
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <Link href={`/blog/${post.slug.current}`}>
                    {post.mainImage?.asset?.url && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.mainImage.asset.url}
                          alt={post.mainImage.alt || post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.publishedAt}>
                              {formatDateForDisplay(new Date(post.publishedAt))}
                            </time>
                          </div>
                        )}
                        {post.author?.name && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author.name}</span>
                          </div>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.categories.map((category) => (
                            <span
                              key={category.slug.current}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                            >
                              {category.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
