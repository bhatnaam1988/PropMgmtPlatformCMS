import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'default',
  title: 'Swiss Alpine Journey',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vrhdu6hl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  
  plugins: [
    structureTool({
      name: 'content',
      title: 'Content',
    }),
    visionTool({
      name: 'vision',
      title: 'Vision',
    }),
  ],
  
  schema: {
    types: schemaTypes,
  },
});
