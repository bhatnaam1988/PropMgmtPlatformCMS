export default {
  name: 'servicePageSettings',
  title: 'Service Pages',
  type: 'document',
  fields: [
    {
      name: 'pageType',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          { title: 'Cleaning Services', value: 'cleaning' },
          { title: 'Rental Services', value: 'rental' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
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
        {
          name: 'image',
          title: 'Hero Image',
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
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
        { type: 'textBlock' },
        { type: 'imageBlock' },
        { type: 'ctaBlock' },
        { type: 'featureGrid' },
        { type: 'testimonialBlock' },
      ],
    },
    {
      name: 'features',
      title: 'Service Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Feature Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Feature Description',
              type: 'text',
            },
            {
              name: 'icon',
              title: 'Icon Name (Lucide)',
              type: 'string',
              description: 'e.g., Sparkles, Home, CheckCircle',
            },
          ],
        },
      ],
    },
    {
      name: 'formSettings',
      title: 'Service Request Form',
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
    select: {
      title: 'title',
      pageType: 'pageType',
    },
    prepare(selection) {
      const { title, pageType } = selection;
      return {
        title: title,
        subtitle: pageType === 'cleaning' ? 'Cleaning Services' : 'Rental Services',
      };
    },
  },
};
