export default {
  name: 'imageBlock',
  title: 'Image Block',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip', 'palette'],
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Full Width', value: 'full' },
          { title: 'Contained', value: 'contained' },
          { title: 'Side by Side', value: 'sideBySide' },
        ],
      },
      initialValue: 'contained',
    },
  ],
  preview: {
    select: {
      title: 'image.alt',
      media: 'image',
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title || 'Image Block',
        media,
      };
    },
  },
};
