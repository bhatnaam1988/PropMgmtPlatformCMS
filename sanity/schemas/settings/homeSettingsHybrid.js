export default {
  name: 'homeSettingsHybrid',
  title: 'Homepage Content',
  type: 'document',
  fields: [
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'text',
          validation: Rule => Rule.required()
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
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        }
      ]
    },
    {
      name: 'listingsSection',
      title: 'Listings Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'ctaText',
          title: 'View All Button Text',
          type: 'string'
        },
        {
          name: 'ctaLink',
          title: 'View All Button Link',
          type: 'string'
        }
      ]
    },
    {
      name: 'homeBaseSection',
      title: 'Home Base Section',
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
          name: 'ctaText',
          title: 'Button Text',
          type: 'string'
        },
        {
          name: 'ctaLink',
          title: 'Button Link',
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
      name: 'activitiesSection',
      title: 'Activities Section',
      type: 'object',
      fields: [
        {
          name: 'activities',
          title: 'Activities',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' },
                { name: 'linkText', title: 'Link Text', type: 'string' },
                { name: 'linkUrl', title: 'Link URL', type: 'string' }
              ]
            }
          ],
          validation: Rule => Rule.max(3)
        }
      ]
    },
    {
      name: 'newsletterSection',
      title: 'Newsletter Section',
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
        title: 'Homepage Content'
      };
    }
  }
};
