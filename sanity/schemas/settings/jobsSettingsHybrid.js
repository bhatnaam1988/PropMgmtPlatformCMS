export default {
  name: 'jobsSettingsHybrid',
  title: 'Jobs Page Content',
  type: 'document',
  fields: [
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text'
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string'
            }
          ]
        }
      ]
    },
    {
      name: 'valuesSection',
      title: 'Company Values Section',
      type: 'object',
      fields: [
        {
          name: 'values',
          title: 'Values',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'openPositionsSection',
      title: 'Open Positions Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'positions',
          title: 'Positions',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Job Title', type: 'string' },
                { name: 'location', title: 'Location', type: 'string' },
                { name: 'type', title: 'Job Type', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'applicationSection',
      title: 'Application Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text'
        },
        {
          name: 'footerText',
          title: 'Footer Text',
          type: 'text'
        }
      ]
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Jobs Page Content'
      };
    }
  }
};
