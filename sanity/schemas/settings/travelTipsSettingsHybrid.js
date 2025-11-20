export default {
  name: 'travelTipsSettingsHybrid',
  title: 'Travel Tips Page Settings',
  type: 'document',
  fields: [
    {
      name: 'pageHeader',
      title: 'Page Header',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Heading' },
        { name: 'description', type: 'text', title: 'Description' }
      ]
    },
    {
      name: 'quickTips',
      title: 'Quick Tips Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        {
          name: 'tips',
          title: 'Quick Tips',
          type: 'array',
          of: [{ type: 'string' }]
        }
      ]
    },
    {
      name: 'detailedTipsSection',
      title: 'Detailed Tips Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        {
          name: 'categories',
          title: 'Tip Categories',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'icon',
                  type: 'string',
                  title: 'Icon Name (Lucide)',
                  description: 'e.g., Mountain, Snowflake, Camera'
                },
                { name: 'title', type: 'string', title: 'Category Title' },
                {
                  name: 'tips',
                  type: 'array',
                  title: 'Tips',
                  of: [{ type: 'string' }]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'moneySavingSection',
      title: 'Money-Saving Tips Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        {
          name: 'tips',
          title: 'Money-Saving Tips',
          type: 'array',
          of: [{ type: 'string' }]
        }
      ]
    },
    {
      name: 'sustainabilitySection',
      title: 'Sustainability Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        { name: 'description', type: 'text', title: 'Description' },
        {
          name: 'tips',
          title: 'Sustainability Tips',
          type: 'array',
          of: [{ type: 'string' }]
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Travel Tips Page Settings'
      };
    }
  }
};
