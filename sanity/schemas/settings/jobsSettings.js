export default {
  name: 'jobsSettings',
  title: 'Jobs Page Settings',
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
        },
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'text',
        },
      ],
    },
    {
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
        { type: 'textBlock' },
        { type: 'imageBlock' },
        { type: 'featureGrid' },
      ],
    },
    {
      name: 'jobOpenings',
      title: 'Job Openings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Job Title',
              type: 'string',
            },
            {
              name: 'department',
              title: 'Department',
              type: 'string',
            },
            {
              name: 'location',
              title: 'Location',
              type: 'string',
            },
            {
              name: 'type',
              title: 'Job Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Full-time', value: 'full-time' },
                  { title: 'Part-time', value: 'part-time' },
                  { title: 'Contract', value: 'contract' },
                  { title: 'Seasonal', value: 'seasonal' },
                ],
              },
            },
            {
              name: 'description',
              title: 'Job Description',
              type: 'text',
              rows: 5,
            },
          ],
        },
      ],
    },
    {
      name: 'applicationFormSettings',
      title: 'Application Form Settings',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Form Heading',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Form Description',
          type: 'text',
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
        title: 'Jobs Page Settings',
      };
    },
  },
};
