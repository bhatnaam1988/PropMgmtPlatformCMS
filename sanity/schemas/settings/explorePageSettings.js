export default {
  name: 'explorePageSettings',
  title: 'Explore Pages',
  type: 'document',
  fields: [
    {
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Grächen', value: 'graechen' },
          { title: 'Other Locations', value: 'other-locations' },
          { title: 'Travel Tips', value: 'travel-tips' },
          { title: 'Behind the Scenes', value: 'behind-the-scenes' },
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
      const typeLabels = {
        'graechen': 'Grächen',
        'other-locations': 'Other Locations',
        'travel-tips': 'Travel Tips',
        'behind-the-scenes': 'Behind the Scenes',
      };
      return {
        title: title,
        subtitle: typeLabels[pageType] || pageType,
      };
    },
  },
};
