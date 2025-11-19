export default {
  name: 'contactSettingsHybrid',
  title: 'Contact Page Content',
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
        }
      ]
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'email',
          title: 'Email Address',
          type: 'string'
        },
        {
          name: 'whatsapp',
          title: 'WhatsApp Number',
          type: 'string'
        },
        {
          name: 'responseTime',
          title: 'Response Time',
          type: 'string'
        }
      ]
    },
    {
      name: 'formSection',
      title: 'Form Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string'
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
        title: 'Contact Page Content'
      };
    }
  }
};
