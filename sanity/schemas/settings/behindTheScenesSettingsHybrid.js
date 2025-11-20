export default {
  name: 'behindTheScenesSettingsHybrid',
  title: 'Behind The Scenes Page Settings',
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
      name: 'storySection',
      title: 'Our Story Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        {
          name: 'paragraphs',
          title: 'Story Paragraphs',
          type: 'array',
          of: [{ type: 'text' }]
        }
      ]
    },
    {
      name: 'valuesSection',
      title: 'Values Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        {
          name: 'values',
          title: 'Our Values',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'icon',
                  type: 'string',
                  title: 'Icon Name (Lucide)',
                  description: 'e.g., Heart, Home, Users'
                },
                { name: 'title', type: 'string', title: 'Value Title' },
                { name: 'description', type: 'text', title: 'Description' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'teamSection',
      title: 'Team Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        {
          name: 'roles',
          title: 'Team Roles',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'role', type: 'string', title: 'Role Title' },
                { name: 'description', type: 'text', title: 'Description' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'processSection',
      title: 'Process Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        {
          name: 'steps',
          title: 'Process Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string', title: 'Step Title' },
                { name: 'description', type: 'text', title: 'Description' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'qualityStandardsSection',
      title: 'Quality Standards Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        {
          name: 'standards',
          title: 'Quality Standards',
          type: 'array',
          of: [{ type: 'string' }]
        }
      ]
    },
    {
      name: 'communitySection',
      title: 'Community & Sustainability Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Section Heading' },
        { name: 'paragraph1', type: 'text', title: 'First Paragraph' },
        { name: 'paragraph2', type: 'text', title: 'Second Paragraph' }
      ]
    },
    {
      name: 'finalCTA',
      title: 'Final CTA Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'Heading' },
        { name: 'description', type: 'text', title: 'Description' },
        { name: 'primaryButtonText', type: 'string', title: 'Primary Button Text' },
        { name: 'primaryButtonLink', type: 'string', title: 'Primary Button Link' },
        { name: 'secondaryButtonText', type: 'string', title: 'Secondary Button Text' },
        { name: 'secondaryButtonLink', type: 'string', title: 'Secondary Button Link' }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Behind The Scenes Page Settings'
      };
    }
  }
};
