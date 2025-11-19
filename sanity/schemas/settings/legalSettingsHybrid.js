export default {
  name: 'legalSettingsHybrid',
  title: 'Legal Page Content',
  type: 'document',
  fields: [
    {
      name: 'headerSection',
      title: 'Header Section',
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
        }
      ]
    },
    {
      name: 'termsSection',
      title: 'Terms & Conditions',
      type: 'object',
      fields: [
        {
          name: 'lastUpdated',
          title: 'Last Updated',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{ type: 'block' }]
        }
      ]
    },
    {
      name: 'privacySection',
      title: 'Privacy Policy',
      type: 'object',
      fields: [
        {
          name: 'lastUpdated',
          title: 'Last Updated',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{ type: 'block' }]
        }
      ]
    },
    {
      name: 'gdprSection',
      title: 'GDPR Information',
      type: 'object',
      fields: [
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{ type: 'block' }]
        }
      ]
    },
    {
      name: 'footerText',
      title: 'Footer Text',
      type: 'text'
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
        title: 'Legal Page Content'
      };
    }
  }
};
