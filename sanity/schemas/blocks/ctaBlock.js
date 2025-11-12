export default {
  name: 'ctaBlock',
  title: 'Call to Action',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Dark)', value: 'primary' },
          { title: 'Secondary (Light)', value: 'secondary' },
          { title: 'Accent', value: 'accent' },
        ],
      },
      initialValue: 'primary',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'buttonText',
    },
  },
};
