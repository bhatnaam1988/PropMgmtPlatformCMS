export default {
  name: 'contactSettings',
  title: 'Contact Page Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
        },
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'text',
        },
      ],
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email Address',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        },
        {
          name: 'address',
          title: 'Physical Address',
          type: 'text',
          rows: 3,
        },
        {
          name: 'hoursOfOperation',
          title: 'Hours of Operation',
          type: 'text',
          rows: 3,
        },
      ],
    },
    {
      name: 'formSettings',
      title: 'Contact Form Settings',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Form Heading',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Form Description',
          type: 'text',
        },
        {
          name: 'submitButtonText',
          title: 'Submit Button Text',
          type: 'string',
          initialValue: 'Send Message',
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page Settings',
      };
    },
  },
};
