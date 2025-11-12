export default {
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Lucide icon name (e.g., "Home", "Users", "Star")',
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'icon',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(2).max(6),
    },
    {
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [2, 3, 4],
      },
      initialValue: 3,
    },
  ],
  preview: {
    select: {
      title: 'heading',
      features: 'features',
    },
    prepare(selection) {
      const { title, features } = selection;
      return {
        title: title || 'Feature Grid',
        subtitle: `${features?.length || 0} features`,
      };
    },
  },
};
