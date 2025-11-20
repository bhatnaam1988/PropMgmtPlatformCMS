export default {
  name: 'otherLocationsSettingsHybrid',
  title: 'Other Locations Page Settings',
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
      name: 'locationsSection',
      title: 'Locations Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        {
          name: 'locations',
          title: 'Featured Locations',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'slug', type: 'string', title: 'Slug' },
                { name: 'name', type: 'string', title: 'Location Name' },
                { name: 'region', type: 'string', title: 'Region' },
                { name: 'excerpt', type: 'text', title: 'Short Description' },
                {
                  name: 'highlights',
                  type: 'array',
                  title: 'Highlights',
                  of: [{ type: 'string' }]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'graechenCTA',
      title: 'Grächen CTA Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Heading' },
        { name: 'description', type: 'text', title: 'Description' },
        { name: 'buttonText', type: 'string', title: 'Button Text' },
        { name: 'buttonLink', type: 'string', title: 'Button Link' }
      ]
    },
    {
      name: 'activitiesOverview',
      title: 'Activities Overview',
      type: 'object',
      fields: [
        {
          name: 'activities',
          title: 'Activities',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'icon',
                  type: 'string',
                  title: 'Icon Name (Lucide)',
                  description: 'e.g., Mountain, Snowflake, Utensils'
                },
                { name: 'title', type: 'string', title: 'Activity Title' },
                { name: 'description', type: 'text', title: 'Description' }
              ]
            }
          ]
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Other Locations Page Settings'
      };
    }
  }
};
