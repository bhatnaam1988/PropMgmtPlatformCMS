export default {
  name: 'legalSettings',
  title: 'Legal Page Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sections',
      title: 'Legal Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Section Content',
              type: 'array',
              of: [{ type: 'block' }],
            },
          ],
        },
      ],
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated Date',
      type: 'date',
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
        title: 'Legal Page Settings',
      };
    },
  },
};
