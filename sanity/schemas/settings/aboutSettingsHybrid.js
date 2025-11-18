export default {
  name: 'aboutSettingsHybrid',
  title: 'About Page Content',
  type: 'document',
  fields: [
    // Hero Section
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'Our Story',
        },
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'string',
          initialValue: 'Where authentic stays meet modern comfort and local adventure',
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            },
          ],
        },
      ],
    },
    
    // Welcome Story Section
    {
      name: 'welcomeStory',
      title: 'Welcome Story Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Welcome to Swiss Alpine Journey',
        },
        {
          name: 'paragraphs',
          title: 'Story Paragraphs',
          type: 'array',
          of: [{ type: 'text' }],
          validation: (Rule) => Rule.min(1).max(5),
        },
        {
          name: 'image',
          title: 'Section Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            },
          ],
        },
        {
          name: 'ctaText',
          title: 'CTA Link Text',
          type: 'string',
          initialValue: 'Browse Our Properties →',
        },
        {
          name: 'ctaLink',
          title: 'CTA Link URL',
          type: 'string',
          initialValue: '/stay',
        },
      ],
    },
    
    // Our Values Section
    {
      name: 'valuesSection',
      title: 'Our Values Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Our Values',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
          initialValue: 'The principles that guide everything we do, from selecting properties to caring for our guests',
        },
        {
          name: 'values',
          title: 'Values',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'icon',
                  title: 'Icon Name (Lucide)',
                  type: 'string',
                  description: 'e.g., Heart, Award, Users, Star',
                },
                {
                  name: 'title',
                  title: 'Value Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Value Description',
                  type: 'text',
                },
              ],
            },
          ],
          validation: (Rule) => Rule.min(1).max(6),
        },
      ],
    },
    
    // Stats Section
    {
      name: 'statsSection',
      title: 'Statistics Section',
      type: 'object',
      fields: [
        {
          name: 'stats',
          title: 'Statistics',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Number/Text',
                  type: 'string',
                  description: 'e.g., "100+", "4.9", "Airbnb Superhost"',
                },
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                },
              ],
            },
          ],
          validation: (Rule) => Rule.min(1).max(6),
        },
      ],
    },
    
    // Why Choose Us Section
    {
      name: 'whyChooseSection',
      title: 'Why Choose Us Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Why Choose Swiss Alpine Journey?',
        },
        {
          name: 'image',
          title: 'Section Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            },
          ],
        },
        {
          name: 'points',
          title: 'Key Points',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Point Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Point Description',
                  type: 'text',
                },
              ],
            },
          ],
          validation: (Rule) => Rule.min(1).max(6),
        },
        {
          name: 'links',
          title: 'Section Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'Link URL',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    },
    
    // Final CTA Section
    {
      name: 'finalCTA',
      title: 'Final CTA Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'CTA Heading',
          type: 'string',
          initialValue: 'Ready to Plan Your Journey?',
        },
        {
          name: 'description',
          title: 'CTA Description',
          type: 'text',
          initialValue: 'Let us help you discover your perfect Swiss home base.',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Plan Your Journey',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
          initialValue: '/stay',
        },
      ],
    },
    
    // SEO
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page Content',
      };
    },
  },
};
