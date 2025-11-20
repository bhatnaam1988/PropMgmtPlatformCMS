export default {
  name: 'graechenSettingsHybrid',
  title: 'Grächen Page Content',
  type: 'document',
  fields: [
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'location',
          title: 'Location',
          type: 'string'
        },
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'string'
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string'
            }
          ]
        }
      ]
    },
    {
      name: 'introSection',
      title: 'Introduction Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'paragraph1',
          title: 'First Paragraph',
          type: 'text'
        },
        {
          name: 'paragraph2',
          title: 'Second Paragraph',
          type: 'text'
        }
      ]
    },
    {
      name: 'highlightsSection',
      title: 'Village Highlights',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'highlights',
          title: 'Highlights',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { 
                  name: 'icon', 
                  title: 'Icon Name (Lucide)', 
                  type: 'string',
                  description: 'e.g., Mountain, Snowflake, Sun, Sparkles'
                },
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'activitiesSection',
      title: 'Activities Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'winterActivities',
          title: 'Winter Activities',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' }
              ]
            }
          ]
        },
        {
          name: 'summerActivities',
          title: 'Summer Activities',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'practicalInfoSection',
      title: 'Practical Information',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'infoBlocks',
          title: 'Info Blocks',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { 
                  name: 'items', 
                  title: 'Items', 
                  type: 'array',
                  of: [{ type: 'string' }]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'mountainViewsSection',
      title: 'Mountain Views Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'paragraph1',
          title: 'First Paragraph',
          type: 'text'
        },
        {
          name: 'paragraph2',
          title: 'Second Paragraph',
          type: 'text'
        },
        {
          name: 'ctaText',
          title: 'CTA Button Text',
          type: 'string'
        },
        {
          name: 'ctaLink',
          title: 'CTA Button Link',
          type: 'string'
        },
        {
          name: 'secondaryCtaText',
          title: 'Secondary CTA Text',
          type: 'string'
        },
        {
          name: 'secondaryCtaLink',
          title: 'Secondary CTA Link',
          type: 'string'
        }
      ]
    },
    {
      name: 'cultureSection',
      title: 'Alpine Culture Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text'
        },
        {
          name: 'points',
          title: 'Culture Points',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'finalCTA',
      title: 'Final Call-to-Action',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text'
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string'
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string'
        }
      ]
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Grächen Page Content'
      };
    }
  }
};
