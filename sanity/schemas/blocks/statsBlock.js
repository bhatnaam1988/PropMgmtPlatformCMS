export default {
  name: 'statsBlock',
  title: 'Stats Block',
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
              description: 'e.g., "Happy Families Hosted", "Since 2024"',
            },
          ],
          preview: {
            select: {
              title: 'number',
              subtitle: 'label',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    },
  ],
  preview: {
    select: {
      stats: 'stats',
    },
    prepare(selection) {
      const { stats } = selection;
      const count = stats?.length || 0;
      return {
        title: 'Stats Block',
        subtitle: `${count} statistic${count !== 1 ? 's' : ''}`,
      };
    },
  },
};
