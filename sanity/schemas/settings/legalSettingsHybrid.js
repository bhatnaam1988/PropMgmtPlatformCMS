export default {
  name: 'legalSettingsHybrid',
  title: 'Legal Page Content',
  type: 'document',
  fields: [
    {
      name: 'pageHeader',
      title: 'Page Header',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text'
        }
      ]
    },
    {
      name: 'navigationCards',
      title: 'Navigation Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'File Text', value: 'FileText' },
                  { title: 'Shield', value: 'Shield' },
                  { title: 'Cookie', value: 'Cookie' }
                ]
              }
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string'
            },
            {
              name: 'anchor',
              title: 'Anchor Link',
              type: 'string',
              description: 'e.g., #terms, #privacy, #gdpr'
            }
          ]
        }
      ]
    },
    {
      name: 'termsSection',
      title: 'Terms & Conditions Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Terms & Conditions'
        },
        {
          name: 'lastUpdated',
          title: 'Last Updated',
          type: 'string',
          description: 'e.g., November 2024'
        },
        {
          name: 'sections',
          title: 'Content Sections',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Section Title',
                  type: 'string'
                },
                {
                  name: 'content',
                  title: 'Section Content',
                  type: 'text',
                  rows: 5
                }
              ],
              preview: {
                select: {
                  title: 'title'
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'privacySection',
      title: 'Privacy Policy Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Privacy Policy'
        },
        {
          name: 'lastUpdated',
          title: 'Last Updated',
          type: 'string',
          description: 'e.g., November 2024'
        },
        {
          name: 'sections',
          title: 'Content Sections',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Section Title',
                  type: 'string'
                },
                {
                  name: 'content',
                  title: 'Section Content',
                  type: 'text',
                  rows: 5
                }
              ],
              preview: {
                select: {
                  title: 'title'
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'gdprSection',
      title: 'GDPR Information Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'GDPR Information'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'string'
        },
        {
          name: 'sections',
          title: 'Content Sections',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Section Title',
                  type: 'string'
                },
                {
                  name: 'content',
                  title: 'Section Content',
                  type: 'text',
                  rows: 5
                }
              ],
              preview: {
                select: {
                  title: 'title'
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'footerText',
      title: 'Footer Contact Text',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Text Before Link',
          type: 'string'
        },
        {
          name: 'linkText',
          title: 'Link Text',
          type: 'string'
        },
        {
          name: 'linkUrl',
          title: 'Link URL',
          type: 'string'
        }
      ]
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
