export default {
  name: 'homeSettings',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'string',
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
    {
      name: 'featuredSection',
      title: 'Featured Properties Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Our listings',
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
          rows: 3,
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Settings',
      };
    },
  },
};
