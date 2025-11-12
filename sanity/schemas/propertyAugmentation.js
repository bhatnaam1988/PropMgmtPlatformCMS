export default {
  name: 'propertyAugmentation',
  title: 'Property Augmentation',
  type: 'document',
  description: 'Add custom content and images to Uplisting properties',
  fields: [
    {
      name: 'uplistingId',
      title: 'Uplisting Property ID',
      type: 'string',
      description: 'The ID from Uplisting API',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'customTitle',
      title: 'Custom Title',
      type: 'string',
      description: 'Override the property title from Uplisting',
    },
    {
      name: 'customDescription',
      title: 'Custom Description',
      type: 'text',
      rows: 5,
      description: 'Add custom marketing description',
    },
    {
      name: 'highlightedFeatures',
      title: 'Highlighted Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key features to highlight on the property page',
    },
    {
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
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
        },
      ],
      description: 'Add custom images beyond Uplisting photos',
    },
    {
      name: 'localTips',
      title: 'Local Tips',
      type: 'text',
      rows: 4,
      description: 'Share insider tips about the property or area',
    },
  ],
  preview: {
    select: {
      title: 'customTitle',
      subtitle: 'uplistingId',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Property Augmentation',
        subtitle: `Uplisting ID: ${subtitle}`,
      };
    },
  },
};
